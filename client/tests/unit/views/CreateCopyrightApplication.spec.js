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
      _saveAuthor: (id, a) => Promise.resolve({ id: 333 }),
      _saveClaimant: (id, c) => Promise.resolve({ id: 999 })
    }

    const wrapper = renderComponent(CreateCopyrightApplication, { repository: fakeRepository })
    await forIt(10)
    await wrapper.vm.$nextTick()

    wrapper.find('#primary-title').setValue('Zorba')
    wrapper.find('#year-completed').setValue(2010)
    wrapper.find('#publication-date').setValue('04282012')

    wrapper.vm.form.authors[0].citizenship = 'GR'
    wrapper.find('#author-333').find('#author-individual').trigger('click')
    await wrapper.vm.$nextTick()

    wrapper.find('#author-333').find('#first-name').setValue('Ray')
    wrapper.find('#author-333').find('#last-name').setValue('Donovan')
    wrapper.find('#author-333').find('#year-of-birth').setValue(1988)
    wrapper.find('#author-333').find('#year-of-death').setValue(2099)

    wrapper.find('#claimant-999').find('#claimant-individual').trigger('click')
    await wrapper.vm.$nextTick()
    wrapper.find('#claimant-999').find('#first-name').setValue('George')
    wrapper.find('#claimant-999').find('#last-name').setValue('Washington')
    wrapper.find('#claimant-999').find('#address').setValue('1234 Cool Ln')
    wrapper.find('#claimant-999').find('#city').setValue('Arlington')
    wrapper.find('#claimant-999').find('#postal-code').setValue('12345')
    wrapper.vm.form.claimants[0].state = 'VA'
    wrapper.vm.form.claimants[0].country = 'US'

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

    expect(submittedApplication.claimants[0].firstName).to.equal('George')
    expect(submittedApplication.claimants[0].lastName).to.equal('Washington')
    expect(submittedApplication.claimants[0].address).to.equal('1234 Cool Ln')
    expect(submittedApplication.claimants[0].city).to.equal('Arlington')
    expect(submittedApplication.claimants[0].state).to.equal('VA')
    expect(submittedApplication.claimants[0].postalCode).to.equal('12345')
    expect(submittedApplication.claimants[0].country).to.equal('US')

    expect(submittedApplication.serviceRequestId).to.equal('abc123')
  })
})
