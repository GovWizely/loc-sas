/* eslint-disable no-unused-expressions */
import { renderComponent, forIt } from './../TestUtils'
import Sinon from 'sinon'
import { expect } from 'chai'
import CreateCopyrightApplication from '@/views/CreateCopyrightApplication'

window.scrollTo = (x, y) => {}

describe('Create Copyright Application', () => {
  it('user can create a copyright application', async () => {
    let _saveCopyrightApplication = Sinon.stub().resolves({ id: 1 })
    let fakeRepository = {
      _saveCopyrightApplication,
      _generateServiceRequest: () => Promise.resolve('abc123')
    }

    const wrapper = renderComponent(CreateCopyrightApplication, fakeRepository)
    await forIt(10)
    await wrapper.vm.$nextTick()

    wrapper.find('#primary-title').setValue('Zorba')
    wrapper.find('#year-completed').setValue(2020)

    wrapper.vm.form.authorCitizenship = 'GR'
    wrapper.find('#author-individual').trigger('click')
    await wrapper.vm.$nextTick()

    wrapper.find('#author-first-name').setValue('Ray')
    wrapper.find('#author-last-name').setValue('Donovan')

    wrapper.find('#claimant-individual').trigger('click')
    await wrapper.vm.$nextTick()
    wrapper.find('#claimant-first-name').setValue('George')
    wrapper.find('#claimant-last-name').setValue('Washington')
    wrapper.find('#claimant-address').setValue('1234 Cool Ln')
    wrapper.find('#claimant-city').setValue('Arlington')
    wrapper.vm.form.claimantState = 'VA'
    wrapper.find('#claimant-postal-code').setValue('12345')
    wrapper.vm.form.claimantCountry = 'US'

    await wrapper.vm.$nextTick()

    wrapper.vm.form.workDepositUrl = 'some-work-deposit.pdf'
    await wrapper.vm.$nextTick()

    wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    wrapper.find('#certification').trigger('click')
    await wrapper.vm.$nextTick()

    wrapper.find('#submit').trigger('click')

    expect(_saveCopyrightApplication.called).to.be.true
    const submittedApplication = _saveCopyrightApplication.lastCall.args[0]
    expect(submittedApplication.primaryTitle).to.equal('Zorba')
    expect(submittedApplication.yearCompleted).to.equal('2020')
    expect(submittedApplication.authorFirstName).to.equal('Ray')
    expect(submittedApplication.authorLastName).to.equal('Donovan')
    expect(submittedApplication.authorCitizenship).to.equal('GR')

    expect(submittedApplication.claimantFirstName).to.equal('George')
    expect(submittedApplication.claimantLastName).to.equal('Washington')
    expect(submittedApplication.claimantAddress).to.equal('1234 Cool Ln')
    expect(submittedApplication.claimantCity).to.equal('Arlington')
    expect(submittedApplication.claimantState).to.equal('VA')
    expect(submittedApplication.claimantPostalCode).to.equal('12345')
    expect(submittedApplication.claimantCountry).to.equal('US')
    expect(submittedApplication.serviceRequestId).to.equal('abc123')
  })
})
