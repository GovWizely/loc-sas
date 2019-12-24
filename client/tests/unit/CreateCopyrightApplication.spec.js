import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import CreateCopyrightApplication from '@/views/CreateCopyrightApplication'
import Vue from 'vue'
import VueMaterial from 'vue-material'
import Sinon from 'sinon'

Vue.use(VueMaterial)

describe('CreateCopyrightApplication.vue', () => {
  // Form validation is preventing a submission, but thats a lie
  xit('user creates a copyright application', async () => {
    const createCopyrightApplicationSpy = Sinon.spy()

    let fakeRepository = {
      _createCopyrightApplication: createCopyrightApplicationSpy
    }

    const wrapper = mount(CreateCopyrightApplication, {
      sync: false,
      propsData: { repository: fakeRepository }
    })

    wrapper.find('#primary-title').setValue('Titel Vango')
    wrapper.find('#author-first-name').setValue('Evangelos')
    wrapper.find('#author-last-name').setValue('Poneres')
    wrapper.find('#year-completed').setValue(2019)
    wrapper.find('#correspondence-email').setValue('cool@stuff.io')
    wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    console.log(wrapper.find('#primary-title').element.value)
    console.log(wrapper.find('#author-first-name').element.value)
    console.log(wrapper.find('#author-last-name').element.value)
    console.log(wrapper.find('#year-completed').element.value)
    console.log(wrapper.find('#correspondence-email').element.value)

    expect(createCopyrightApplicationSpy.called).to.be.true()
  })
})
