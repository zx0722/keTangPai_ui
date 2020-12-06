import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import http from './network/http.js'
import myModule from './modules/myModule.js'
import request from './network/request.js'
import fileTypeIcon from './modules/fileTypeIcon.js'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$axios = http;
Vue.prototype.$module = myModule;
Vue.prototype.$req = request;
Vue.prototype.$iconType = fileTypeIcon

router.beforeEach((to, from, next) => {
  //  to,将要访问的路径
  // from  从哪个路径跳转过来的
  // next 是一个函数,代表放行
  let token = localStorage.getItem('myToken')
  if (to.path === '/' || to.path === '/register') {
    localStorage.removeItem('myToken')
    return next()
  } else {
    if (!token) {
      return next('/')
    } else {
      next()
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
