<template>
  <div class="columns">
    <div class="column is-one-fifth">
      <div class="box">
        <!-- Menu  -->
        <center>
          <h5>Settings</h5>
        </center>
        <el-menu default-active="2">
          <router-link class="link" to="profile">
            <el-menu-item index="0">
              <b-icon icon="user-alt"></b-icon> Profil
            </el-menu-item>
          </router-link>
          <router-link class="link" to="account">
            <el-menu-item index="1">
              <b-icon icon="user-shield"></b-icon>  Account
            </el-menu-item>
          </router-link>
          <el-menu-item index="2">
            <b-icon icon="eye-slash"></b-icon>  Blocked
          </el-menu-item>
        </el-menu>
        <!-- end -->
      </div>
    </div>
    <div class="column">
      <div class="box scroll">
        <el-row :span="2" v-for="(u, i) in users" :key="i" class="box">
          <el-col :span="4">
            <el-badge :value="u.age+' Years Old'">
              <a :href="'/profile/' + u.username">
                <avatar v-if="u.image" :image="u.image" :fullname="u.names" :size="50"></avatar>
                <avatar v-else :fullname="u.fullname" :size="50"></avatar>
              </a>
            </el-badge>
          </el-col>
          <el-col :span="10">
            <a :href="'/profile/' + u.username">
              <div class="fullname">{{u.name}}</div>
            </a>
          </el-col>
          <el-col :span="7">
           <div class="date">blocked {{u.block_days}} days ago</div>
          </el-col>
          <el-col :span="2"><el-tooltip class="item" effect="dark" content="Unblock" placement="right">
              <el-button type="danger" circle @click="unblock(u.username)"><b-icon icon="unlock-alt"></b-icon></el-button>
          </el-tooltip>
          </el-col>
        </el-row>
         <div v-if="users.length === 0">No blocked profil.</div>

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
      search: ""
    };
  },
  mounted() {
    this.$http
      .get("/blocked")
      .then(res => {
        //console.log(res.data);
        this.users = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    unblock(username) {
      this.users.forEach((element, i) => {
        if (element.username === username) this.users.splice(i, 1);
      });
      //console.log("unblock ", username);
      this.$http
        .post("/unblock/" + username)
        .then(res => {
          res;
          //console.log(res.data);
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style>
.el-table_1_column_4 .cell {
  position: absolute;
  right: 0;
  top: 25px;
}
.image {
  margin: auto;
}
.open {
  transition: 0.5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}
.image:hover .img {
  opacity: 0.3;
}

.image:hover .open {
  opacity: 2;
}
.fullname {
  font-size: 1rem;
  display: flex;
  align-items: center;
  text-align: left;
  margin-top: 20px;
  line-height: 1;
  font-weight: bold;
  color: black;
}
.date{
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  margin-top: 15px;
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
  .date{
    font-size: 9.5px;
  }
}
</style>
