<template>
<div class="columns">
    <div class="column is-one-quarter">
      <div class="box">
        <!-- Menu  -->
       <el-menu default-active="0">
            <el-menu-item index="0">
             <b-icon icon="heart">
            </b-icon>
            You like
          </el-menu-item>
          <router-link class="link" to="likeyou">
            <el-menu-item index="1">
            <b-icon icon="grin-hearts">
            </b-icon>
            Who likes you ?
          </el-menu-item>
          </router-link>
          <router-link class="link" to="mutuallikes">
          <el-menu-item index="3">
            <b-icon icon="user-friends">
            </b-icon>
            Mutual likes
          </el-menu-item>
          </router-link>
          <router-link class="link" to="guests">
            <el-menu-item index="3">
             <b-icon icon="eye">
            </b-icon>
            Guests
          </el-menu-item>
          </router-link>
        </el-menu>
        <!-- end -->
      </div>
    </div>
    <div class="column">
      <div class="box">
        <!-- Main -->
     <div class="pure-g">
          <div
            class="photo-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4"
            v-for="(u, i) in users"
            :key="i"
          >
            <carousel :perPage="1">
              <el-tooltip v-if="!u.user.lastconnnection" class="item" effect="dark" :content="u.user.isOnline" placement="left">
                      <span :class="u.user.isOnline"></span>
              </el-tooltip>
              <el-tooltip v-else class="item" effect="dark" :content="'offline: '+u.user.lastconnnection" placement="left">
                      <span :class="u.user.isOnline"></span>
              </el-tooltip>
              <slide v-for="(img, j) in u.Images" :key="j">
                
                <img :src="img.url" alt="Avatar" class="image">
              </slide>
            </carousel>
            <aside class="photo-box-caption">
              <span class="location">
                <i class="el-icon-location"></i>
                {{u.user.distance}} km away
              </span>
              <span>
                <br>
                  
                <a :href="'/profile/' + u.user.user_name">
                  <i class="el-icon-user-solid"></i>
                  {{u.user.user_fullname}}
                </a>
                , {{u.user.user_age}}
              </span>
            </aside>
           
          </div>
        </div>
        <div v-if="users.length === 0">
              There's no one you like.
        </div>
        <!-- End Main -->
      </div>
    </div>
  </div>
</template>


<script>
import { Carousel, Slide } from "vue-carousel";
import moment from 'moment'
export default {
  components: {
    Carousel,
    Slide
  },
  data() {
    return {
      users: [],
      cols: 4
    };
  },
  computed: {
   
  },
  mounted() {
    if (!localStorage.token) this.$router.push({ path: "/login" });
    else
      this.$http.defaults.headers.common["x-access-token"] = localStorage.token;

    this.$http
      .get("likedUsers/")
      .then(res => {
        if (res.data.data) this.users = res.data.data;
        this.loading = false;
      })
      .catch(err => {
        console.error(err);
      });
  },
  methods: {
    onlinesocket() {
      let users = this.users;
      users.forEach(user => {
        this.$socket.on("isOnline" + user.username, data => {
          if (data.online){
            user.lastconnnection = '';
            user.isOnline = "online";
          }else{
            user.isOnline = "offline";
            user.lastconnnection = moment(data.last).format('YYYY-MM-DD HH:mm:ss');
          }
        });
      });
    }
  }
};
</script>
<style scoped>
.image {
  width: 100%;
  height: 20vh;
  display: block;
}

.item {
     position: fixed;
    top: 5%;
    left: 5%;
    z-index: 3;
}
.bio {
  font-family: "Candara body copy";
  font-size: 14px;
  font-style: italic;
  color: white;
}

.l-box {
  padding: 2em;
}

.photo-box {
  overflow: hidden;
  position: relative;
  /* height: 250px; */
  height: 20vh;
  width: 100%;
  text-align: center;
  border-radius: 10px;
  border: 1px solid #f1f1f1;
}

.photo-box-thin {
  height: 120px;
}

.photo-box img {
  max-width: 100%;
  /* height: auto; */
  min-height: 20vh;
}

.photo-box aside {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 1em 0.5em;
  color: white;
  width: 100%;
  font-size: 80%;
  text-align: left;
  background: -moz-linear-gradient(
    top,
    rgba(16, 27, 30, 0) 0%,
    rgba(12, 2, 2, 1) 90%
  ); /* FF3.6+ */
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, rgba(16, 27, 30, 0)),
    color-stop(90%, rgba(12, 2, 2, 1))
  ); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(
    top,
    rgba(16, 27, 30, 0) 0%,
    rgba(12, 2, 2, 1) 90%
  ); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(
    top,
    rgba(16, 27, 30, 0) 0%,
    rgba(12, 2, 2, 1) 90%
  ); /* Opera 11.10+ */
  background: -ms-linear-gradient(
    top,
    rgba(16, 27, 30, 0) 0%,
    rgba(12, 2, 2, 1) 90%
  ); /* IE10+ */
  background: linear-gradient(
    to bottom,
    rgba(16, 27, 30, 0) 0%,
    rgba(12, 2, 2, 1) 90%
  ); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00101b1e', endColorstr='#0c0202',GradientType=0 ); /* IE6-9 */
}

.photo-box aside .location {
  color: #58d818;
  text-shadow: 7px 6px 27px green;
  font-weight: normal;
  font-size: 95%;
}

.photo-box aside span a {
  color: #ccc;
  font-weight: bold;
  text-decoration: none;
}
.photo-box aside {
  color: white;
  font-weight: bold;
  font-size: 80%;
}
@media screen and (min-width: 20em) {
  .pure-u-md-1-2 {
    display: inline-block;
    zoom: 1;
    letter-spacing: normal;
    word-spacing: normal;
    vertical-align: top;
    text-rendering: auto;
  }
  .pure-u-md-1-2{
    width: 50%;
  } 
}
@media screen and (min-width: 64em) {
  .pure-u-lg-1-4 {
    display: inline-block;
    zoom: 1;
    letter-spacing: normal;
    word-spacing: normal;
    vertical-align: top;
    text-rendering: auto;
  }
  .pure-u-lg-1-4 {
    width: 25%;
  }
}
</style>
