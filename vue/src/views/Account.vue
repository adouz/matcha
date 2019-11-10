<template>
  <div>
    <div class="columns">
      <div class="column is-one-fifth">
        <div class="box">
          <!-- Menu  -->
          <center>
            <h5>Settings</h5>
          </center>
          <el-menu default-active="1">
              <router-link class="link" to="profile">
            <el-menu-item index="0">
              <i class="el-icon-user-solid"></i>
                Profil
            </el-menu-item>
                </router-link>
            <el-menu-item index="1">
              <i class="el-icon-s-tools"></i>
              <span>Account</span>
            </el-menu-item>
              <router-link class="link" to="visite">
            <el-menu-item index="2">
              <i class="el-icon-view"></i>
                Visite
            </el-menu-item>
                </router-link>
              <router-link class="link" to="blocked">
            <el-menu-item index="3">
              <i class="el-icon-error"></i>
                Blocked
            </el-menu-item>
                </router-link>
          </el-menu>
          <!-- end -->
        </div>
      </div>
      <div class="column">
        <div class="box">
          <!-- Main -->
          <form @submit.prevent="UpdateAccount">
            <section>
              <b-field
                label="User Name"
                :label-position="labelPosition"
                :type="Errors.username.err"
                :message="Errors.username.msg"
              >
                <b-input v-model="this.user.user_name"></b-input>
              </b-field>
              <br>
              <b-field
                label="Email"
                :label-position="labelPosition"
                :type="Errors.email.err"
                :message="Errors.email.msg"
              >
                <b-input type="email" v-model="user.user_mail" maxlength="30"></b-input>
              </b-field>
              <b-field grouped>
                <b-field
                  label="Password"
                  expanded
                  :label-position="labelPosition"
                  :type="Errors.password.err"
                  :message="Errors.password.msg"
                >
                  <b-input type="password" v-model="password" expanded maxlength="30"></b-input>
                </b-field>
                <b-field
                  label="Confirm Password"
                  expanded
                  :label-position="labelPosition"
                  :type="Errors.confirmpassword.err"
                  :message="Errors.confirmpassword.msg"
                >
                  <b-input type="password" v-model="confirmpassword" expanded maxlength="30"></b-input>
                </b-field>
              </b-field>
            </section>
            <b-message v-if="err" type="is-danger">
              YOU HAVE AN ERROR PLEASE TRY AGAIN!
              <br>OR RELOAD PAGE!
            </b-message>
            <div class="level-right">
              <button type="submit" class="button is-success">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

axios.defaults.baseURL = "http://10.11.2.12:3000/";

export default {
  name: "Account",
  data() {
    return {
      user: [],
      labelPosition: "on-border",
      password: "",
      confirmpassword: "",
      err: false,
      confirm: false,
      Errors: {
        username: {
          err: null,
          msg: null
        },
        email: {
          err: null,
          msg: null
        },
        password: {
          err: null,
          msg: null
        },
        confirmpassword: {
          err: null,
          msg: null
        }
      }
    };
  },
  beforeRouteLeave (to, from, next) {
    var token = localStorage.getItem("token");
    this.$store.dispatch("login", {user: this.userdata.user_name,token: token})
    next();
  },
  created(){
    var token = localStorage.getItem("token");
    this.$store.dispatch("login", {user: this.userdata.user_name,token: token})
    console.log('updating DATA');
  },
  computed: {
    userdata: function () {
      return this.$store.getters.getUser;
    }
  },
  mounted() {
    if (!localStorage.token) this.$router.push({ path: "/login" });
      this.user = this.$store.getters.getUser;
    console.log(this.user);
  },
  methods: {
    UpdateAccount() {
      if (this.validate(this.password !== "")) {
        var user = {};
        if (this.password)
          user = {
            user_name: this.user.user_name.toLowerCase(),
            user_mail: this.user.user_mail,
            user_password: this.password
          };
        else
          user = {
            user_name: this.user.user_name,
            user_mail: this.user.user_mail
          };

        this.$http
          .put("users/" + this.user.user_id, user)
          .then(res => {
            if (!res.data.success) {
              this.err = true;
            } else {
              this.confirm = true;
            }
            this.$store.dispatch("update", this.user);
          })
          .catch(err => console.error(err));
      }
    },
    validate(password) {
      if (!this.user.user_name.match(/^[a-z0-9_]{2,30}$/g)) {
        //a-z 0-9 _ 2~30
        this.Errors.username.err = "is-danger";
        this.Errors.username.msg = "this username is unvalide";
        return false;
      } else {
        this.Errors.username.err = "is-success";
        this.Errors.username.msg = "";
      }

      if (
        !this.user.user_mail.match(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/gi
        )
      ) {
        this.Errors.email.err = "is-danger";
        this.Errors.email.msg = "please Entre a valide Email";
        return false;
      } else {
        this.Errors.email.err = "is-success";
        this.Errors.email.msg = "";
      }
      if (password === true) {
        if (
          !this.password.match(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/g
          )
        ) {
          this.Errors.password.err = "is-danger";
          this.Errors.password.msg = "your password is not strong";
          return false;
        } else {
          this.Errors.password.err = "is-success";
          this.Errors.password.msg = "";
        }

        if (
          !this.confirmpassword.match(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/g
          ) ||
          !this.confirmpassword.match(this.password)
        ) {
          this.Errors.confirmpassword.err = "is-danger";
          this.Errors.confirmpassword.msg = "your passwords dosn't match";
          return false;
        } else {
          this.Errors.confirmpassword.err = "is-success";
          this.Errors.confirmpassword.msg = "";
        }
      }
      else
        {
          this.Errors.password.err = "";
          this.Errors.password.msg = "";
          this.Errors.confirmpassword.err = "";
          this.Errors.confirmpassword.msg = "";
        }
      return true;
    }
  }
};
</script>
<style>
.link {
  color: rgb(0, 0, 0);
}
.link:hover {
  color: #00f;
}
.el-menu {
  border-right: none;
}
</style>