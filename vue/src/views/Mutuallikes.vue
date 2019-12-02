<template>
  <!-- <el-row :gutter="15">
    <el-col :span="6" v-for="(u, i) in users" :key="i">
      <el-card v-if="u.url" :body-style="{ padding: '0px' }">
        <div class="cont"><img :src="u.url" class="image">
        <div class="overlay">
         <a :href="'/profile/' + u.username">
                      <i class=" icont el-icon-user-solid"></i>
                    </a>
        </div>
        
        </div>
        <div class="info">
            <div class = "fullname"> {{u.fullname}} - {{u.age}}</div>
            <div class = "cc"> {{u.country}}, {{u.city}} </div>
          <div class="bottom clearfix">
            <p class="bio">“{{ u.bio }}”</p>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>-->

  <div class="columns">
    <div class="column is-one-quarter">
      <div class="box">
        <!-- Menu  -->
        <el-menu default-active="2">
          <router-link class="link" to="youlike">
            <el-menu-item index="0">
              <b-icon icon="heart">
            </b-icon>
              You like
            </el-menu-item>
          </router-link>
          <router-link class="link" to="likeyou">
            <el-menu-item index="1">
             <b-icon icon="grin-hearts">
            </b-icon>
              Who likes you ?
            </el-menu-item>
          </router-link>
          <el-menu-item index="2">
            <b-icon icon="user-friends">
            </b-icon>
            Mutual likes
          </el-menu-item>
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
        <!--Card-->
        <!-- <div class="columns">
          <div class="column" v-for="(j, x) in columns" :key="x">
            <div class="flip-card" v-for="(u, i) in j" :key="i">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <img
                    :src="u.url ? u.url : 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'"
                    alt="Avatar"
                    class="image"
                  >
                  <el-tooltip class="item" effect="dark" :content="u.isOnline" placement="right">
                    <span :class="u.isOnline"></span>
                  </el-tooltip>
                </div>
                <div class="flip-card-back">
                  <br>
                  <h1 class="fullname">{{u.fullname}}</h1>
                  <h1 class="age">{{u.age}}</h1>
                  <p class="cc">{{u.country}}, {{u.city}}</p>
                  <a :href="'/profile/' + u.username">
                    <i class="icont el-icon-user-solid"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>-->

        <!-- <el-row  v-for="(j, x) in columns" :key="x">
      <el-col :span="6" v-for="(u, i) in j" :key="i">
        <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <img
                    :src="u.url ? u.url : 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'"
                    alt="Avatar"
                    class="image"
                  >
                  <el-tooltip class="item" effect="dark" :content="u.isOnline" placement="right">
                    <span :class="u.isOnline"></span>
                  </el-tooltip>
                </div>
                <div class="flip-card-back">
                  <br>
                  <h1 class="fullname">{{u.fullname}}</h1>
                  <h1 class="age">{{u.age}}</h1>
                  <a :href="'/profile/' + u.username">
                    <i class="icont el-icon-user-solid"></i>
                  </a>
                </div>
              </div>
            </div>

      </el-col>
        </el-row>-->

        <!-- <div class="pure-g">
          <div
            class="photo-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4"
            v-for="(u, i) in users"
            :key="i"
          >
        <img :src="u.url" alt="Avatar" class="image">-->
        <!-- <carousel :perPage="1"> -->

        <!-- <slide v-for="(img, j) in u.Images" :key="j"> -->

        <!-- <el-tooltip class="item" effect="dark" :content="u.isOnline" placement="left">
                      <span :class="u.isOnline"></span>
        </el-tooltip>-->
        <!-- </slide> -->
        <!-- </carousel> -->
        <!-- <aside class="photo-box-caption">
              <span class="location">
                <i class="el-icon-location"></i>
                {{u.distance}} km away
              </span> 
              <span>
                <br>
                  
                <a :href="'/profile/' + u.username">
                  <i class="el-icon-user-solid"></i>
                  {{u.fullname}}
                </a>
                , {{u.age}}
              </span>
            </aside>
           
          </div>
        </div>-->
        <div class="pure-g" v-if="users">
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
        <div v-if="users.length === 0">There's no matches for you.</div>
        <!-- End Main -->
        <!-- End Card-->
        <!-- <div class="card"  v-for="(u, i) in j" :key="i">
          <div class="card-image">
            <figure class="image is-4by3">
              <img src="http://placehold.it/300x225" alt="">
            </figure>
          </div>
          <div class="card-content">
            <div class="content">
              <span class="tag is-dark">#webdev</span>
              <strong class="timestamp">2 d</strong>
            </div>
          </div>
          <footer class="card-footer">

          </footer>
        </div>-->

        <!--End Card-->

        <!-- <div class="column" :span="6" v-for="(u, i) in users" :key="i">
          
        </div>-->
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
  mounted() {
    // check for token
    if (!localStorage.token) this.$router.push({ path: "/login" });
    else
      this.$http.defaults.headers.common["x-access-token"] = localStorage.token;

    this.$http
      .get("matchedUsers/")
      .then(res => {
        if (res.data.data) this.users = res.data.data;
        console.log("HERE",this.users);
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
          if (data.online) {
            user.lastconnnection = '';
            user.isOnline = "online";
          }else{
            user.isOnline = "offline";
            this.lastconnnection = moment(data.last).format('YYYY-MM-DD HH:mm:ss');
          }  
        });
      });
    }
  }
};
</script>
<style scoped>
/* .bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
} */

