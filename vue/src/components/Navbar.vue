<template>
  <b-navbar>
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img src="./../assets/logo.png" alt="Chalada Website">
      </b-navbar-item>
    </template>
    <template slot="start"></template>
    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons">
          <router-link to="/login" class="button is-light">Log in</router-link>
          <router-link to="/signup" class="button is-primary">
            <strong>Sign up</strong>
          </router-link>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {};
</script>

<style>
</style>
