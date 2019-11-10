<template>
  <!-- TODO: not redricting from profile to other profile -->
  <div v-loading="loading">
    <div class="columns">
      <div class="column">
        <div class="box">
          <figure class="image is-square">
            <img :src="srcProfile.url" @click="Profile = true">
          </figure>
        </div>
        <!--<div class="columns is-gapless is-mobile">
            <div class="column"><figure class="image is-square">
            <img v-if="src0" :src="src0" @click="Image0 = true">
            </figure></div>
            <div class="column"><figure class="image is-square">
            <img v-if="src1" :src="src1" @click="Image1 = true">
            </figure></div>
                <div class="column"><figure class="image is-square">
            <img v-if="src2" :src="src2" @click="Image2 = true">
            </figure></div>
                <div class="column"><figure class="image is-square">
            <img v-if="src3" :src="src3" @click="Image3 = true">
            </figure></div>
        </div>-->

        <!--<b-modal :active.sync="Profile">
            <p class="image">
                <img :src="srcProfile">
            </p>
        </b-modal>
        <b-modal :active.sync="Image0">
            <p class="image">
                <img :src="src0">
            </p>
        </b-modal>
        <b-modal :active.sync="Image1">
            <p class="image">
                <img :src="src1">
            </p>
        </b-modal>
        <b-modal :active.sync="Image2">
            <p class="image">
                <img :src="src2">
            </p>
        </b-modal>
        <b-modal :active.sync="Image3">
            <p class="image">
                <img :src="src3">
            </p>
        </b-modal>-->
      </div>
      <div class="column is-half">
        <div class="box">
          <div class="columns">
            <div class="column">
              <span class="title is-4 is-spaced">
                {{ fullname }}
                <span class="title is-6">· {{ age }}</span>
                <!-- green dot for online users -->
                <el-tooltip class="item" effect="dark" :content="isOnline" placement="right">
                  <span :class="isOnline"></span>
                </el-tooltip>
              </span>
              <p class="subtitle is-7">{{ address }}</p>
            </div>
            <div class="column">
              <div v-if="!isUserProfile" class="buttons has-addons is-right">
                <b-button
                  size="10"
                  icon-left="heart"
                  :type="like_button"
                  @click="likebutton"
                  rounded
                ></b-button>
              </div>
              <div v-if="!isUserProfile" class="buttons has-addons is-right">
                <b-dropdown aria-role="list">
                  <button class="button" slot="trigger">
                    <i class="el-icon-more"></i>
                    <i class="el-icon-caret-bottom"></i>
                  </button>
                  <b-dropdown-item aria-role="listitem" @click="report">Report</b-dropdown-item>
                  <b-dropdown-item aria-role="listitem" @click="block">Block</b-dropdown-item>
                </b-dropdown>
              </div>
              <div v-else class="buttons has-addons is-right">
                <b-button tag="router-link" to="/settings/profile" type="is-info" rounded>
                  <i class="el-icon-edit"></i> Edit Profile
                </b-button>
              </div>
            </div>
          </div>
        </div>
        <div class="box">
          <div class="columns">
            <div class="column">
              <p class="title is-6">Sex:</p>
              <p class="subtitle is-6 is-spaced">
                <b-button size="10" rounded type="is-info" v-if="sex == 'M'" icon-left="mars">Man</b-button>
                <b-button
                  size="10"
                  rounded
                  type="is-danger"
                  v-if="sex == 'F'"
                  icon-left="venus"
                >Woman</b-button>
              </p>
            </div>
            <div class="column">
              <p class="title is-6">I am looking for:</p>
              <p class="subtitle is-6 is-spaced">
                <b-button
                  size="10"
                  rounded
                  type="is-info"
                  v-if="looking == 'M'"
                  icon-left="male"
                >Men</b-button>
                <b-button
                  size="10"
                  rounded
                  type="is-danger"
                  v-if="looking == 'F'"
                  icon-left="female"
                >Women</b-button>
                <b-button
                  size="10"
                  rounded
                  type="is-warning"
                  v-if="looking == 'X'"
                  icon-left="user-secret"
                >Other</b-button>
              </p>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <p class="title is-6">Description:</p>
              <p class="subtitle is-6 is-spaced">{{ bio }}</p>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <p class="title is-6">Tags:</p>
              <b-taglist>
                <b-tag
                  type="is-info"
                  v-for="(tag, index) in tags"
                  v-bind:key="index"
                >{{ tags[index].text }}</b-tag>
              </b-taglist>
            </div>
          </div>
          <p class="title is-6">Pictures:</p>
          <div class="columns is-mobile">
            <div class="column">
              <figure class="image is-square">
                <img v-if="src[0]" :src="src[0].url" @click="Image0 = true">
              </figure>
            </div>
            <div class="column">
              <figure class="image is-square">
                <img v-if="src[1]" :src="src[1].url" @click="Image1 = true">
              </figure>
            </div>
            <div class="column">
              <figure class="image is-square">
                <img v-if="src[2]" :src="src[2].url" @click="Image2 = true">
              </figure>
            </div>
            <div class="column">
              <figure class="image is-square">
                <img v-if="src[3]" :src="src[3].url" @click="Image3 = true">
              </figure>
            </div>

            <b-modal :active.sync="Profile">
              <p class="image">
                <img v-if="srcProfile" :src="srcProfile.url">
              </p>
            </b-modal>
            <b-modal :active.sync="Image0">
              <p class="image">
                <img v-if="src[0]" :src="src[0].url">
              </p>
            </b-modal>
            <b-modal :active.sync="Image1">
              <p class="image">
                <img v-if="src[1]" :src="src[1].url">
              </p>
            </b-modal>
            <b-modal :active.sync="Image2">
              <p class="image">
                <img v-if="src[2]" :src="src[2].url">
              </p>
            </b-modal>
            <b-modal :active.sync="Image3">
              <p class="image">
                <img v-if="src[3]" :src="src[3].url">
              </p>
            </b-modal>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <p class="title is-6">Popularity</p>
          <b-progress :type="Popularity_type" :value="Popularity_num"></b-progress>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
      user: "",
      fullname: "Test user",
      age: "0",
      address: '',
      sex: "Man",
      looking: "Women",
      bio:
        "She was close behind it when she went on just as I'd taken the highest tree in front of them, with her face brightened up again.) 'Please your Majesty,' said the Hatter, 'you wouldn't talk about.",
      tags: [],
      isOnline: "waiting",
      Image0: false,
      Image1: false,
      Image2: false,
      Image3: false,
      Profile: false,
      srcProfile: {
        image_id: 0,
        url:
          "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
        image_type: "PROFIL"
      },
      src: [
        {
          image_id: 0,
          url:
            "https://static.businessnews.com.au//sites/all/themes/bn/images/placeholder.svg",
          image_type: "OTHER"
        },
        {
          image_id: 1,
          url:
            "https://static.businessnews.com.au//sites/all/themes/bn/images/placeholder.svg",
          image_type: "OTHER"
        },
        {
          image_id: 2,
          url:
            "https://static.businessnews.com.au//sites/all/themes/bn/images/placeholder.svg",
          image_type: "OTHER"
        },
        {
          image_id: 3,
          url:
            "https://static.businessnews.com.au//sites/all/themes/bn/images/placeholder.svg",
          image_type: "OTHER"
        }
      ],
      loading: true,
      like_button: "",
      isUserProfile: true,
      Popularity_num: 0,
      Popularity_type: "is-success"
    };
  },
  beforeRouteLeave (to, from, next) {
    var token = localStorage.getItem("token");
    this.$store.dispatch("login", {user: this.userdata.user_name,token: token}).then(()=>{
      next();
    })
  },
  created(){
    var token = localStorage.getItem("token");
    this.$store.dispatch("login", {user: this.userdata.user_name,token: token}).then(
      () => {
            this.UpdateProfile();
      }
    )
    console.log('updating DATA');
  },
  computed: {
    userdata: function() {
      return this.$store.getters.getUser;
    },
    user_Images: function() {
      return this.$store.getters.getImages;
    },
    user_Tags: function() {
      return this.$store.getters.getTags;
    },
    user_likes: function () {
      return this.$store.getters.getLikes;
    }
  },
  watch: {
    $route: "UpdateProfile"
  },
  mounted() {
    this.$socket.on("isOnline" + this.$route.params.username, data => {
      if (data) this.isOnline = "online";
      else this.isOnline = "offline";
    });
  },
  methods: {
    UpdateProfile() {
      console.log("PROFILE UPDATE");
      this.UserProfile(this.$route.params.username);
    },
    UserProfile(user) {
      console.log("connected user:: ", this.userdata.user_name);
      console.log("user:: ", user);
      if (user == this.userdata.user_name) {
        //personal profile
        this.isUserProfile = true;
        console.log(this.userdata, this.user_Images, this.user_Tags);
        this.fill_Profile(this.userdata, this.user_Images, this.user_Tags);
        this.loading = false;
        // console.log(this.user_Tags);
        // console.log(this.user_Images);
      } else {
        /*To avoid auto visite history*/
        this.$http
        .post("visite", {user_visited: this.$route.params.username})
        .then(res => {console.log(res.data)})
        .catch(err => {console.log(err);});
        // other user profile
        this.$http
          .get("/userdata/" + user)
          .then(res => {
            if (res.data.message === "Failed to authenticate token.")
              this.$router.push({ path: "/login" });

            if (res.data.message === "Failed to authenticate token.")
              this.$router.push({ path: "/login" });

            this.isUserProfile = false;
            if (res.data.success) {
              var resdata = res.data.data;
              console.log(resdata);
              this.fill_Profile(resdata.user, resdata.images, resdata.tags);
            } else {
              this.fullname = res.data.error;
              console.log(res.data.error);
              this.$router.push({ name: "404" });
            }
            this.loading = false;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    fill_Profile(user, images, tags) {
      if (!this.isUserProfile){
        this.user_likes.forEach(liked => {
          if (liked.liked_user == user.user_name){
            this.like_button = 'is-danger';
          }
        });  
      }
      this.user = user.user_name;
      this.fullname = user.user_fullname;
      this.age = user.user_age;
      this.sex = user.user_gender;
      this.looking = user.user_prefer;
      this.bio = user.user_bio;
      this.address = user.user_addresse;
      this.Popularity_num = user.user_popularity;
      //Popularity Colors base on Popularity_num
      if (this.Popularity_num >= 1 && this.Popularity_num <= 20) {
        this.Popularity_type = "is-danger";
      } else if (this.Popularity_num >= 21 && this.Popularity_num <= 40) {
        this.Popularity_type = "is-warning";
      } else if (this.Popularity_num >= 41 && this.Popularity_num <= 60) {
        this.Popularity_type = "is-primary";
      } else if (this.Popularity_num >= 61 && this.Popularity_num <= 80) {
        this.Popularity_type = "is-info";
      } else if (this.Popularity_num >= 81 && this.Popularity_num <= 100) {
        this.Popularity_type = "is-success";
      }
      //this.tags = this.userTags;
      this.tags = tags;
      if (images[0]) {
        this.srcProfile = [];
        this.src = [];
      }
      //users images
      images.forEach(img => {
        console.log(img.url);
        if (img.image_type != "PROFIL") {
          this.src.push(img);
        } else {
          this.srcProfile = img;
        }
      });
      //Online or Offline
      this.$socket.emit("Online", user.user_name);
    },
    likebutton() {
      if (this.like_button) { // unliked
        console.log(this.userdata.user_name, " unliked ", this.user);
        this.$http
          .post("unliked/" + this.user)
          .then(res => {
            if (res.data.message === "Failed to authenticate token.")
              this.$router.push({ path: "/login" });
            console.log(res.data);
            this.$socket.emit("notifyUser", {
              to: this.user,
              title: "unliked",
              msg: this.userdata.user_name + " unliked  you."
            });
          })
          .catch(err => {
            console.log(err);
          });
        this.like_button = "";
      } else { // liked
        console.log(this.userdata.user_name, " liked ", this.user);
        this.$http
          .post("liked/" + this.user)
          .then(res => {
            if (res.data.message === "Failed to authenticate token.")
              this.$router.push({ path: "/login" });
              console.log(res.data);
              if (res.data === 'its a match'){
                this.$notify({
                  title: "Its A Match",
                  message: 'you have a new Match with '+this.user,
                  type: "success",
                  position: "bottom-left"
                });
              }
            this.$socket.emit("notifyUser", {
              to: this.user,
              title: "liked",
              msg: this.userdata.user_name + " liked  you."
            });
          })
          .catch(err => {
            console.log(err);
          });
        this.like_button = "is-danger";
      }
    },
    report() {
      console.log(this.userdata.user_name, " reported user ", this.user);
      this.$http
        .post("report/" + this.user)
        .then(res => {
          if (res.data.message === "Failed to authenticate token.")
            this.$router.push({ path: "/login" });

          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        });
      var msg = this.user + " has been reported";
      this.$notify({
        title: "Reported",
        message: msg,
        type: "success",
        position: "bottom-left"
      });
    },
    block() {
      console.log(this.userdata.user_name, " blocked user ", this.user);
      this.$http
        .post("block/" + this.user)
        .then(res => {
          if (res.data.message === "Failed to authenticate token.")
            this.$router.push({ path: "/login" });

          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        });
      this.$notify({
        title: "Blocked",
        message: this.user + " has been blocked",
        type: "success",
        position: "bottom-left"
      });
    }
  }
};
</script>

<style>
.offline {
  height: 15px;
  width: 15px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  margin-left: 6px;
  margin-bottom: -2px;
}

.online {
  height: 15px;
  width: 15px;
  background-color: #32cd32;
  border-radius: 50%;
  display: inline-block;
  margin-left: 6px;
  margin-bottom: -2px;
}
.waiting {
  height: 15px;
  width: 15px;
  background-color: #ffd700;
  border-radius: 50%;
  display: inline-block;
  margin-left: 6px;
  margin-bottom: -2px;
}
</style>