/* .image {
  width: 100%;
  height: 200px;
  display: block;
  position: absolute;
  border-radius: 10%;
} */

/* .clearfix:before,
.clearfix:after {
  display: table;
}

.clearfix:after {
  clear: both;
} */
/* .fullname {
  font-family: "Candara Header";
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1;
  padding: 0;
  margin: 0;
  font-weight: bold;
  color: white;
}
.age {
  font-family: Tahoma;
  font-size: 24px;
  font-weight: bold;
  color: black;
}
.cc {
  font-family: "Candara body copy";
  font-size: 12px;
  color: rgb(8, 35, 53);
} */
/* .profil {
  position: absolute;
  margin-top: 10px;
} */
/* .cont {
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-align: center;
  height: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: 0.3s ease;
}

.cont:hover .overlay {
  opacity: 1;
} */

/* .icont {
  color: white;
  font-size: 3rem;
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
} */

/* @media screen and (max-width: 770px){
   .flip-card-front,
.flip-card-back,.image,.flip-card-inner,.flip-card{
      max-height: 120px;
      
}
.fullname {
  font-size: 12px;
}
.age {
  font-size: 20px;
}
.cc {
  font-size: 8px;
}
} */

.image {
  width: 100%;
  height: 20vh;
  display: block;
}

/* .clearfix:before,
.clearfix:after {
  display: table;
}

.clearfix:after {
  clear: both;
} */
/* .fullname {
  font-family: "Candara Header";
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1;
  padding: 0;
  margin: 0;
  font-weight: bold;
  color: white;
}
.age {
  font-family: Tahoma;
  font-size: 24px;
  font-weight: bold;
  color: black;
}
.cc {
  font-family: "Candara body copy";
  font-size: 12px;
  color: rgb(8, 35, 53);
} */
/* .profil {
  position: absolute;
  margin-top: 10px;
} */
/* .cont {
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-align: center;
  height: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: 0.3s ease;
}

.cont:hover .overlay {
  opacity: 1;
} */

/* .icont {
  color: black;
  font-size: 3rem;
  position: absolute;
  top: 10%;
  left: 15%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
} */

/* @media screen and (max-width: 770px) {
  .flip-card-front,
  .flip-card-back,
  .image,
  .flip-card-inner,
  .flip-card {
    max-height: 120px;
  }
  .fullname {
    font-size: 12px;
  }
  .age {
    font-size: 20px;
  }
  .cc {
    font-size: 8px;
  }
} */

/*@media screen and (min-width: 1625px){
  .info {
    padding: 14px;
    min-height:22vh;}}*/
/* .flip-card {
  border-radius: 10%;
  background-color: transparent;
  width: 100%;
  height: 200px;
  border: 1px solid #f1f1f1;
  perspective: 1000px; /* Remove this if you don't want the 3D effect 
} */

/* This container is needed to position the front and back side */
/* .flip-card-inner {
  border-radius: 10%;
  position: relative;
  width: 100%;
  height: 200px;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
} */

/* Do an horizontal flip when you move the mouse over the flip box container */
/* .flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
} */

/* Position the front and back side */
/* .flip-card-front,
.flip-card-back {
  border-radius: 10%;
  position: absolute;
  width: 100%;
  height: 200px;
  backface-visibility: hidden;
} */

