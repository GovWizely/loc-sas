/* eslint-disable no-unused-expressions */
import { renderComponent, forIt } from '../TestUtils'
import { expect } from 'chai'
import CopyrightApplicationReview from '@/views/CopyrightApplicationReview'

describe('Copyright Application Review', () => {
  it('user can review a copyright application', async () => {
    const application = {
      serviceRequestId: 'abc123',
      primaryTitle: 'The Matrix',
      alternateTitle: 'The Coolest Film Ever',
      yearCompleted: 2019,
      publicationDate: '01012020',
      publicationCountry: 'GR',
      workDepositName: 'some.pdf',
      possibleRightsAndPermissionsPrefix: 'A',
      possibleRightsAndPermissionsFirstName: 'B',
      possibleRightsAndPermissionsMiddleName: 'C',
      possibleRightsAndPermissionsLastName: 'D',
      possibleRightsAndPermissionsSuffix: 'E',
      possibleRightsAndPermissionsOrganizationName: 'F',
      possibleRightsAndPermissionsAddress: 'G',
      possibleRightsAndPermissionsAddress2: 'H',
      possibleRightsAndPermissionsCity: 'I',
      possibleRightsAndPermissionsState: 'J',
      possibleRightsAndPermissionsPostalCode: 'K',
      possibleRightsAndPermissionsCountry: 'L',
      possibleRightsAndPermissionsPhoneNumber: 'M',
      possibleRightsAndPermissionsEmail: 'N',
      notesToUsco: 'Awesome notes!'
    }

    const wrapper = renderComponent(CopyrightApplicationReview, { application })
    await forIt(10)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('#service-request-id').text()).to.equal('Service Request Number:abc123')
    expect(wrapper.find('#primary-title').text()).to.equal('Primary Title:The Matrix')
    expect(wrapper.find('#alternate-title').text()).to.equal('Alternate Title:The Coolest Film Ever')
    expect(wrapper.find('#year-completed').text()).to.equal('Year Completed:2019')
    expect(wrapper.find('#publication-date').text()).to.equal('Publication Date:01/01/2020')
    expect(wrapper.find('#nation-of-first-publication').text()).to.equal('Nation of First Publication:GR')
    expect(wrapper.find('#work-deposit-name').text()).to.equal('Work Deposit:some.pdf')

    const possibleRightsAndPermissions = wrapper.find('#possible-rights-and-permissions')
    expect(possibleRightsAndPermissions.find('.full-name').text()).to.equal('A B C D E')
    expect(possibleRightsAndPermissions.find('.organization-name').text()).to.equal('F')
    expect(possibleRightsAndPermissions.find('.address-line-1').text()).to.equal('G H')
    expect(possibleRightsAndPermissions.find('.address-line-2').text()).to.equal('I, J K L')
    expect(possibleRightsAndPermissions.find('.phone-number').text()).to.equal('M')
    expect(possibleRightsAndPermissions.find('.email').text()).to.equal('N')

    expect(wrapper.find('#notes-to-usco').text()).to.equal('Awesome notes!')
  })

  it('user can review a copyright application authors', async () => {
    const application = {
      authors: [
        {
          id: 111,
          organization: false,
          prefix: 'Mr',
          firstName: 'John',
          middleName: 'Rad',
          lastName: 'Wick',
          suffix: 'III',
          pseudonym: 'Neo',
          citizenship: 'ZION',
          domicile: 'STARS',
          yearOfBirth: 1988,
          yearOfDeath: 1999
        },
        {
          id: 222,
          organization: true,
          organizationName: 'Amazon',
          domicile: 'MARS'
        }
      ]
    }

    const wrapper = renderComponent(CopyrightApplicationReview, { application })
    await forIt(10)
    await wrapper.vm.$nextTick()

    const author111 = wrapper.find('#author-111')
    expect(author111.find('.full-name').text()).to.equal('Author:Mr John Rad Wick III')
    expect(author111.find('.pseudonym').text()).to.equal('Pseudonym:Neo')
    expect(author111.find('.citizenship').text()).to.equal('Citizenship:ZION')
    expect(author111.find('.domicile').text()).to.equal('Domicile:STARS')
    expect(author111.find('.year-of-birth').text()).to.equal('Year of Birth:1988')
    expect(author111.find('.deceased').text()).to.equal('Deceased:1999')
    expect(author111.find('.work-made-for-hire').text()).to.equal('Work Made For Hire:No')

    const author222 = wrapper.find('#author-222')
    expect(author222.find('.organization-name').text()).to.equal('Author:Amazon')
    expect(author222.find('.work-made-for-hire').text()).to.equal('Work Made For Hire:Yes')
    expect(author222.find('.domicile').text()).to.equal('Domicile:MARS')
  })

  it('user can review a copyright application claimants', async () => {
    const application = {
      claimants: [
        {
          id: 333,
          organization: false,
          prefix: 'Ms',
          firstName: 'Jane',
          middleName: 'Johns',
          lastName: 'Jacobs',
          suffix: 'II',
          address: '123 This Ln',
          address2: 'apt 423',
          city: 'Baltimore',
          state: 'TX',
          postalCode: '32312',
          country: 'USA'
        },
        {
          id: 444,
          organization: true,
          organizationName: 'DELL'
        }
      ]
    }

    const wrapper = renderComponent(CopyrightApplicationReview, { application })
    await forIt(10)
    await wrapper.vm.$nextTick()

    const claimant333 = wrapper.find('#claimant-333')
    expect(claimant333.find('.full-name').text()).to.equal('Ms Jane Johns Jacobs II')
    expect(claimant333.find('.address-line-1').text()).to.equal('123 This Ln apt 423')
    expect(claimant333.find('.address-line-2').text()).to.equal('Baltimore, TX 32312 USA')

    const claimant444 = wrapper.find('#claimant-444')
    expect(claimant444.find('.organization-name').text()).to.equal('DELL')
  })
})
