<template>
  <div class="home">
  <section class="hero is-large">
  <div class="hero-body">
    <div class="container has-text-centered">
      <h1 class="title">
        Welcome to Matcha!
      </h1>
      <h2 class="subtitle">
        Matcha is a place where you can find your love or friends.
      </h2>
      <b-button type="is-dark" tag="router-link" :to="{ path: '/signup' }">JOIN MATCHA</b-button>
      <br>
      <span>or</span>
      <br>
      <b-button type="is-dark" tag="router-link" :to="{ path: '/login' }">Login</b-button>
    </div>
  </div>
  </section>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'home',
  components: {
    
  },mounted(){
      if (localStorage.token)
        this.$router.push({ path: '/dashboard'});
    }
}
</script>

<style>
#content{
  background-image: linear-gradient(#fafafa, #c9ffe0, #fafafa);
}
</style>


