<template>
  <div
    v-loading="loading"
    element-loading-text="Verifying link..."
    element-loading-spinner="el-icon-loading"
    v-if="valid"
    class="columns is-centered"
  >
    <div class="is-half">
      <form class="box" @submit.prevent="changepasswd">
        <b-field label="New Password" :type="Erorrs.password.err" :message="Erorrs.password.msg">
          <b-input type="password" v-model="password" maxlength="30"></b-input>
        </b-field>
        <b-message v-if="done" type="is-success">
          Password Updated!
          <br>Please
          <a href="/login">Login</a>
        </b-message>
        <b-message v-if="err" type="is-danger">
          your link is not valid anymore
        </b-message>
        <div class="level-right">
          <button type="submit" class="button is-success">Update</button>
        </div>
      </form>
    </div>
  </div>
  <div class="columns is-centered" v-else>
    <div class="box has-text-centered">
      <div>
        <p class="has-text-weight-bold is-size-4">{{ msg }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      done: false,
      err: false,
      msg: "ERROR",
      valid: true,
      password: "",
      token: this.$route.query.t,
      email: this.$route.query.e,
      Erorrs: {
        password: {
          err: "",
          msg: ""
        }
      }
    };
  },
  mounted() {
    if (localStorage.token) this.$router.push({ path: "/dashboard" });
    var token = this.token;
    var email = this.email;
    this.$http
      .post("/verifyRestPasswd", { token: token, email: email })
      .then(res => {
        //console.log(res.data);
        if (res.data !== "valid") {
          if (res.data === "invalid email" || res.data === "invalid token") {
            this.msg = "You have error in your URL";
            this.valid = false;
          } else if (res.data === "unvalid") {
            this.msg = "Invalid URL";
            this.valid = false;
          } else {
            this.msg = "YOU HAVE AN ERROR PLEASE TRY AGAIN! OR RELOAD PAGE!";
            this.valid = false;
          }
        }
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
      });
    //console.log(token, email);
  },
  methods: {
    changepasswd() {
      if (this.validate_password()) {
        this.$http
          .post("/changepassword", {
            token: this.token,
            email: this.email,
            password: this.password
          })
          .then(res => {
            //console.log(res.data);
            if (res.data === "done") {
              this.done = true;
            } else if (res.data === "error") {
                this.err = true;
                this.done = false;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    validate_password() {
      if (
        !String(this.password).match(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/g
        )
      ) {
        this.Erorrs.password.err = "is-danger";
        this.Erorrs.password.msg = "invalid Password!";
        return false;
      } else {
        this.Erorrs.password.err = "is-success";
        this.Erorrs.password.msg = "";
      }
      return true;
    }
  }
};
</script>

<style>
</style>
