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
                <b-icon icon="user-alt"></b-icon>Profil
              </el-menu-item>
            </router-link>
            <el-menu-item index="1">
              <b-icon icon="user-shield"></b-icon>Account
            </el-menu-item>
            <router-link class="link" to="blocked">
              <el-menu-item index="2">
                <b-icon icon="eye-slash"></b-icon>Blocked
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
                <b-input v-model="user_name" maxlength="30"></b-input>
              </b-field>
              <br>
              <b-field
                label="Email"
                :label-position="labelPosition"
                :type="Errors.email.err"
                :message="Errors.email.msg"
              >
                <b-input type="email" v-model="user_mail" maxlength="50"></b-input>
              </b-field>
              <b-field grouped>
                <b-field
                  label="New Password"
                  expanded
                  :label-position="labelPosition"
                  :type="Errors.passwordfield.err"
                  :message="Errors.passwordfield.msg"
                >
                  <b-input
                    type="password"
                    v-model="passwordfield"
                    expanded
                    maxlength="30"
                    autocomplete="new-password"
                    password-reveal
                  ></b-input>
                </b-field>
                <b-field
                  label="Confirm Password"
                  expanded
                  :label-position="labelPosition"
                  :type="Errors.confirmpasswordfield.err"
                  :message="Errors.confirmpasswordfield.msg"
                >
                  <b-input
                    type="password"
                    v-model="confirmpasswordfield"
                    expanded
                    maxlength="30"
                    autocomplete="new-password"
                    password-reveal
                  ></b-input>
                </b-field>
              </b-field>
            </section>
            <b-field
              label="Password"
              expanded
              :label-position="labelPosition"
              :type="Errors.oldPassword.err"
              :message="Errors.oldPassword.msg"
            >
              <b-input
                type="password"
                v-model="oldPassword"
                expanded
                maxlength="30"
                autocomplete="new-password"
                password-reveal
              ></b-input>
            </b-field>
            <b-message
              v-if="err"
              type="is-danger"
            >SOMTHING WENT WRONG MAYBE YOU ENTRED A WRONG PASSWORD!</b-message>
            <b-message v-if="confirm" type="is-success">YOUR CHANGES ARE SUCCESSFULLY DONE!</b-message>
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
export default {
  name: "Account",
  data() {
    return {
      user_name: "user",
      user_mail: "",
      labelPosition: "on-border",
      passwordfield: "",
      oldPassword: "",
      confirmpasswordfield: "",
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
        passwordfield: {
          err: null,
          msg: null
        },
        confirmpasswordfield: {
          err: null,
          msg: null
        },
        oldPassword: {
          err: null,
          msg: null
        }
      }
    };
  },
  created() {
    this.loadProfil();
  },
  computed: {
    userdata: function() {
      return this.$store.getters.getUser;
    }
  },
  methods: {
    loadProfil() {
      this.user_name = this.userdata.user_name;
      this.user_mail = this.userdata.user_mail;
    },
    UpdateAccount() {
      if (this.validate(this.passwordfield !== "")) {
        var user = {};
        if (this.passwordfield)
          user = {
            user_name: this.user_name,
            user_mail: this.user_mail,
            user_password: this.passwordfield,
            user_oldpassword: this.oldPassword
          };
        else
          user = {
            user_name: this.user_name,
            user_mail: this.user_mail,
            user_oldpassword: this.oldPassword
          };
       //console.log(user);
        this.$http
          .put("usersaccount/", user)
          .then(res => {
            if (!res.data.success) {
              this.err = true;
              this.confirm = false;
            } else {
              this.user_name = res.data.username;
              //console.log(this.userdata.username);
              if (res.data.token) {
                // change token
                localStorage.setItem("token", res.data.token);
                //console.log("dispatch::::");
                //change data
                this.$store
                  .dispatch("login", { user: this.user_name })
                  .then(() => {
                    this.confirm = true;
                    this.err = false;
                  })
                  .catch(err => {
                    console.log(err);
                  });
              } else {
                //username already taken
                //console.log(res.data.reason);
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    validate(passwordfield) {
      if (
        !String(this.user_name).match(/^[a-z]+([_-]?[a-z0-9])*$/g) ||
        this.user_name.length > 30 ||
        this.user_name.length < 3
      ) {
        //a-z 0-9 _ 2~30
        this.Errors.username.err = "is-danger";
        this.Errors.username.msg = "this username is unvalide";
        return false;
      } else {
        this.Errors.username.err = "is-success";
        this.Errors.username.msg = "";
      }

      if (
        !String(this.user_mail).match(
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

      if (
        !String(this.oldPassword).match(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/g
        )
      ) {
        this.Errors.oldPassword.err = "is-danger";
        this.Errors.oldPassword.msg = "your password is wrong";
        return false;
      } else {
        this.Errors.oldPassword.err = "is-success";
        this.Errors.oldPassword.msg = "";
      }
      if (passwordfield === true) {
        if (
          !String(this.passwordfield).match(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/g
          )
        ) {
          this.Errors.passwordfield.err = "is-danger";
          this.Errors.passwordfield.msg = "your password is not strong";
          return false;
        } else {
          this.Errors.passwordfield.err = "is-success";
          this.Errors.passwordfield.msg = "";
        }

        if (
          !String(this.confirmpasswordfield).match(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/g
          ) ||
          !String(this.confirmpasswordfield).match(this.passwordfield)
        ) {
          this.Errors.confirmpasswordfield.err = "is-danger";
          this.Errors.confirmpasswordfield.msg = "your passwords dosn't match";
          return false;
        } else {
          this.Errors.confirmpasswordfield.err = "is-success";
          this.Errors.confirmpasswordfield.msg = "";
        }
      } else {
        this.Errors.passwordfield.err = "";
        this.Errors.passwordfield.msg = "";
        this.Errors.confirmpasswordfield.err = "";
        this.Errors.confirmpasswordfield.msg = "";
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