import renderComponent from './TestUtils'
import { expect } from 'chai'
import App from '@/App'

describe('Home page', () => {
  it('prompts user to log in', async () => {
    let fakeRepository = {
      _getCurrentUserInfo: () => (
        {
          loggedIn: false
        }
      )
    }

    const wrapper = await renderComponent(App, fakeRepository)

    expect(wrapper.find('#message').text()).to.equal('Please log in.')
  })

  it('prompts user when a server error occurs', async () => {
    let fakeRepository = {
      _getCurrentUserInfo: () => (
        {
          error: 'This is a terrible error'
        }
      )
    }

    const wrapper = await renderComponent(App, fakeRepository)

    expect(wrapper.find('.md-dialog-content').text()).to.equal('This is a terrible error')
  })

  it('displays the users initials upon successful login', async () => {
    let fakeRepository = {
      _getCurrentUserInfo: () => (
        {
          loggedIn: true,
          first_name: 'John',
          last_name: 'Wick'
        }
      )
    }

    const wrapper = await renderComponent(App, fakeRepository)

    expect(wrapper.find('#initials').text()).to.equal('JW')
  })
})
