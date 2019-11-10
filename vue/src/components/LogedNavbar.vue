<template>
  <b-navbar>
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/dashboard' }">
        <img src="./../assets/logo.png" alt="Chalada Website">
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item tag="router-link" :to="{ path: '/dashboard' }">Dashboard</b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/browse' }">Browse</b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/messages' }">Messages</b-navbar-item>
    </template>
    <template slot="end">
      <div class="bell">
        <div @click="notification">
          <el-dropdown trigger="click" class="is-hidden-touch">
            <i class="el-icon-bell" style="font-size: 1.93em;">
              <span v-if="NewNotification" class="NewNotify"></span>
            </i>
            <el-dropdown-menu slot="dropdown" class="dropdownlol" >
              <div v-loading="notifLoading" v-for="(notif, index) in notifi" :key="index" >
                <el-dropdown-item icon="el-icon-message" :style="notif.read ? 'background-color: rgb(238, 241, 250)' : ''" style="cursor: default;">
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
            <router-link class="link" to="/settings/account">
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
      <div class="visible-mobile">
        <template>
          <b-navbar-dropdown :label="user.user_fullname">
            <b-navbar-item tag="router-link" :to="{ path:'/profile/'+ user.user_name }">
              <b-icon pack="fas" icon="user-alt"></b-icon>
              <span>Profil</span>
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/settings/account' }">
              <b-icon pack="fas" icon="user-cog"></b-icon>
              <span>Settings</span>
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/logout' }">
              <b-icon pack="fas" icon="sign-out-alt"></b-icon>
              <span>log out</span>
            </b-navbar-item>
          </b-navbar-dropdown>
        </template>
      </div>
    </template>
  </b-navbar>
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
      NewNotification: false
    };
  },
  // beforeRouteLeave (to, from, next) {
  //   console.log('beforeRouteLeave');
  //   if (
  //     !this.user.user_gender ||
  //     !this.user.user_bio ||
  //     !this.user.user_prefer || !this.user_images.length || !this.user_tags.length
  //   ) {
  //     this.$message({
  //     message: 'Warning, you have to fill your profile first',
  //     type: 'warning'
  //     });
  //   }else{
  //     next();
  //   }
  // },
  computed: {
    user: function() {
      return this.$store.getters.getUser;
    },
    user_images: function() {
      return this.$store.getters.getImages;
    },
    user_tags: function() {
      return this.$store.getters.getTags;
    },

  },
created() {
    console.log(this.user_images);
    var token = localStorage.getItem("token");
    this.$store.dispatch("login", { user: this.user.user_name, token: token }).then(
      res => {
        var img = res.data.images;
        img.forEach(element => {
          if (element.image_type === "PROFIL") this.imageProfil = element.url;
        });
      }
    );
  },
  mounted() {
    // user Data
    if (!localStorage.token) this.$router.push({ path: "/login" });
    console.log(!this.user.user_gender ,!this.user.user_bio , !this.user.user_prefer, this.user_images.length, this.user_tags.length);
    if (!this.user.user_gender || !this.user.user_bio || !this.user.user_prefer || !this.user_images.length || !this.user_tags.length)
      if (this.$router.currentRoute.path !== "/settings/profile")
        this.$router.push({ path: "/settings/profile" });
    this.$socket.emit("new user", this.user.user_name);
    // TODO: first login notification
    this.$socket.on("notification", data => {
      this.$notify({
        title: data.title,
        message: data.msg,
        position: "bottom-right"
      });
      this.NewNotification = true;
    });
  },
  methods: {
    getNotification(username) {
      return new Promise((resolve, reject) => {
        console.log("send notification req!");
        this.$http
          .get("/notification/" + username)
          .then(res => {
            if (res.data.message === "Failed to authenticate token.")
              this.$router.push({ path: "/login" });
            var data = res.data;
            resolve(data);
          })
          .catch(err => reject(err));
      });
    },
    SetAllNotification() {
      return new Promise((resolve, reject) => {
        this.$http
          .post("SetAllNotification/")
          .then(res => {
            if (res.data.message === "Failed to authenticate token.")
              this.$router.push({ path: "/login" });
            console.log(res.data);
            resolve(res.data);
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      });
    },
    notification() {
      this.notifLoading = true;
      this.NewNotification = false;
      // set all notification as read
      this.getNotification(this.user.user_name).then(
        data => {
          this.notifi = data;
          console.log(data);
          this.$http
            .post("SetAllNotification/")
            .then(res => {
            if (res.data.message === "Failed to authenticate token.")
              this.$router.push({ path: "/login" });
              console.log(res.data);
            })
            .catch(err => {
              console.log(err);
            });
          this.notifLoading = false;
        },
        err => console.error(err)
      );
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