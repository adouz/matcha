import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import Signup from "./views/Signup";
import Login from './views/Login';
import Settings from "./views/Settings";
import Verify from './views/Verify';
import Dashboard from "./views/Dashboard";
import Account from "./views/Account";
import Profil from "./views/Profil";
import Profile from "./views/Profile";
import Messages from './views/Messages';
import Visite from './views/Visite';
import Blocked from './views/Blocked';
import Logout from "./views/logout";
import Mutuallikes from './views/Mutuallikes';
import Guests from './views/Guests';
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/settings',
      component: Settings,
      name: 'settings'
      , children: [
        {
          path: 'account',
          name: 'account',
          component: Account

        }, {
          path: 'profile',
          name: 'profil',
          component: Profil

        },
        {
          path: 'visite',
          name: 'visite',
          component: Visite
        },
        {
          path: 'blocked',
          name: 'blocked',
          component: Blocked
        }
      ]
    }
    , {
      path: '/verify',
      name: 'verify',
      component: Verify

    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/profile/:username',
      name: 'profile',
      component: Profile
    },
    {
      path: '/messages',
      name: 'messages',
      component: Messages
    },
    {
      path: '/guests',
      name: 'guests',
      component: Guests
    },
    {
      path: '/mutuallikes',
      name: 'mutuallikes',
      component: Mutuallikes
    },
    {
      path: "*",
      name: "404",
      component: require("./views/404.vue").default
    }
  ]
})
