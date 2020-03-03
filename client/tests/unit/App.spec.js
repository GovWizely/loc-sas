import { renderComponent } from './TestUtils'
import { expect } from 'chai'
import App from '@/App'

describe('Home page', () => {
  it('prompts user to log in', async () => {
    let fakeRepository = {
      _getAccessToken: () => ('abc123'),
      _getCurrentUserInfo: (_) => (null)
    }

    const wrapper = renderComponent(App, fakeRepository)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('#message').text()).to.equal('Please log in.')
  })

  it.only('prompts user when a server error occurs', async () => {
    let fakeRepository = {
      _getAccessToken: () => ({
        error: 'This is a terrible error'
      }),
      _getCurrentUserInfo: (_) => (
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
      _getAccessToken: () => ('abc123'),
      _getCurrentUserInfo: (_) => (
        {
          userId: 'user1',
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
