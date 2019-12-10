<template>
  <div class="columns">
    <div class="column is-one-quarter">
      <div class="box">
        <!-- Menu  -->
        <center>
          <h5>Options</h5>
        </center>
        
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
        <div class="block">
          <span class="demonstration">Location</span>
          <gmap-autocomplete class="input is-info" @place_changed="getFromAddress"  @change="someHandler">
            <template v-slot:input="slotProps">
              <v-text-field
                outlined
                prepend-inner-icon="place"
                placeholder="Location Of Event"
                ref="input"
                v-on:listeners="slotProps.listeners"
                v-on:attrs="slotProps.attrs"
              ></v-text-field>
            </template>
          </gmap-autocomplete>
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
        <div v-if="users.length === 0">There's no one around you.</div>
        <!-- End Main -->
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import { Carousel, Slide } from "vue-carousel";
import VueTagsInput from "@johmun/vue-tags-input";
import * as geolib from 'geolib';

export default {
  components: {
    Carousel,
    Slide,
    VueTagsInput
  },
  name: "Search",
  data() {
    return {
      tag: "",
      from_address: {},
      autocomplete: "",
      tags: [],
      autocompleteItems: [],
      users: [],
      bkpUsers: [],
      cols: 4,
      address: "",
      filtreOptions: {
        Location: {lng:"",lat:""},
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
      .get("filteredUsers/")
      .then(res => {
        if (res.data.data) this.bkpUsers = res.data.data;
        this.users = this.bkpUsers;
        this.FilterBy();
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
    // ,
    // filtreOptions: function(){
    //   this.FilterBy();
    // }
  },
  methods: {
    FilterBy() {
      //console.log(this.filtreOptions);
      this.users = _.filter(this.bkpUsers, item => {
        let inAgeRange =
          item.user.user_age <= this.filtreOptions.Age[1] &&
          item.user.user_age >= this.filtreOptions.Age[0];
          let inArea = true;
          if(this.filtreOptions.Location.lng !== "" && this.filtreOptions.Location.lat !== "")
            {
              // console.log("DSDFDFD",parseInt(geolib.convertDistance(geolib.getDistance({ latitude: item.user.latitude, longitude: item.user.longitude },
              // { latitude: this.filtreOptions.Location.lat, longitude: this.filtreOptions.Location.lng }), 'km')));
              inArea = parseInt(geolib.convertDistance(geolib.getDistance({ latitude: item.user.latitude, longitude: item.user.longitude },
              { latitude: this.filtreOptions.Location.lat, longitude: this.filtreOptions.Location.lng }), 'km')) <= 5;
            }
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
    likeclicked() {
      this.like = "display : block;";
    },
    SortChoosen() {
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
    },
    someHandler(){
        this.filtreOptions.Location.lng = "";
        this.filtreOptions.Location.lat = "";
        this.FilterBy();
    },
    getFromAddress(from_address) {
      if(from_address && from_address.geometry && from_address.geometry.location)
        {
        this.filtreOptions.Location.lng = from_address.geometry.location.lng();
        this.filtreOptions.Location.lat = from_address.geometry.location.lat();
        }
      else
        {
          this.filtreOptions.Location.lng = "";
          this.filtreOptions.Location.lat = "";
        }
        this.FilterBy();
    },
    handleError(error) {
      alert(error);
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