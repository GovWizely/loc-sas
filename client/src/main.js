import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueMaterial from 'vue-material'
import VueCookies from 'vue-cookies'
import 'vue-material/dist/vue-material.min.css'

Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(VueCookies)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
