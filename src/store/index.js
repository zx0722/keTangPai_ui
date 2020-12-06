import Vue from 'vue'
import Vuex from 'vuex'
import req from '../network/request'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户账号
    account: '',
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
  getters: {
    getAccount: (state) => {
      if (state.account === '') {
        state.account = localStorage.getItem('myAccount')
      }

      if (state.account === '' || !state.account) {
        req.getMe()
          .then(val => {
            state.account = val.data.id
            localStorage.setItem('myAccount', val.data.id)
          })
          .catch(err => {
            console.log('Vuex getAccount', err);
          })
      }

      return state.account

    },
  }
})
