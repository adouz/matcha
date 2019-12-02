<template>
  <div class="columns">
    <div class="column is-one-quarter">
      <div class="box">
        <!-- Menu  -->
        <center>
          <h5>Options</h5>
        </center>
        <div class="block">
          <span class="demonstration">Distance</span>
          <el-slider v-model="filtreOptions.Distance" label="km" :max="3000" @change="FilterBy"></el-slider>
        </div>
        <div class="block">
          <span class="demonstration">Age</span>
          <el-slider
            v-model="filtreOptions.Age"
            range
            show-stops
            :min="18"
            :max="80"
            @change="FilterBy"
          ></el-slider>
        </div>
        <div class="block">
          <span class="demonstration">Commun Tags</span>
          <el-slider v-model="filtreOptions.Tags" :max="10" @change="FilterBy"></el-slider>
        </div>
        <div class="block">
          <span class="demonstration">Fame Rating</span>
          <el-slider v-model="filtreOptions.FameRating" :max="30" @change="FilterBy"></el-slider>
        </div>

        <div>
          <span class="demonstration">Search with tags</span>
          <vue-tags-input
            v-model="tag"
            :tags="tags"
           :autocomplete-items="filteredItems"
            @tags-changed="newTags => tags = newTags"
          />
        </div>
        <br>
        <div>
          <el-select v-model="value" placeholder="Sort By" @change="SortChoosen">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <!-- end  -->
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
              There's no one around you.
        </div>
        <!-- End Main -->
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import { Carousel, Slide } from "vue-carousel";
import VueTagsInput from "@johmun/vue-tags-input";
import moment from 'moment';

export default {
  components: {
    Carousel,
    Slide,
    VueTagsInput
  },
  name: "Browse",
  data() {
    return {
      tag: "",
      tags: [],
      autocompleteItems: [],
      users: [],
      bkpUsers: [],
      cols: 4,
      filtreOptions: {
        Distance: 80,
        Tags: 0,
        Age: [18, 30],
        FameRating: 0
      },
      options: [
        {
          value: "sortByAge",
          label: "Age"
        },
        {
          value: "sortByLocation",
          label: "Location"
        },
        {
          value: "sortByCommunTags",
          label: "Commun Tags"
        },
        {
          value: "sortByFameRate",
          label: "Fame Rate"
        }
      ],
      value: "",
      like: "display : none;"
    };
  },
  created() {
    //Something wrong 
    this.$http
      .get("/tags")
      .then(res => (this.autocompleteItems = res.data))
      .catch(err => console.log(err));
  },
  mounted() {
    if (!localStorage.token) this.$router.push({ path: "/login" });
    else
      this.$http.defaults.headers.common["x-access-token"] = localStorage.token;

    this.$http
      .get("suggestedUsers/")
      .then(res => {
        if (res.data.data) this.users = res.data.data;
        this.loading = false;
        this.bkpUsers = this.users;
        this.FilterBy();
        /*Show only interesting Profils */
        // this.users = _.filter(this.users,(item) => {
        //   let isGood = (item.user.user_prefer === this.user.user_gender || item.user.user_prefer ==='X');
        //   //console.log(item.user.user_prefer,"==",this.user.user_gender,"||",item.user.user_prefer ,"==",'X',"->",isGood);
        //   return (isGood);
        //   });
        this.users = _.orderBy(this.users,[function(item) {return item.user.distance;}],["asc"]);
      })
      .catch(err => {
        console.error(err);
      });
  },
  computed: {
    user: function() {
      return this.$store.getters.getUser;
    },
    user_Images: function() {
      return this.$store.getters.getImages;
    },
    user_Tags: function() {
      return this.$store.getters.getTags;
    },
    filteredItems() {
      return this.autocompleteItems.filter(i => {
        return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
      });
    },
    newTags() {
      return this.tags
        .map(cur => ({
          id: cur.tags_id,
          text: cur.text.toLowerCase()
        }))
        .filter(cur => !cur.id);
    },
    selectedTags() {
      return this.tags.map(cur => ({
        id: cur.tags_id,
        text: cur.text.toLowerCase()
      }));
    }
  },
  watch: {
    tags: function() {
      this.FilterBy();
    }
  },
  methods: {
    FilterBy() {
      /*console.log(this.filtreOptions);*/
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
    // Showmore() {
    //   this.src =
    //     "http://24.media.tumblr.com/d6b9403c704c3e5aa1725c106e8a9430/tumblr_mvyxd9PUpZ1st5lhmo1_1280.jpg";
    // },
    likeclicked() {
      this.like = "display : block;";
    },
    SortChoosen() {
      // console.log("PRRRr");
      // console.log(this.value);
      switch (this.value) {
        case "sortByAge":
          this.users = _.orderBy(
            this.users,
            [
              function(item) {
                return item.user.user_age;
              }
            ],
            ["asc"]
          );
          break;
        case "sortByLocation":
          this.users = _.orderBy(
            this.users,
            [
              function(item) {
                return item.user.distance;
              }
            ],
            ["asc"]
          );
          break;
        case "sortByCommunTags":
          this.users = _.orderBy(
            this.users,
            [
              function(item) {
                return item.user.communtags;
              }
            ],
            ["asc"]
          );
          break;
        case "sortByFameRate":
          this.users = _.orderBy(
            this.users,
            [
              function(item) {
                return item.user.user_popularity;
              }
            ],
            ["asc"]
          );
          break;
      }
      console.log(this.users);
    },
    onlinesocket() {
      let users = this.users;
      users.forEach(user => {
        this.$socket.on("isOnline" + user.username, data => {
          if (data.online) {
            user.lastconnection = '';
            user.isOnline = "online";
          }
          else{
            user.isOnline = "offline";
            user.lastconnection = moment(data.last).format('YYYY-MM-DD HH:mm:ss');
          }  
        });
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

/* #wrap {
  width: 500px;
  height: 500px;
  margin: 20px;
}

#firstImg {
  cursor: pointer;
}

#msg,
.blue {
  color: #00f;
}

.red {
  color: #f00;
} */
</style>