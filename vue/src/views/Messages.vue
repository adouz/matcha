<template>
  <div v-loading="loading">
    <div class="columns">
      <div class="column users">
        <div class="box">
          <div class="card" v-for="(u, i) in users" :key="i">
            <div
              class="card-content"
              :style="u.selected ? 'background-color: #6CC772;' : 'background-color: #fff;' "
              @click="clickeduser(i)"
              v-if="(u.username != user.user_name) && u.url"
            >
              <div class="media">
                <div class="media-left">
                  <!-- PROFILE IMAGE -->
                  <figure class="image is-48x48">
                    <img
                      :src="u.url ? u.url : 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'"
                      alt="Placeholder image"
                      class="rounded"
                    >
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-4">
                    <a :href="'/profile/' + u.username">
                      {{u.username}}
                      <i class="el-icon-link"></i>
                      <!-- ONLINE STATUS -->
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="u.isOnline"
                        placement="right"
                      >
                        <span :class="u.isOnline"></span>
                      </el-tooltip>
                    </a>
                  </p>
                  <p class="subtitle is-6">...</p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!users[0]">
            <div class="has-text-centered">
              <img
                class="image is-96x96 no-matches"
                src="http://simpleicon.com/wp-content/uploads/sad.png"
              >
              <p>you dont have any matches</p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-two-thirds" v-loading="chatloading">
        <div class="box">
          <div class="messages" ref="msg">
            <div class="message" v-for="(msg, indx) in messages" :key="indx">
              <div v-if="msg.room === room">
                <div class="notification user2" v-if="msg.from == user.user_name">{{msg.msg}}</div>
                <div class="notification is-info user1" v-else>{{msg.msg}}</div>
              </div>
            </div>
            <div v-if="!messages[0]">
              <div class="has-text-centered">
                <img
                  class="image is-96x96 no-matches"
                  src="https://cdn3.iconfinder.com/data/icons/glypho-free/64/speech-bubble-round-double-mixed-512.png"
                >
                <p>no messages to show here</p>
              </div>
            </div>
          </div>
          <div class="typing">
            <p v-if="room && typing">{{typing}} is typing...</p>
          </div>
          <picker v-if="showEmo" :data="emojiIndex" class="EmojiPicker" @select="addEmoji"/>
          <div class="controls field has-addons">
            <div class="control" @click="showEmo = !showEmo">
              <a class="button is-info">
                <i class="el-icon-star-on"></i>
              </a>
            </div>
            <div class="control is-expanded">
              <input
                class="input"
                type="text"
                placeholder="Find a repository"
                v-model="newMessage"
                @keyup.enter="send()"
              >
            </div>
            <div class="control" @click="send()">
              <a class="button is-info">
                <i class="el-icon-s-promotion"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from "../data/all.json";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import io from "socket.io-client";
var socket = io("localhost:3000/messages");

export default {
  components: {
    Picker
  },
  data() {
    return {
      newMessage: null,
      messages: [],
      typing: false,
      room: null,
      timer: null,
      loading: true,
      chatloading: false,
      showEmo: false,
      sendto: null,
      emojiIndex: new EmojiIndex(data),
      users: []
    };
  },
  computed: {
    user: function() {
      return this.$store.getters.getUser;
    }
  },
  beforeRouteEnter(to, from, next) {
    socket.connect();
    next();
  },
  beforeRouteLeave(to, from, next) {
    socket.disconnect();
    next();
  },
  mounted() {
    this.$http
      .get("matches/" + this.user.user_name)
      .then(res => {
        if (res.data.message === "Failed to authenticate token.")
          this.$router.push({ path: "/login" });
        if (res.data.data) {
          this.users = res.data.data;
          console.log(res.data.data);
          // Online emit
          this.users.forEach(user => {
            this.$socket.emit("Online", user.username);
          });
        }
        this.loading = false;
      })
      .catch(err => {
        console.error(err);
      });

    socket.on("message from room", data => {
      console.log("message from room ::", data);
      this.messages = [...this.messages, data];
      this.$nextTick(() => {
        var msgdis = this.$refs.msg;
        if (msgdis) {
          msgdis.scrollTop = msgdis.scrollHeight;
        }
      });
    });
    socket.on("typing", data => {
      if (data != this.user.user_name) this.typing = data;
    });

    socket.on("stopTyping", data => {
      if (data != this.user.user_name) this.typing = false;
    });
  },
  watch: {
    newMessage(val) {
      val
        ? socket.emit("typing", { from: this.user.user_name, room: this.room })
        : socket.emit("stopTyping", {
            from: this.user.user_name,
            room: this.room
          });
    },
    sendto(val) {
      console.log(val);
      this.$refs.msg.scrollTop = this.$refs.msg.scrollHeight;
    },
    users: "onlinesocket"
  },
  methods: {
    onlinesocket() {
      let users = this.users;
      users.forEach(user => {
        this.$socket.on("isOnline" + user.username, data => {
          if (data) user.isOnline = "online";
          else user.isOnline = "offline";
        });
      });
    },
    addEmoji(emoji) {
      var emo = emoji.native;
      console.log(emo);
      if (this.newMessage) this.newMessage = this.newMessage + emo;
      else this.newMessage = emo;
      this.showEmo = false;
    },
    send() {
      if (!this.room || !this.newMessage) return;
      socket.emit("room message", {
        room: this.room,
        from: this.user.user_name,
        to: this.sendto,
        msg: this.newMessage
      });
      this.newMessage = "";
    },
    getMessages(room) {
      return new Promise((reslove, reject) => {
        this.$http
          .get("/messages/" + room)
          .then(res => {
            if (res.data.message === "Failed to authenticate token.")
              this.$router.push({ path: "/login" });

            var data = res.data;
            reslove(data);
          })
          .catch(err => reject(err));
      });
    },
    clickeduser(i) {
      this.room = this.users[i].room;
      this.chatloading = true;
      let roomMessages = this.getMessages(this.room);
      roomMessages.then(
        data => (this.messages = data),
        err => console.log(err)
      );
      this.chatloading = false;
      socket.emit("joinroom", this.users[i].room);
      this.users[i].selected = true;
      this.users.forEach(function(user, index) {
        if (index !== i) {
          user.selected = false;
        }
      });
      this.sendto = this.users[i].username;
    }
  }
};
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
/*::-webkit-scrollbar { 
    display: none; 
}*/
.box {
  background-image: url("https://www.fakechatapp.com/app/pics/bg-whatsapp.png");
}
.messages {
  overflow-y: scroll;
  height: 500px;
}
.user1 {
  max-width: 400px;
  float: left;
  clear: both;
  margin-bottom: 5px;
  overflow: hidden;
}
.user2 {
  max-width: 400px;
  float: right;
  background-color: #dcf8c8;
  clear: both;
  margin-right: 3%;
  margin-bottom: 5px;
  overflow: hidden;
}
.users {
  max-height: 600px;
}
.users .box {
  height: 600px;
  overflow-y: scroll;
  padding: 5px;
}
.notification {
  padding: 8px 12px;
}
.card-content {
  cursor: pointer;
  margin-bottom: 8px;
}
.typing {
  display: inline-block;
  margin: 0;
}
.no-matches {
  margin-left: auto;
  margin-right: auto;
  margin-top: 200px;
}
.EmojiPicker {
  position: absolute;
  margin-top: 35px;
}
.rounded {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}
</style>
