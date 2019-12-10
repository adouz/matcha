<template>
  <div>
    <!-- disktop navbar -->
    <b-navbar class="is-hidden-touch trans">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/dashboard' }">
          <img src="@/assets/logo.png" alt="Chalada Website">
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/dashboard' }">
          <b-icon icon="diagnoses"></b-icon>&nbsp;&nbsp;Dashboard
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/browse' }">
          <b-icon icon="random"></b-icon>&nbsp;&nbsp;Browse
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/search' }">
          <b-icon icon="search"></b-icon>&nbsp;&nbsp;Search
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/messages' }">
          <b-icon icon="comments"></b-icon>&nbsp;&nbsp;Messages
        </b-navbar-item>
      </template>
      <template slot="end">
        <div class="bell">
          <div @click="notification">
            <el-dropdown trigger="click" class="is-hidden-touch">
              <div>
                <el-badge
                  :value="nbrNotification"
                  :max="99"
                  class="item"
                  v-if="nbrNotification > 0"
                >
                  <b-icon icon="bell" style="font-size: 1.93em;"></b-icon>
                </el-badge>
                <b-icon v-else icon="bell" style="font-size: 1.93em;"></b-icon>
              </div>
              <el-dropdown-menu slot="dropdown" class="dropdownlol">
                <div v-loading="notifLoading" v-for="(notif, index) in notifi" :key="index">
                  <el-dropdown-item
                    :style="notif.read ? 'background-color: rgb(238, 241, 250)' : ''"
                    style="cursor: default;"
                  >
                    <el-badge is-dot v-if="notif.read">
                      <i class="el-icon-folder" style="font-size: 1.5em;"></i>
                    </el-badge>
                    <i v-else class="el-icon-folder-opened" style="font-size: 1.5em;"></i>
                    <span class="title is-6">{{notif.title}}</span>
                    <br>
                    <span class="subtitle is-7">{{notif.msg}}</span>
                  </el-dropdown-item>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <el-dropdown trigger="click" class="is-hidden-touch">
          <avatar v-if="imageProfil" :image="imageProfil" :fullname="user.user_fullname" :size="50"></avatar>
          <avatar v-else :fullname="user.user_fullname" :size="50"></avatar>
          <el-dropdown-menu slot="dropdown">
            <router-link class="link" :to="'/profile/'+user.user_name">
              <el-dropdown-item>
                <b-icon pack="fas" icon="user-alt"></b-icon>
                <span>Profile</span>
              </el-dropdown-item>
            </router-link>
            <router-link class="link" to="/settings/profile">
              <el-dropdown-item>
                <b-icon pack="fas" icon="user-cog"></b-icon>
                <span>Settings</span>
              </el-dropdown-item>
            </router-link>
            <router-link class="link" to="/logout">
              <el-dropdown-item>
                <b-icon pack="fas" icon="sign-out-alt"></b-icon>
                <span>log out</span>
              </el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </b-navbar>
    <!-- end -->
    <!-- mobile navbar -->
    <nav class="navbar is-hidden-desktop" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <div class="navbar-item">
          <img src="./../assets/logo.png" alt="Matcha">
        </div>
        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          @click="isOpen = !isOpen"
          v-bind:class="{'is-active': isOpen}"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu" v-bind:class="{'is-active': isOpen}">
        <div class="navbar-start">
          <router-link class="link" to="/dashboard">
            <div class="navbar-item">
              <b-icon icon="diagnoses"></b-icon>&nbsp;&nbsp;Dashboard
            </div>
          </router-link>
          <router-link class="link" to="/browse">
            <div class="navbar-item">
              <b-icon icon="search"></b-icon>&nbsp;&nbsp;Browse
            </div>
          </router-link>
           <router-link class="link" to="/search">
            <div class="navbar-item">
              <b-icon icon="random"></b-icon>&nbsp;&nbsp;Search
            </div>
          </router-link>
          <router-link class="link" to="/messages">
            <div class="navbar-item">
              <b-icon icon="comments"></b-icon>&nbsp;&nbsp;Messages
            </div>
          </router-link>
          <div @click="turnoff">
          <router-link class="link" to="/notification">
            <div class="navbar-item">
              <el-badge :value="nbrNotification" :max="99" class="item" v-if="nbrNotification > 0">
                <b-icon icon="bell"></b-icon>
              </el-badge>
              <b-icon v-else icon="bell"></b-icon>&nbsp;&nbsp;Notification
            </div>
          </router-link>
          </div>
        </div>
        <div class="navbar-end">
          <b-navbar-dropdown :label="user.user_fullname">
            <router-link class="link" :to="{ path:'/profile/'+ user.user_name }">
              <div class="navbar-item">
                <b-icon pack="fas" icon="user-alt"></b-icon>
                <span>Profil</span>
              </div>
            </router-link>
            <router-link class="link" :to="{ path: '/settings/profile' }">
              <div class="navbar-item">
                <b-icon pack="fas" icon="user-cog"></b-icon>
                <span>Settings</span>
              </div>
            </router-link>
            <router-link class="link" :to="{ path: '/logout' }">
              <div class="navbar-item">
                <b-icon pack="fas" icon="sign-out-alt"></b-icon>
                <span>log out</span>
              </div>
            </router-link>
          </b-navbar-dropdown>
        </div>
      </div>
    </nav>
    <!-- end -->
  </div>
