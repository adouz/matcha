<template>
  <div class="columns">
    <div class="column is-one-quarter">
      <div class="box">
        <!-- Menu  -->
        <el-menu>
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
            <el-menu-item index="3">
              <b-icon icon="user-friends"></b-icon>Mutual likes
            </el-menu-item>
          </router-link>
          <router-link class="link" to="guests">
            <el-menu-item index="3">
              <b-icon icon="eye"></b-icon>Guests
            </el-menu-item>
          </router-link>
        </el-menu>
        <!-- end -->
      </div>
    </div>
    <div class="column">
      <div class="box">
        <!-- Main -->

        <!-- <el-carousel :interval="5000" arrow="always">
    <el-carousel-item v-for="item in 4" :key="item">
      <h3>{{ item }}</h3>
    <img class="img"  :style="like" src="../assets/like.png">
    <img class="img"  src="../assets/nope.png">
     
    </el-carousel-item>
        </el-carousel>-->
        <div v-if="OneUser">
          <center>
            <div class="photo-box">
              <carousel :perPage="1" :paginationEnabled="true" :paginationPadding="5">
                <slide v-for="(img, j) in OneUser.Images" :key="j">
                  <div class="NOPE" v-if="displayNope">NOPE</div>
                  <div class="LIKE" v-if="displayLike">LIKE</div>
                  <!-- <img id="heart" src="../assets/likey.png"> -->
                  <div class="MATCH" v-if="displayMatch">MATCH<img id="heart" src="../assets/likey.png"></div>
                  <img :src="img.url" alt="Avatar" class="image">
                </slide>
              </carousel>
              <!-- <div class="user-info">
                <span class="location">
                  <i class="el-icon-location"></i>
                  {{OneUser.user.distance}} km away
                </span>
                <span>
                  <br>

                  <a :href="'/profile/' + OneUser.user.user_name">
                    <i class="el-icon-user-solid"></i>
                    {{OneUser.user.user_fullname}}
                  </a>
                  , {{OneUser.user.user_age}}
                </span>
              </div>-->
              <aside class="photo-box-caption">
                <span class="location">
                  <i class="el-icon-location"></i>
                  {{OneUser.user.distance}} km away
                </span>
                <span>
                  <br>

                  <a :href="'/profile/' + OneUser.user.user_name">
                    <i class="el-icon-user-solid"></i>
                    {{OneUser.user.user_fullname}}
                  </a>
                  , {{OneUser.user.user_age}}
                </span>
                <br>
                <span class="bio">“{{OneUser.user.user_bio}}”</span>
              </aside>
            </div>
          </center>
          <br>
          <center>
            <div>
              <el-button
                class="LikeNotLike"
                type="success"
                icon="custom-icon el-icon-check"
                @click="likeclicked(OneUser.user.user_name)"
                circle
              ></el-button>
              <el-button
                class="LikeNotLike"
                type="danger"
                icon="custom-icon el-icon-close"
                @click="dislikeclicked()"
                circle
              ></el-button>
            </div>
          </center>
        </div>
        <div v-else>There's no one around you.</div>
        <!-- End Main -->
      </div>
    </div>
  </div>
</template>
<script>
import { Carousel, Slide } from "vue-carousel";
import _ from "lodash";

