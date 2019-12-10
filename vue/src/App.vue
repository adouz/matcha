<template>
  <div id="app">
    <div id="content">
      <Navbar v-if="pages1.indexOf($route.name) > -1" id="navbar"/>
      <LogedNavbar v-else-if="pages2.indexOf($route.name) > -1" id="navbar"/>
      <router-view class="routerview"/>
    </div>
    <Footer/>
  </div>
</template>
<script>
import Navbar from "./components/Navbar";
import LogedNavbar from "./components/LogedNavbar";
import Footer from "./components/Footer";
export default {
  name: "app",
  data() {
    return {
      err: false,
      pages1: ["login", "signup", "verify", "reset"],
      pages2: [
        "settings",
        "dashboard",
        "profile",
        "profil",
        "account",
        "messages",
        "visite",
        "blocked",
        "mutuallikes",
        "guests",
        "browse",
        "search",
        "youlike",
        "likeyou",
        "notification"
      ]
    };
  },
  components: {
    Navbar,
    LogedNavbar,
    Footer
  },
  sockets:{
    notification: function (data) {
      this.notifyUser(data);
    }
  },
  computed: {
    username: function() {
      return this.$store.getters.getUser.user_name;
    }
  },
  methods: {
    notifyUser(data) {
        this.$notify({
          title: data.title,
        message: data.msg,
        position: "bottom-right"
      });
    }
  }
};
</script>

<style>

#navbar {
  /*margin-top: 20px;*/
  margin-bottom: 20px;
}
@media screen and (min-width: 1268px) {
  #navbar,
  .routerview {
    padding-left: 20%;
    padding-right: 20%;
  }
}
#content {
  margin-left: 0px;
  margin-right: 0px;
  display: flex;
  min-height: 90vh;
  flex-direction: column;
}
</style>
