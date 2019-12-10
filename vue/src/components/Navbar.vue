<template>
  <div>
    <b-navbar class="is-hidden-touch">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img src="./../assets/logo.png" alt="Chalada Website">
        </b-navbar-item>
      </template>
      <template slot="start"></template>
      <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons">
            <router-link to="/login" class="button is-light">
              <b-icon icon="sign-in-alt"></b-icon>&nbsp;&nbsp;Log in
            </router-link>
            <router-link to="/signup" class="button is-dark">
              <b-icon icon="user-plus"></b-icon>&nbsp;&nbsp;
              <strong>Sign up</strong>
            </router-link>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
    <nav class="navbar is-light is-hidden-desktop" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <div class="navbar-item">
          <img src="./../assets/logo.png" alt="Matcha">
        </div>
        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          @click="isOpen = !isOpen"
          v-bind:class="{'is-active': isOpen}"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu" v-bind:class="{'is-active': isOpen}">
        <div class="navbar-end">
          <div class="buttons">
            <router-link to="/login" class="button is-light">
              <b-icon icon="sign-in-alt"></b-icon>&nbsp;&nbsp;Log in
            </router-link>
            <router-link to="/signup" class="button is-dark">
              <b-icon icon="user-plus"></b-icon>&nbsp;&nbsp;
              <strong>Sign up</strong>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false
    };
  }
};
</script>

<style lang="scss">
.navbar-item {
  &.has-dropdown {
    .navbar-dropdown {
      display: none;
    }
    &.is-active {
      .navbar-dropdown {
        display: block;
      }
    }
  }
}
</style>
