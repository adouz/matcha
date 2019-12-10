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
import Blocked from './views/Blocked';
import Logout from "./views/logout";
import Mutuallikes from './views/Mutuallikes';
import Guests from './views/Guests';
import Browse from './views/Browse';
import Search from './views/Search';
import Youlike from './views/Youlike';
import Likeyou from './views/Likeyou';
import Reset from './views/Reset';
import notification from './views/notification';
import notFound from './views/404.vue';
Vue.use(Router, {})

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { title: 'Home' }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: { title: 'Singup' }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { title: 'Login' }
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/reset',
      name: 'reset',
      component: Reset,
      meta: { title: 'Reset' }
    },
    {
      path: '/notification',
      name: 'notification',
      component: notification,
      beforeEnter: redirectIfNotCompleteProfil,
      meta: { title: 'notification' }
    },
    {
      path: '/settings',
      component: Settings,
      name: 'settings'
      , children: [
        {
          path: 'account',
          name: 'account',
          component: Account,
          meta: { title: 'Account' }
        }, {
          path: 'profile',
          name: 'profil',
          component: Profil,
          meta: { title: 'Profil' }

        },
        {
          path: 'blocked',
          name: 'blocked',
          component: Blocked,
          beforeEnter: redirectIfNotCompleteProfil,
          meta: { title: 'Blocked' }
        }
      ]
    }
    , {
      path: '/verify',
      name: 'verify',
      component: Verify,
      meta: { title: 'Verify' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: redirectIfNotCompleteProfil,
      meta: { title: 'Dashboard' }
    },
    {
      path: '/profile/:username',
      name: 'profile',
      component: Profile,
      beforeEnter: redirectIfNotCompleteProfil,
      meta: { title: 'Profile' }
    },
    {
      path: '/messages',
      name: 'messages',
      component: Messages,
      beforeEnter: redirectIfNotCompleteProfil,
      meta: { title: 'Messages' }
    },
    {
      path: '/guests',
      name: 'guests',
      component: Guests,
      beforeEnter: redirectIfNotCompleteProfil,
      meta: { title: 'Guests' }
    },
    {
      path: '/mutuallikes',
      name: 'mutuallikes',
      component: Mutuallikes,
      beforeEnter: redirectIfNotCompleteProfil,
      meta: { title: 'Mutuallikes' }
    },
    {
      path: '/youlike',
      name: 'youlike',
      component: Youlike,
      beforeEnter: redirectIfNotCompleteProfil,
      meta: { title: 'Youlike' }
    },
    {
      path: '/likeyou',
      name: 'likeyou',
      component: Likeyou,
      beforeEnter: redirectIfNotCompleteProfil,
      meta: { title: 'Likeyou' }
    },
    {
      path: '/browse',
      name: 'browse',
      component: Browse,
      beforeEnter: redirectIfNotCompleteProfil,
      meta: { title: 'Browse' }
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      beforeEnter: redirectIfNotCompleteProfil,
      meta: { title: 'Search' }
    },
    {
      path: '/404',
      name: "404",
      component: notFound,
      meta: { title: '404' }
    },
    {
      path: "*",
      redirect: '404'
    }
  ]
})

// checking for token if exist before entring route
router.beforeEach((to, from, next) => {
  //page title
  document.title = to.meta.title;
  var token = localStorage.getItem("token");
  var paths = ['/login', '/', '/signup', '/logout', '/reset', '/verify']
  if (!token) {
    if (!paths.includes(to.path)) {
      // console.log('path:: ' + to.path);
      next('/login');
    } else next();
  }
  else next();
});

import store from './store';
function redirectIfNotCompleteProfil(to, from, next) {
  //console.log("Tkhra 3a da7k");
  if (store.getters) {
    var userdata = store.getters.getUser;
    var tags = store.getters.getTags;
    var images = store.getters.getImages;
    var profil;
    if (images)
      images.forEach(element => {
        if (element.image_type === "PROFIL") {
          profil = element;
        }
      });
    if (userdata) {
      if ((!userdata.user_gender || !userdata.user_bio || !userdata.user_prefer || !profil || !tags.length))
        next('/settings/profile');
      next();
    }
  }
  else
    next('/settings/profile');
}

export default router;