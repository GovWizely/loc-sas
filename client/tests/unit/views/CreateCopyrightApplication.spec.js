/* eslint-disable no-unused-expressions */
import { renderComponent, forIt } from './../TestUtils'
import Sinon from 'sinon'
import { expect } from 'chai'
import CreateCopyrightApplication from '@/views/CreateCopyrightApplication'

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

    wrapper.find('#author-first-name').setValue('Ray')
    wrapper.find('#author-last-name').setValue('Donovan')
    wrapper.find('#author-citizenship').setValue('Greece')
    wrapper.find('#author-year-of-birth').setValue('1990')

    wrapper.find('#claimant-first-name').setValue('George')
    wrapper.find('#claimant-last-name').setValue('Washington')
    wrapper.find('#claimant-address').setValue('1234 Cool Ln')
    wrapper.find('#claimant-city').setValue('Arlington')
    wrapper.find('#claimant-state').setValue('VA')
    wrapper.find('#claimant-postal-code').setValue('12345')
    wrapper.find('#claimant-country').setValue('USA')

    wrapper.find('#certificate-contact-first-name').setValue('George')
    wrapper.find('#certificate-contact-last-name').setValue('Washington')
    wrapper.find('#certificate-contact-address').setValue('1234 Cool Ln')
    wrapper.find('#certificate-contact-city').setValue('Arlington')
    wrapper.find('#certificate-contact-state').setValue('VA')
    wrapper.find('#certificate-contact-postal-code').setValue('12345')
    wrapper.find('#certificate-contact-country').setValue('USA')
    await wrapper.vm.$nextTick()

    wrapper.find('#copy-claimant-address-btn').trigger('click')
    await wrapper.vm.$nextTick()

    wrapper.find('#correspondence-phone-number').setValue('(410) 555 1234')
    wrapper.find('#correspondence-email').setValue('tooKool@4skool.io')
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
    expect(submittedApplication.authorCitizenship).to.equal('Greece')
    expect(submittedApplication.authorYearOfBirth).to.equal('1990')

    expect(submittedApplication.claimantFirstName).to.equal('George')
    expect(submittedApplication.claimantLastName).to.equal('Washington')
    expect(submittedApplication.claimantAddress).to.equal('1234 Cool Ln')
    expect(submittedApplication.claimantCity).to.equal('Arlington')
    expect(submittedApplication.claimantState).to.equal('VA')
    expect(submittedApplication.claimantPostalCode).to.equal('12345')
    expect(submittedApplication.claimantCountry).to.equal('USA')

    expect(submittedApplication.certificateContactFirstName).to.equal('George')
    expect(submittedApplication.certificateContactLastName).to.equal('Washington')
    expect(submittedApplication.certificateContactAddress).to.equal('1234 Cool Ln')
    expect(submittedApplication.certificateContactCity).to.equal('Arlington')
    expect(submittedApplication.certificateContactState).to.equal('VA')
    expect(submittedApplication.certificateContactPostalCode).to.equal('12345')
    expect(submittedApplication.certificateContactCountry).to.equal('USA')

    expect(submittedApplication.correspondenceContactFirstName).to.equal('George')
    expect(submittedApplication.correspondenceContactLastName).to.equal('Washington')
    expect(submittedApplication.correspondenceContactAddress).to.equal('1234 Cool Ln')
    expect(submittedApplication.correspondenceContactCity).to.equal('Arlington')
    expect(submittedApplication.correspondenceContactState).to.equal('VA')
    expect(submittedApplication.correspondenceContactPostalCode).to.equal('12345')
    expect(submittedApplication.correspondenceContactCountry).to.equal('USA')

    expect(submittedApplication.correspondencePhoneNumber).to.equal('(410) 555 1234')
    expect(submittedApplication.correspondenceEmail).to.equal('tooKool@4skool.io')
    expect(submittedApplication.serviceRequestId).to.equal('abc123')
  })
})