</template>

<script>
import Avatar from "vue-avatar-component";

export default {
  components: { Avatar },
  data() {
    return {
      notifi: [],
      notifLoading: true,
      imageProfil: null,
      NewNotification: false,
      nbrNotification: 0,
      isOpen: false
    };
  },
  computed: {
    user: function() {
      return this.$store.getters.getUser;
    },
    user_images: function() {
      return this.$store.getters.getImages;
    },
    user_tags: function() {
      return this.$store.getters.getTags;
    }
  },
  created() {
    this.update();
  },
  mounted() {
    this.$root.$on("refreshAvatar", () => {
      this.imageProfil = null;
      this.update();
    });
    if (
      !this.user.user_gender ||
      !this.user.user_bio ||
      !this.user.user_prefer ||
      !this.user_images.length ||
      !this.user_tags.length
    )
      if (this.$router.currentRoute.path !== "/settings/profile")
        this.$router.push({ path: "/settings/profile" });
    this.$socket.emit("new user", {username:this.user.user_name});
    // check for new notification
    this.$nextTick(this.checkNotif());
  },
  sockets:{
    notification: function () {
      this.nbrNotification = this.nbrNotification + 1;
      this.NewNotification = true;
    }
  },
  methods: {
    checkNotif() {
      this.$http
        .get("/newNotification")
        .then(res => {
          if (res.data.length) this.nbrNotification = res.data.length;
        })
        .catch(err => console.log(err));
    },
    update() {
      this.$store
        .dispatch("login", { user: this.user.user_name })
        .then(res => {
          var img = res.data.images;
          img.forEach(element => {
            if (element.image_type === "PROFIL")
              this.imageProfil = element.url;
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    getNotification() {
      return new Promise((resolve, reject) => {
        //console.log("send notification req!");
        this.$http
          .get("/notification")
          .then(res => {
            var data = res.data;
            resolve(data);
          })
          .catch(err => reject(err));
      });
    },
    notification() {
      this.notifLoading = true;
      this.NewNotification = false;
      // set all notification as read
      this.getNotification().then(
        data => {
          this.notifi = data;
          //console.log(data);
          this.$http
            .post("SetAllNotification/")
            .then(res => {
              res;
              //console.log(res.data);
            })
            .catch(err => {
              console.log(err);
            });
          this.NewNotification = false;
          this.nbrNotification = 0;
          this.notifLoading = false;
        },
        err => console.log(err)
      );
    },
    turnoff(){
      this.NewNotification = false;
      this.nbrNotification = 0;
    }
  }
};
</script>

<style>
.link {
  color: rgb(0, 0, 0);
}
.link:hover {
  color: #00f;
}
.visible-mobile {
  display: none;
}
@media screen and (max-width: 1023px) {
  .visible-mobile {
    display: block;
  }
}
.bell {
  margin: 10px;
  padding-right: 10px;
  cursor: pointer;
}
.dropdownlol {
  height: 260px;
  width: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.NewNotify {
  height: 10px;
  width: 10px;
  background-color: #ff0000;
  border-radius: 50%;
  position: fixed;
}
</style>