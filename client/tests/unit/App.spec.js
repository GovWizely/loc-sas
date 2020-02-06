import { renderComponent } from './TestUtils'
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

    const wrapper = renderComponent(App, fakeRepository)
    await wrapper.vm.$nextTick()

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

    const wrapper = renderComponent(App, fakeRepository)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.md-dialog-content').text()).to.equal('This is a terrible error')
  })

  it('displays the users initials upon successful login', async () => {
    let fakeRepository = {
      _getCurrentUserInfo: () => (
        {
          loggedIn: true,
          firstName: 'John',
          lastName: 'Wick'
        }
      )
    }

    const wrapper = renderComponent(App, fakeRepository)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('#initials').text()).to.equal('JW')
  })
})
