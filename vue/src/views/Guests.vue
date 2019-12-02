<template>
  <div class="columns">
    <div class="column is-one-quarter">
      <div class="box">
        <!-- Menu  -->
               <el-menu default-active="3">
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
            <router-link class="link" to="mutuallikes">
            <el-menu-item index="2">
              <b-icon icon="user-friends">
            </b-icon>
              Mutual likes
            </el-menu-item>
        </router-link>
            <el-menu-item index="3">
             <b-icon icon="eye">
            </b-icon>
            Guests
            </el-menu-item>
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

        <!-- <el-row v-for="(j, x) in columns" :key="x">
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
                  <h1 class="fullname">{{u.date}}</h1>
                  <h1 class="fullname">{{u.time}}</h1>
                  <a :href="'/profile/' + u.username">
                    <i class="icont el-icon-user-solid"></i>
                  </a>
                </div>
              </div>
            </div>
          </el-col>
        </el-row> -->

       <el-row :span="2"  v-for="(u, i) in users" :key="i" class="box">
          <el-col :span="5">
            <el-badge :value="u.age+' Years Old'" >
            <a :href="'/profile/' + u.username">
          <avatar v-if="u.url" :image="u.url" :fullname="u.fullname" :size="50" ></avatar>
          <avatar v-else :fullname="u.fullname" :size="50"></avatar> </a>
          </el-badge>
          </el-col>
          <el-col :span="10">
          <a :href="'/profile/' + u.username"><div class="fullname">{{u.fullname}}</div></a>
          </el-col>
          <el-col :span="9">
          <div class="date"><i class="el-icon-time"></i><span>{{u.date}} {{u.time}}</span></div>
          </el-col>
       </el-row>
          <div v-if="users.length === 0">No one visited your profil.</div>


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
    // columns() {
    //   let columns = [];
    //   // let mid = Math.ceil(this.users.length / this.cols);
    //   // for (let col = 0; col < this.cols; col++) {
    //   //   columns.push(this.users.slice(col * mid, col * mid + mid));
    //   // }
    //   // console.log(columns);
    //   // return columns;
    //   var j = this.users.length;
    //   var subset;
    //   for (var i = 0; i < j; i += this.cols) {
    //     subset = this.users.slice(i, i + this.cols);
    //     columns.push(subset);
    //   }
    //   console.log(columns);
    //   return columns;
    //   // output DIV with 12 items
    // },
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
        console.log(this.users);
        console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
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
.date{
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
  .date{
    font-size: 14px;
  }
}

/* .age {
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
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
/*} */

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
/* .item {
  position: relative;
  margin-left: 75%;
  margin-top: 5px;
}
.bio {
  font-family: "Candara body copy";
  font-size: 14px;
  font-style: italic;
  color: white;
} */
</style>
