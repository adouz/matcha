import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        status: '',
        data: {}
    },
    plugins: [createPersistedState()],
    mutations: {
        request(state) {
            state.status = 'loading'
        },
        success(state, data) {
            state.status = 'success'
            state.data = data
        },
        error(state) {
            state.status = 'error'
        },
        logout(state) {
            state.status = ''
            state.data = {}
        },
        update(state, data) {
            state.status = 'success'
            state.data = data;
        }
    },
    actions: {
        login({ commit }, user) {
            return new Promise(async (resolve, reject) => {
                // console.log('%c commit for ' + user.user + ' data', 'background: #222; color: #bada55');
                commit('request')
                await Vue.prototype.$http.get('/userdata/' + user.user).then(
                    res => {
                        if (res.data.success) {
                            const data = res.data.data;
                            commit('success', data)
                            resolve(res.data)
                        } else {
                            // console.log('%c we have error here 0', 'background: red; color: #bada55');
                            if (res.data.message === "No token Provided." || res.data.message === "Failed to authenticate token.") {
                                localStorage.removeItem('token')
                                reject("token error");
                            } else {
                                commit('error')
                                reject("store:: UNKONWN API ERROR")
                            }
                        }
                    }
                ).catch(err => {
                    // console.log('%c we have error here 1', 'background: red; color: #bada55');
                    commit('error')
                    localStorage.removeItem('token')
                    reject(err)
                }
                )
            })
        },
        logout({ commit }) {
            return new Promise((resolve) => {
                commit('logout')
                localStorage.removeItem('token')
                delete axios.defaults.headers.common["x-access-token"]
                resolve()
            })
        },
        update({ commit }, user) {
            return new Promise((resolve) => {
                commit('update', user)
                resolve()
            })
        }
    },
    getters: {
        getUser: (state) => {
            return state.data.user;
        },
        getImages: (state) => {
            return state.data.images;
        },
        getTags: (state) => {
            return state.data.tags;
        },
        getLikes: (state) => {
            return state.data.likes;
        }

    }
})
export default store;