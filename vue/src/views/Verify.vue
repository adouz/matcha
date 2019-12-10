<template>
  <div class="columns is-centered">
    <div class="box has-text-centered">
      <div :class="type">
        <p class="has-text-weight-bold is-size-4">{{ msg }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Verify",
  data() {
    return {
      msg: "there is an error in your link!",
      type: "has-text-danger"
    };
  },
  mounted() {
    if (localStorage.token) this.$router.push({ path: "/dashboard" });
    var email = this.$route.query.u;
    var token = this.$route.query.t;
    if (email && token) {
      this.$http
        .post("confirm", { email: email, token: token })
        .then(res => {
          if (res.data.success) {
            this.msg = "your email is verified successfully. Thank you";
            this.type = "has-text-success";
            // email is verfied
          } else {
            this.msg = "there is an error in your link!";
            this.type = "has-text-danger";
            // error
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>