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
      _generateServiceRequest: () => Promise.resolve('abc123'),
      _saveAuthor: (id, a) => Promise.resolve({ id: 333 })
    }

    const wrapper = renderComponent(CreateCopyrightApplication, fakeRepository)
    await forIt(10)
    await wrapper.vm.$nextTick()

    wrapper.find('#primary-title').setValue('Zorba')
    wrapper.find('#year-completed').setValue(2010)
    wrapper.find('#publication-date').setValue('04282012')

    wrapper.vm.form.authors[0].citizenship = 'GR'
    wrapper.find('.author-form').find('#author-individual').trigger('click')
    await wrapper.vm.$nextTick()

    wrapper.find('.author-form').find('#first-name').setValue('Ray')
    wrapper.find('.author-form').find('#last-name').setValue('Donovan')
    wrapper.find('.author-form').find('#year-of-birth').setValue(1988)
    wrapper.find('.author-form').find('#year-of-death').setValue(2099)

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
    expect(submittedApplication.yearCompleted).to.equal(2010)
    expect(submittedApplication.publicationDate).to.equal('04282012')

    expect(submittedApplication.authors[0].firstName).to.equal('Ray')
    expect(submittedApplication.authors[0].lastName).to.equal('Donovan')
    expect(submittedApplication.authors[0].citizenship).to.equal('GR')
    expect(submittedApplication.authors[0].yearOfBirth).to.equal(1988)
    expect(submittedApplication.authors[0].yearOfDeath).to.equal(2099)

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
