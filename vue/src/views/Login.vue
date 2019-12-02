<template>
  <div v-if="!Forget_Password" class="columns is-centered">
    <div class="is-half">
      <form class="box" @submit.prevent="Login">
        <div v-if="confirm" class="notification is-danger">
          <button class="delete" @click="deletemsg"></button>
          Please Confirm your Email first
          <br>before login to your Account!
        </div>
        <b-field label="Login" :type="Erorrs.login.err" :message="Erorrs.login.msg">
          <b-input v-model="login" maxlength="30"></b-input>
        </b-field>
        <b-field label="Password" :type="Erorrs.password.err" :message="Erorrs.password.msg">
          <b-input type="password" v-model="password" maxlength="30" password-reveal></b-input>
        </b-field>
        <div class="level">
          <a class="level-left is-size-7" @click="ForgetPassword(true)">Forget Password?</a>
          <button type="submit" class="button is-info level-right">Submit</button>
        </div>
      </form>
    </div>
  </div>
  <div v-else-if="Forget_Password" class="columns is-centered">
    <form class="is-half box" @submit.prevent="reset">
      <b-field label="Email" :type="Erorrs.reset_email.err" :message="Erorrs.reset_email.msg">
        <b-input type="email" v-model="reset_email" maxlength="30"></b-input>
      </b-field>
      <div class="level">
        <a class="level-left is-size-7" @click="ForgetPassword(false)">Sing in?</a>
        <button type="submit" class="button is-info level-right">Send</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      login: "",
      password: "",
      confirm: false,
      Forget_Password: false,
      reset_email: "",
      loc: {
        lat: "",
        lng: "",
        addresse: ""
      },
      Erorrs: {
        login: {
          err: null,
          msg: null
        },
        password: {
          err: null,
          msg: null
        },
        reset_email: {
          err: null,
          msg: null
        }
      }
    };
  },
  mounted() {
    if (localStorage.token) this.$router.push({ path: "/dashboard" });
    this.$http
      .get("https://ipinfo.io/json?token=63f39e0edc15d5")
      .then(res => {
        let loc = res.data.loc.split(",");
        this.loc.lat = loc[0];
        this.loc.lng = loc[1];
        this.loc.addresse = res.data.city + ", " + res.data.country;
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    Login() {
      if (this.validate()) {
        this.getloacttion();
        this.$http
          .post("login", {
            user_name: this.login.toLowerCase(),
            user_password: this.password,
            latitude: this.loc.lat,
            longitude: this.loc.lng,
            user_addresse: this.loc.addresse
          })
          .then(res => {
            if (!res.data.success) {
              // error
              console.log(res.data);
              if (res.data.error === "user") {
                this.Erorrs.login.msg = "Wrong username";
                this.Erorrs.login.err = "is-danger";
              } else if (res.data.error === "password") {
                this.Erorrs.password.msg = "Wrong password";
                this.Erorrs.password.err = "is-danger";
              } else if (res.data.error === "email") {
                this.confirm = true;
              }
            } else {
              // success
              localStorage.setItem("token", res.data.token);
              this.Erorrs.password.msg = "";
              this.Erorrs.password.err = "is-success";
              this.Erorrs.login.msg = "";
              this.Erorrs.login.err = "is-success";
              this.$store
                .dispatch("login", {
                  user: this.login
                })
                .then(data => {
                  let imgProfil =0;
                   data.data.images.forEach(obj => {
                    if (obj.image_type === "PROFIL")
                      imgProfil = 1;
                    });
                  console.log("HERRE",imgProfil);
                  if (
                    !data.data.user.user_gender ||
                    !data.data.user.user_bio ||
                    !data.data.user.user_prefer ||
                    !imgProfil
                  ) {
                    window.location = "/settings/profile";
                  } else window.location = "/dashboard";
                })
                .catch(err => {
                  console.error(err);
                });
            }
          })
          .catch(err => console.error(err));
      }
    },
    validate() {
      if (!this.login.match(/^[a-z]+([_-]?[a-z0-9])*$/g)|| this.login.length > 30 || this.login.length < 3) {
        this.Erorrs.login.err = "is-danger";
        this.Erorrs.login.msg = "please Entre a valid Username";
        return false;
      } else {
        this.Erorrs.login.err = "is-success";
        this.Erorrs.login.msg = "";
      }
      if (
        !this.password.match(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/g
        )
      ) {
        this.Erorrs.password.err = "is-danger";
        this.Erorrs.password.msg = "Wrong Password!";
        return false;
      } else {
        this.Erorrs.password.err = "is-success";
        this.Erorrs.password.msg = "";
      }
      return true;
    },
    deletemsg() {
      this.confirm = false;
    },
    getloacttion() {
      navigator.geolocation.getCurrentPosition(function(position) {
        return position.coords.latitude, position.coords.longitude;
      });
    },
    ForgetPassword(value) {
      this.Forget_Password = value;
    },
    reset() {
      if (this.validate_reset(this.reset_email)) {
        this.$http
          .post("/resetPasswd", { email: this.reset_email })
          .then(res => {
            if (res.data === "not found") {
              this.Erorrs.reset_email.err = "is-danger";
              this.Erorrs.reset_email.msg = "We dont have this email!";
            } else if (res.data === "sent") {
              this.Erorrs.reset_email.msg =
                "please click link in your email to reset your password";
            } else {
              this.Erorrs.reset_email.err = "is-danger";
              this.Erorrs.reset_email.msg =
                "There was an error. Please try again later.";
            }
            console.log(res);
          })
          .catch(err => console.error(err));
      }
    },
    validate_reset(email) {
      if (
        !email.match(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/gi
        )
      ) {
        this.Erorrs.reset_email.err = "is-danger";
        this.Erorrs.reset_email.msg = "please Entre a valide Email";
        return false;
      } else {
        this.Erorrs.reset_email.err = "is-success";
        this.Erorrs.reset_email.msg = "";
      }
      return true;
    }
  }
};
</script>
