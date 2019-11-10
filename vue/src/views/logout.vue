<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    var userdata = this.$store.getters.getUser;
    if(userdata){
        console.log(userdata);
    this.$socket.emit('logout', userdata.user_name);
    this.$store
      .dispatch("logout")
      .then(() => {
        this.$router.push("/login");
      })
      .catch(err => console.log(err));
    }else{
        this.$router.push("/login");        
    }
  }
};
</script>

<style>
</style>
