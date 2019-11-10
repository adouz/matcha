<template>
 <router-view class="routerview"/>
</template>
<script>
export default {
  name: "Settings",
  mounted(){
    if(this.$router.currentRoute.path ===  "/settings")
      this.$router.push({path : "/settings/profile"})
  }
};
</script>
<style>
</style>
