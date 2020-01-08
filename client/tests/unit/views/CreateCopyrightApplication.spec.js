/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import CreateCopyrightApplication from '@/views/CreateCopyrightApplication'
import Vue from 'vue'
import VueMaterial from 'vue-material'
import Sinon from 'sinon'

Vue.use(VueMaterial)

describe('Create Copyright Application', () => {
  it('user can create a copyright application', async () => {
    let fakeRepository = {
      _createCopyrightApplication: () => ({ })
    }

    const repositorySpy = Sinon.spy(fakeRepository)

    const wrapper = mount(CreateCopyrightApplication, {
      sync: false,
      propsData: { repository: repositorySpy }
    })

    wrapper.find('#primary-title').setValue('Zorba')
    wrapper.find('#year-completed').setValue(2020)
    wrapper.find('#author-anonymous-btn').trigger('click')

    wrapper.find('#claimant-first-name').setValue('George')
    wrapper.find('#claimant-last-name').setValue('Washington')
    wrapper.find('#claimant-address').setValue('1234 Cool Ln')
    wrapper.find('#claimant-city').setValue('Arlington')
    wrapper.find('#claimant-state').setValue('VA')
    wrapper.find('#claimant-postal-code').setValue('12345')
    wrapper.find('#claimant-country').setValue('USA')
    await wrapper.vm.$nextTick()

    wrapper.find('#copy-claimant-address-btn').trigger('click')
    await wrapper.vm.$nextTick()

    wrapper.find('#correspondence-phone-number').setValue('(410) 555 1234')
    wrapper.find('#correspondence-email').setValue('tooKool@4skool.io')
    await wrapper.vm.$nextTick()

    wrapper.find('#certification').trigger('click')
    await wrapper.vm.$nextTick()

    wrapper.find('form').trigger('submit.prevent')

    expect(repositorySpy._createCopyrightApplication.called).to.be.true
    const submittedApplication = repositorySpy._createCopyrightApplication.lastCall.args[0]
    expect(submittedApplication.primaryTitle).to.equal('Zorba')
    expect(submittedApplication.yearCompleted).to.equal('2020')
    expect(submittedApplication.authorFirstName).to.equal('anonymous')
    expect(submittedApplication.authorLastName).to.equal('anonymous')
    expect(submittedApplication.authorCitizenship).to.equal('unk')

    expect(submittedApplication.claimantFirstName).to.equal('George')
    expect(submittedApplication.claimantLastName).to.equal('Washington')
    expect(submittedApplication.claimantAddress).to.equal('1234 Cool Ln')
    expect(submittedApplication.claimantCity).to.equal('Arlington')
    expect(submittedApplication.claimantState).to.equal('VA')
    expect(submittedApplication.claimantPostalCode).to.equal('12345')
    expect(submittedApplication.claimantCountry).to.equal('USA')

    expect(submittedApplication.correspondenceContactFirstName).to.equal('George')
    expect(submittedApplication.correspondenceContactLastName).to.equal('Washington')
    expect(submittedApplication.correspondenceContactAddress).to.equal('1234 Cool Ln')
    expect(submittedApplication.correspondenceContactCity).to.equal('Arlington')
    expect(submittedApplication.correspondenceContactState).to.equal('VA')
    expect(submittedApplication.correspondenceContactPostalCode).to.equal('12345')
    expect(submittedApplication.correspondenceContactCountry).to.equal('USA')

    expect(submittedApplication.correspondencePhoneNumber).to.equal('(410) 555 1234')
    expect(submittedApplication.correspondenceEmail).to.equal('tooKool@4skool.io')
  })
})
