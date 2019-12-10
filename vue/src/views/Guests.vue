<template>
  <div class="columns">
    <div class="column is-one-quarter">
      <div class="box">
        <!-- Menu  -->
        <el-menu default-active="3">
          <router-link class="link" to="youlike">
            <el-menu-item index="0">
              <b-icon icon="heart"></b-icon>You like
            </el-menu-item>
          </router-link>
          <router-link class="link" to="likeyou">
            <el-menu-item index="1">
              <b-icon icon="grin-hearts"></b-icon>Who likes you ?
            </el-menu-item>
          </router-link>
          <router-link class="link" to="mutuallikes">
            <el-menu-item index="2">
              <b-icon icon="user-friends"></b-icon>Mutual likes
            </el-menu-item>
          </router-link>
          <el-menu-item index="3">
            <b-icon icon="eye"></b-icon>Guests
          </el-menu-item>
        </el-menu>
        <!-- end -->
      </div>
    </div>
    <div class="column">
      <div class="box">
        <!-- Main -->
        <!--Card-->
        <el-row :span="2" v-for="(u, i) in users" :key="i" class="box">
          <el-col :span="5">
            <el-badge :value="u.age+' Years Old'">
              <a :href="'/profile/' + u.username">
                <avatar v-if="u.url" :image="u.url" :fullname="u.fullname" :size="50"></avatar>
                <avatar v-else :fullname="u.fullname" :size="50"></avatar>
              </a>
            </el-badge>
          </el-col>
          <el-col :span="10">
            <a :href="'/profile/' + u.username">
              <div class="fullname">{{u.fullname}}</div>
            </a>
          </el-col>
          <el-col :span="9">
            <div class="date">
              <i class="el-icon-time"></i>
              <span>{{u.date}} {{u.time}}</span>
            </div>
          </el-col>
        </el-row>
        <div v-if="users.length === 0">No one visited your profil.</div>
        <!-- End Card-->
        <!-- End Main -->
      </div>
    </div>
  </div>
</template>


<script>
import Avatar from "vue-avatar-component";

export default {
  components: { Avatar },
  data() {
    return {
      users: [],
      cols: 4
    };
  },
  computed: {
    user: function() {
      return this.$store.getters.getUser;
    },
    userdata: function() {
      return this.$store.getters.getUser;
    },
    user_Images: function() {
      return this.$store.getters.getImages;
    },
    user_Tags: function() {
      return this.$store.getters.getTags;
    }
  },
  mounted() {
    // check for token
    if (!localStorage.token) this.$router.push({ path: "/login" });
    else
      this.$http.defaults.headers.common["x-access-token"] = localStorage.token;

    this.$http
      .get("visite/")
      .then(res => {
        if (res.data.data) this.users = res.data.data;
        this.loading = false;
        //console.log(this.users);
        //console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
<style scoped>
.fullname {
  font-size: 1rem;
  display: flex;
  align-items: center;
  text-align: left;
  margin-top: 15px;
  line-height: 1;
  font-weight: bold;
  color: black;
}
.date {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  margin-top: 10px;
  padding-bottom: 5px;
  padding-top: 5px;
  line-height: 1;
  font-weight: bold;
  color: white;
  border-radius: 30px;
  background-color: black;
}

@media screen and (max-width: 770px) {
  .fullname {
    font-size: 14px;
  }
  .date {
    font-size: 14px;
  }
}
</style>
