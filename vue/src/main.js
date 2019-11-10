import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import axios from 'axios'
import store  from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import io from "socket.io-client";
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAlhMoDvlSEwV0Q87e2hNvmezSHxAksdu0',
    libraries: 'places',
  }
})

//socket.io
var socket = io("localhost:3000");
Vue.prototype.$socket = socket;

//icons 
import { library } from '@fortawesome/fontawesome-svg-core';
// internal icons
import { faCheck, faCheckCircle, faInfoCircle, faExclamationTriangle, faExclamationCircle,faUserAlt,faSignOutAlt,faUserCog,
    faArrowUp, faAngleRight, faAngleLeft, faAngleDown,faUserSecret,faMale,faFemale,faMars,faVenus,faHeart, faExternalLinkAlt,
    faEye, faEyeSlash, faCaretDown, faCaretUp, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCheck, faCheckCircle, faInfoCircle, faExclamationTriangle, faExclamationCircle,faUserAlt,faSignOutAlt,faUserCog,
    faArrowUp, faAngleRight, faAngleLeft, faAngleDown,faUserSecret,faMale,faFemale,faMars,faVenus,faHeart, faExternalLinkAlt,
    faEye, faEyeSlash, faCaretDown, faCaretUp, faUpload);
Vue.component('vue-fontawesome', FontAwesomeIcon);

Vue.use(ElementUI)

import 'buefy/dist/buefy.css'
import router from './router'
import ToggleSwitch from 'vuejs-toggle-switch'
Vue.use(ToggleSwitch)
Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
});

Vue.config.productionTip = false

const base = axios.create({
  baseURL: 'http://localhost:3000'
})
Vue.prototype.$http = base
const token = localStorage.getItem('token')
if (token){
  Vue.prototype.$http.defaults.headers.common['x-access-token'] = token
}

//Axios midlleware to check for token validation response TO DO:[NOT WORKING]
Vue.prototype.$http.interceptors.response.use((res) => {
    if (!res.data.success){
      if (res.data.message === "Failed to authenticate token."){
        localStorage.removeItem('token')
        delete axios.defaults.headers.common["x-access-token"]
      }
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
