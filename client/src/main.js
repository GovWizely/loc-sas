import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import Repository from '@/repositories/Repository'
import VueMaterial from 'vue-material'
import VueCookies from 'vue-cookies'
import JsonViewer from 'vue-json-viewer'
import 'vue-material/dist/vue-material.min.css'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueMaterial)
Vue.use(VueCookies)
Vue.use(JsonViewer)

const repository = new Repository()
new Vue({
  router: router(repository),
  render: h => h(App, { props: { repository } })
}).$mount('#app')
