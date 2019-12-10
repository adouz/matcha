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
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="Visit this profil"
                    placement="left"
                  >
                    <a :href="'/profile/' + u.username">
                      <figure class="image is-48x48">
                        <img
                          :src="u.url ? u.url : 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'"
                          alt="Placeholder image"
                          class="rounded"
                        >
                      </figure>
                    </a>
                  </el-tooltip>
                </div>
                <div class="media-content">
                  <p class="title is-4">
                    <span class="fullname">
                      {{u.username}}
                      <el-tooltip
                        v-if="!u.lastconnnection"
                        class="item"
                        effect="dark"
                        :content="u.isOnline"
                        placement="right"
                      >
                        <span :class="u.isOnline"></span>
                      </el-tooltip>
                      <el-tooltip
                        v-else
                        class="item"
                        effect="dark"
                        :content="'offline: '+u.lastconnnection"
                        placement="right"
                      >
                        <span :class="u.isOnline"></span>
                      </el-tooltip>
                    </span>
                    <!-- ONLINE STATUS -->
                  </p>
                  <!-- <p class="subtitle is-6" v-if="u.typing">{{typing}} is typing...</p> -->
                  <p class="subtitle is-6">{{u.isOnline}}</p>
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
            <p v-if="typing === sendto">{{typing}} is typing...</p>
          </div>
          <picker v-if="showEmo" :data="emojiIndex" class="EmojiPicker" @select="addEmoji"/>
          <div v-if="room" class="controls field has-addons">
            <div class="control" @click="showEmo = !showEmo">
              <a class="button is-info">
                <i class="el-icon-star-on"></i>
              </a>
            </div>
            <div class="control is-expanded">
              <input
                class="input"
                type="text"
                maxlength="300"
                placeholder="write your message here"
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
import moment from "moment";
var socket = io.connect(":3000/messages", {
  query: "token=" + localStorage.getItem("token")
});

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
  beforeRouteLeave(to, from, next) {
    let users = this.users;
    users.forEach(user => {
      this.sockets.unsubscribe("isOnline" + user.username);
      this.sockets.unsubscribe("deleteroom");
    });
    next();
  },
  mounted() {
    this.$http
      .get("matches")
      .then(res => {
        if (res.data.data) {
          this.users = res.data.data;
          //console.log(this.users);
          // Online emit
          this.users.forEach(user => {
            this.$socket.emit("Online", { username: user.username });
          });
        }
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
      });
    socket.on("message from room", data => {
      //console.log("message from room ::", data);
      this.messages = [...this.messages, data];
      this.$nextTick(() => {
        var msgdis = this.$refs.msg;
        if (msgdis) {
          msgdis.scrollTop = msgdis.scrollHeight;
        }
      });
    });
    // typing under the user name
    socket.on("typing", data => {
      // this.users.forEach(user => {
      //   if (user.username === data) {
      //     //console.log("typing " + data);
      //     user.typing = data;
      //   }
      // });
      if (data != this.user.user_name) this.typing = data;
    });

    socket.on("stopTyping", data => {
      // this.users.forEach(user => {
      //   if (user.username === data) user.typing = "";
      // });
      //console.log("stopTyping " + data);
      if (data != this.user.user_name) this.typing = false;
    });
    this.sockets.subscribe("deleteroom", data => {
      this.users.forEach((elm, i) => {
        //console.log(elm);
        if (elm.username === data.blocked || elm.username === data.blocker) {
       //   console.log("delete " + elm.username);
          this.room = null;
          this.users.splice(i, 1);
        }
      });
    });
  },
  watch: {
    newMessage(val) {
      val
        ? socket.emit("typing", {
            from: this.user.user_name,
            room: this.room,
            token: localStorage.getItem("token")
          })
        : socket.emit("stopTyping", {
            from: this.user.user_name,
            room: this.room,
            token: localStorage.getItem("token")
          });
    },
    users: "onlinesocket"
  },
  methods: {
    onlinesocket() {
      let users = this.users;
      users.forEach(user => {
        this.sockets.subscribe("isOnline" + user.username, data => {
          if (data.online) {
            user.lastconnnection = "";
            user.isOnline = "online";
          } else {
            user.isOnline = "offline";
            user.lastconnnection = moment(data.last).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
        });
      });
    },
    addEmoji(emoji) {
      var emo = emoji.native;
      //console.log(emo);
      if (this.newMessage) this.newMessage = this.newMessage + emo;
      else this.newMessage = emo;
      this.showEmo = false;
    },
    send() {
      if (!this.room || !this.newMessage || !this.newMessage.trim()) return;
      socket.emit("room message", {
        room: this.room,
        from: this.user.user_name,
        to: this.sendto,
        msg: this.newMessage,
        token: localStorage.getItem("token")
      });
      this.newMessage = "";
    },
    getMessages(room) {
      return new Promise((reslove, reject) => {
        this.$http
          .get("/messages/" + room)
          .then(res => {
            var data = res.data;
            reslove(data);
          })
          .catch(err => reject(err));
      });
    },
    clickeduser(i) {
      this.chatloading = true;
      this.newMessage = null;
      this.room = this.users[i].room;
      let roomMessages = this.getMessages(this.room);
      roomMessages.then(
        data => {
          this.messages = data;
          this.$nextTick(() => {
            var msgdis = this.$refs.msg;
            if (msgdis) {
              msgdis.scrollTop = msgdis.scrollHeight;
            }
          });
        },
        err => console.log(err)
      );
      this.chatloading = false;
      socket.emit("joinroom", {
        room: this.users[i].room,
        token: localStorage.getItem("token")
      });
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
.columns {
  height: 600px;
  max-height: 600px;
}

.box {
  height: 600px;
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
  text-overflow: ellipsis;
}
.user2 {
  max-width: 400px;
  float: right;
  background-color: #dcf8c8;
  clear: both;
  margin-right: 3%;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;

}
.users {
  max-height: 600px;
}
.users .box {
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
.fullname {
  font-size: 1.2rem;
  align-items: center;
  text-align: left;
  margin-top: 2px;
  line-height: 1;
  font-weight: bold;
  color: #7957d5;
}

@media screen and (max-width: 768px) {
  .users {
    overflow-y: scroll;
    max-height: 140px;
  }
  .box {
    height: fit-content;
    max-height: 320px;
    padding: none;
  }
  .messages {
    padding: 5px;
    height: 210px;
  }
  .media {
    padding: 0;
    height: 15px;
  }
  .fullname {
    font-size: 1rem;
  }
  .card-content {
    padding-top: 0.1rem;
    padding-right: 1.5rem;
    padding-bottom: 2.4rem;
    padding-left: 1.5rem;
    border-radius: 0.5rem;
  }
  .card {
    border-radius: 0.5rem;
  }
  .no-matches {
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
  }
}
</style>
