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
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAlhMoDvlSEwV0Q87e2hNvmezSHxAksdu0"></script>
<script>
import Navbar from "./components/Navbar";
import LogedNavbar from "./components/LogedNavbar";
import Footer from "./components/Footer";
export default {
  name: "app",
  data() {
    return {
      err: false,
      pages1: ["login", "signup", "home", "verify"],
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
        "guests"
      ]
    };
  },
  components: {
    Navbar,
    LogedNavbar,
    Footer
  },
  computed: {
    username: function() {
      return this.$store.getters.getUser.user_name;
    }
  },
  mounted() {
    // console.log('%cMOVE ALONG! NOTHING TO SEE HERE', 'font-size: 40px; color: blue');
    // console.log('%c ', 'font-size:800px; background:url(https://s5.gifyu.com/images/tenor.gif) no-repeat;');


    //this.$socket.emit("new user", this.username);
    this.$socket.on("notification", data => {
      this.notifyUser(data);
    });
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
}; /* Check if is valide Token */
</script>

<style>
#navbar {
  /*margin-top: 20px;*/
  margin-bottom: 20px;
  background-color: #fafafa;
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
