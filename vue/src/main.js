import "babel-polyfill"
import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import axios from 'axios'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import VueSocketIO from 'vue-socket.io';
import * as VueGoogleMaps from 'vue2-google-maps'
import io from 'socket.io-client';
import VueCarousel from 'vue-carousel';
import VModal from 'vue-js-modal'

Vue.use(VModal, { dialog: true })

Vue.use(VueGoogleMaps, {
  load: {
    libraries: 'places',
    key: 'AIzaSyAlhMoDvlSEwV0Q87e2hNvmezSHxAksdu0'
  }
})

//socket.io
var socket = io.connect(":3000", {
  'query': 'token=' + localStorage.getItem('token')
});
Vue.use(new VueSocketIO({
  debug: false,
  connection: socket
}))


//icons 
import { library } from '@fortawesome/fontawesome-svg-core';
// internal icons
import {
  faCheck, faCheckCircle, faInfoCircle, faExclamationTriangle, faExclamationCircle, faUserAlt, faSignOutAlt, faUserCog, faGrinHearts, faTv, faSearch, faComments, faSignInAlt, faUnlockAlt,
  faArrowUp, faAngleRight, faAngleLeft, faAngleDown, faUserSecret, faMale, faFemale, faMars, faVenus, faUserShield, faHeart, faExternalLinkAlt, faUserFriends, faUserPlus, faBell, faEnvelope,
  faEye, faEyeSlash, faCaretDown, faCaretUp, faUpload, faDiagnoses, faFireAlt,faRandom
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCheck, faCheckCircle, faInfoCircle, faExclamationTriangle, faExclamationCircle, faUserShield, faUserAlt, faSignOutAlt, faUserCog, faGrinHearts, faComments, faUserPlus, faUnlockAlt,
  faArrowUp, faAngleRight, faAngleLeft, faAngleDown, faUserSecret, faMale, faFemale, faMars, faVenus, faHeart, faExternalLinkAlt, faUserFriends, faTv, faSearch, faSignInAlt, faBell, faEnvelope,
  faEye, faEyeSlash, faCaretDown, faCaretUp, faUpload, faDiagnoses, faFireAlt,faRandom);
Vue.component('vue-fontawesome', FontAwesomeIcon);
Vue.use(ElementUI);
Vue.use(VueCarousel);
import 'buefy/dist/buefy.css'
import router from './router'
import ToggleSwitch from 'vuejs-toggle-switch'
Vue.use(ToggleSwitch)
Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
});

// Turn off the annoying Vue production tip
Vue.config.productionTip = false

//AXIOS prototype
const base = axios.create({
  baseURL: 'http://'+window.location.hostname+':3000/api'
})

Vue.prototype.$http = base

// request middlware for axios to add token in header
Vue.prototype.$http.interceptors.request.use(config => {
  //console.log('Request was sent to '+window.location.hostname);
  var token = localStorage.getItem("token");
  if (token) config.headers.common['x-access-token'] = token;
  return config;
}, error => {
  return Promise.reject(error);
});

//Axios midlleware to check for token validation response TO DO:[NOT WORKING]
Vue.prototype.$http.interceptors.response.use((res) => {
  if (!res.data.success) {
    if (res.data.message === "Failed to authenticate token.")
      localStorage.removeItem('token')
  }
  return Promise.resolve(res);
}, (err) => {
  return Promise.reject(err);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
