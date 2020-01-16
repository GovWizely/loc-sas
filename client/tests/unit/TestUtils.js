import { mount, createLocalVue } from '@vue/test-utils'
import router from '../../src/router'
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'

export function renderComponent (component, repository) {
  const localVue = createLocalVue()
  localVue.use(VueRouter)
  localVue.use(VueMaterial)

  const wrapper = mount(component, {
    localVue,
    router: router(repository),
    sync: false,
    propsData: { repository },
    stubs: ['router-view', 'router-link']
  })

  return wrapper
}

export async function forIt (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