/* Style the front side (fallback if image is missing) */
/* .flip-card-front {
  background-color: #bbb;
  color: black;
} */

/* Style the back side */
/* .flip-card-back {
  background-image: url("./../assets/backcard.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  transform: rotateY(180deg);
} */

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

/* @media (min-width: 30em) {
    .photo-box {
        text-align: left;
    }

    .photo-box-thin {
        height: 250px;
    }
} */

/*@media screen and (min-width:35.5em){.pure-u-sm-1,.pure-u-sm-1-1,.pure-u-sm-1-12,.pure-u-sm-1-2,.pure-u-sm-1-24,.pure-u-sm-1-3,.pure-u-sm-1-4,.pure-u-sm-1-5,.pure-u-sm-1-6,.pure-u-sm-1-8,.pure-u-sm-10-24,.pure-u-sm-11-12,.pure-u-sm-11-24,.pure-u-sm-12-24,.pure-u-sm-13-24,.pure-u-sm-14-24,.pure-u-sm-15-24,.pure-u-sm-16-24,.pure-u-sm-17-24,.pure-u-sm-18-24,.pure-u-sm-19-24,.pure-u-sm-2-24,.pure-u-sm-2-3,.pure-u-sm-2-5,.pure-u-sm-20-24,.pure-u-sm-21-24,.pure-u-sm-22-24,.pure-u-sm-23-24,.pure-u-sm-24-24,.pure-u-sm-3-24,.pure-u-sm-3-4,.pure-u-sm-3-5,.pure-u-sm-3-8,.pure-u-sm-4-24,.pure-u-sm-4-5,.pure-u-sm-5-12,.pure-u-sm-5-24,.pure-u-sm-5-5,.pure-u-sm-5-6,.pure-u-sm-5-8,.pure-u-sm-6-24,.pure-u-sm-7-12,.pure-u-sm-7-24,.pure-u-sm-7-8,.pure-u-sm-8-24,.pure-u-sm-9-24{display:inline-block;zoom:1;letter-spacing:normal;word-spacing:normal;vertical-align:top;text-rendering:auto}.pure-u-sm-1-24{width:4.1667%}.pure-u-sm-1-12,.pure-u-sm-2-24{width:8.3333%}.pure-u-sm-1-8,.pure-u-sm-3-24{width:12.5%}.pure-u-sm-1-6,.pure-u-sm-4-24{width:16.6667%}.pure-u-sm-1-5{width:20%}.pure-u-sm-5-24{width:20.8333%}.pure-u-sm-1-4,.pure-u-sm-6-24{width:25%}.pure-u-sm-7-24{width:29.1667%}.pure-u-sm-1-3,.pure-u-sm-8-24{width:33.3333%}.pure-u-sm-3-8,.pure-u-sm-9-24{width:37.5%}.pure-u-sm-2-5{width:40%}.pure-u-sm-10-24,.pure-u-sm-5-12{width:41.6667%}.pure-u-sm-11-24{width:45.8333%}.pure-u-sm-1-2,.pure-u-sm-12-24{width:50%}.pure-u-sm-13-24{width:54.1667%}.pure-u-sm-14-24,.pure-u-sm-7-12{width:58.3333%}.pure-u-sm-3-5{width:60%}.pure-u-sm-15-24,.pure-u-sm-5-8{width:62.5%}.pure-u-sm-16-24,.pure-u-sm-2-3{width:66.6667%}.pure-u-sm-17-24{width:70.8333%}.pure-u-sm-18-24,.pure-u-sm-3-4{width:75%}.pure-u-sm-19-24{width:79.1667%}.pure-u-sm-4-5{width:80%}.pure-u-sm-20-24,.pure-u-sm-5-6{width:83.3333%}.pure-u-sm-21-24,.pure-u-sm-7-8{width:87.5%}.pure-u-sm-11-12,.pure-u-sm-22-24{width:91.6667%}.pure-u-sm-23-24{width:95.8333%}.pure-u-sm-1,.pure-u-sm-1-1,.pure-u-sm-24-24,.pure-u-sm-5-5{width:100%}}*/
@media screen and (min-width: 20em) {
  .pure-u-md-1-2 {
    display: inline-block;
    zoom: 1;
    letter-spacing: normal;
    word-spacing: normal;
    vertical-align: top;
    text-rendering: auto;
  }
  .pure-u-md-1-2 {
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