export default {
  components: {
    Carousel,
    Slide
  },
  name: "Dashboard",
  data() {
    return {
      displayNope: false,
      displayLike: false,
      displayMatch: false,
      i: 0,
      OneUser: null,
      users: [],
      bkpUsers: [],
      like: "display : none;",
      filtreOptions: {
        Distance: 80,
        Tags: 0,
        Age: [18, 40],
        FameRating: 0
      }
    };
  },
  created() {},
  computed: {
    userdata: function() {
      return this.$store.getters.getUser;
    },user_Images: function() {
      return this.$store.getters.getImages;
    }
  },
  mounted() {
    this.Suggestions();
  },
  methods: {
    FilterBy() {
      console.log(this.filtreOptions);
      this.users = _.filter(this.bkpUsers, item => {
        let inAgeRange =
          item.user.user_age <= this.filtreOptions.Age[1] &&
          item.user.user_age >= this.filtreOptions.Age[0];
        let inArea = item.user.distance <= this.filtreOptions.Distance;
        let hasCommonTags = item.user.communtags >= this.filtreOptions.Tags;
        let isFamous =
          item.user.user_popularity >= this.filtreOptions.FameRating;
        let hasTags = true;
        if (this.tags) {
          let totag = 0;
          this.tags.forEach(function(tag) {
            if (_.find(item.tags, ["text", tag.text])) totag++;
          });
          if (totag !== this.tags.length) hasTags = false;
        }
        return inArea && inAgeRange && hasCommonTags && isFamous && hasTags;
      });
    },
    likeclicked(username) {
      console.log("MYM", username);
      this.$http
        .post("liked/" + username)
        .then(res => {
          console.log(res.data);
          if (res.data !== "block") {
            if (res.data === "its a match") {
              this.$notify({
                title: "Its A Match",
                message: "you have a new Match with " + username,
                type: "success",
                position: "bottom-left"
              });
              this.$socket.emit("notifyUser", {
                to: username,
                title: "Its A Match",
                msg: "you have a new Match with " + this.userdata.user_name
              });
              this.displayMatch = true;
              setTimeout(() => {
                this.i++;
                this.OneUser = this.users[this.i];
                this.displayMatch = false;
              }, 1000);
            } else {
              this.$socket.emit("notifyUser", {
                to: username,
                title: "liked",
                msg: this.userdata.user_name + " liked  you."
              });
              this.displayLike = true;
              setTimeout(() => {
                this.i++;
                this.OneUser = this.users[this.i];
                this.displayLike = false;
              }, 250);
            }
          } else {
            this.$notify.error({
              title: "Error",
              message: "unauthorized actions have been detected",
              position: "bottom-left"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    dislikeclicked() {
      // this.like = "display : block;";
      // console.log(this.userdata.user_name, " liked ", this.OneUser.user.user_name);
      //   this.$http
      //     .post("liked/" + this.OneUser.user.user_name)
      //     .then(res => {
      //       if (res.data.message === "Failed to authenticate token.")
      //         this.$router.push({ path: "/login" });
      //         console.log(res.data);
      //         if (res.data === 'its a match'){
      //           this.$notify({
      //             title: "Its A Match",
      //             message: 'you have a new Match with '+this.OneUser.user.user_name,
      //             type: "success",
      //             position: "bottom-left"
      //           });
      //         }
      //       this.$socket.emit("notifyUser", {
      //         to: this.OneUser.user.user_name,
      //         title: "liked",
      //         msg: this.userdata.user_name + " liked  you."
      //       });
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     })
      /*this.displayLike = false;*/
      this.displayNope = true;
      setTimeout(() => {
        this.i++;
        this.OneUser = this.users[this.i];
        this.displayNope = false;
      }, 150);
    },
    // checkProfile()
    // {
    //    var images = this.user_Images;
    //     var profil;
    //     images.forEach(element => {
    //       if (element.image_type === "PROFIL") {
    //         profil = element;
    //       }
    //     });
    //     if ((!this.userdata.user_gender || !this.userdata.user_bio ||!this.userdata.user_prefer || !profil))
    //       return false;
    //     return true;
    // },
    Suggestions()
    {
      this.$http
      .get("suggestedUsers/")
      .then(res => {
        if (res.data.data) this.users = res.data.data;
        this.loading = false;
        this.bkpUsers = this.users;
        this.FilterBy();
        /*Show only interesting Profils */
        this.users = _.filter(this.users, item => {
          let isGood =
            item.user.user_prefer === this.userdata.user_gender ||
            item.user.user_prefer === "X";
          return isGood;
        });
        this.users = _.orderBy(
          this.users,
          [
            function(item) {
              return item.user.distance;
            }
          ],
          ["asc"]
        );
        this.OneUser = this.users[this.i];
      })
      .catch(err => {
        console.error(err);
      });
    }
  }
};
</script>
<style scoped>
.link {
  color: rgb(0, 0, 0);
}
.link:hover {
  color: #00f;
}
.el-menu {
  border-right: none;
}
.image {
  width: 100%;
  height: 600px;
  display: block;
}
.item {
  position: fixed;
  top: 5%;
  left: 5%;
  z-index: 3;
}
.location {
  color: #4c9428;
  text-shadow: 7px 6px 27px green;
  font-weight: normal;
  font-size: 95%;
}
.user-info {
  z-index: 5;
  position: relative;
}
.LikeNotLike {
  font-size: 2rem;
}
.LikeNotLike:hover {
  font-size: 4rem;
}
/* .img {
  z-index: 3;
  position: relative;
  width: 30%;
  height: 30%;
  bottom: 500px;
} */
.l-box {
  padding: 2em;
}
.bio {
  font-family: "Candara body copy";
  font-size: 14px;
  font-style: italic;
  color: #ffffffa5;
}
.photo-box {
  max-width: 570px;
  overflow: hidden;
  position: relative;
  /* height: 250px; */
  height: 600px;
  /*width: 100%;*/
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
  min-height: 600px;
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
    rgba(12, 2, 2, 1) 75%
  ); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(
    top,
    rgba(16, 27, 30, 0) 0%,
    rgba(12, 2, 2, 1) 75%
  ); /* Opera 11.10+ */
  background: -ms-linear-gradient(
    top,
    rgba(16, 27, 30, 0) 0%,
    rgba(12, 2, 2, 1) 75%
  ); /* IE10+ */
  background: linear-gradient(
    to bottom,
    rgba(16, 27, 30, 0) 0%,
    rgba(12, 2, 2, 1) 75%
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
  font-size: 100%;
}
.NOPE {
  position: absolute;
  z-index: 5;
  font-family: "Candara Header";
  font-size: 7rem;
  color: red;
  text-shadow: 2px 2px #880000;
  /*transform: rotate(-20deg);*/
  background: rgba(192, 23, 23, 0.178);
  /*border-radius: 42%;*/
  width: -webkit-fill-available;
  height: -webkit-fill-available;
}
.MATCH {
  position: absolute;
  z-index: 5;
  font-family: "Candara Header";
  font-size: 7rem;
  color: hotpink;
  text-shadow: 2px 2px rgb(53, 0, 44);
  background: rgba(87, 6, 73, 0.459);
  /*background-image: url("../assets/likey.png");*/
  background-position: center;
  background-repeat: no-repeat;
  background-size: 65%;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
}

.LIKE {
  position: absolute;
  z-index: 5;
  font-family: "Candara Header";
  font-size: 7rem;
  color: green;
  text-shadow: 2px 2px rgb(0, 53, 0);
  /*transform: rotate(20deg);*/
  background: rgba(8, 148, 39, 0.178);
  /*border-radius: 42%;*/
  width: -webkit-fill-available;
  height: -webkit-fill-available;
}
/* .box{
      max-width: 600px;
    } */
.VueCarousel-pagination {
  position: absolute;
}

#heart{
  position:absolute;
  width: 75%;
  padding-bottom: 20%;
  padding-top:16%;
  left:0;
  right:0;
  margin:0 auto;
  -webkit-transition: opacity 7s ease-in-out;
  -moz-transition: opacity 7s ease-in-out;
  -o-transition: opacity 7s ease-in-out;
  transition: opacity 7s ease-in-out;}

 @keyframes heartFadeInOut {
  0% {
    opacity:1;
  }
  14% {
    opacity:1;
  }
  28% {
    opacity:0;
  }
  42% {
    opacity:0;
  }
  70% {
    opacity:0;
  }
}

#heart { 
  animation-name: heartFadeInOut; 
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 0.6s;
  animation-direction: alternate;

}
</style>