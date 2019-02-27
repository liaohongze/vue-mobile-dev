import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Http from './http'
import apis from './http/api'
import Vant from 'vant'

import './assets/scss/index.scss'
import 'vant/lib/index.css'

if (process.env.NODE_ENV === 'development') {
  // require('./utils/vconsole')
  require('./http/mock')
}

Vue.prototype.Http = Http
Vue.prototype.apis = apis

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
