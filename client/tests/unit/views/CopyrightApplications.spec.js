import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import CopyrightApplications from '@/views/CopyrightApplications'
import Vue from 'vue'

describe('Copyright Applications', () => {
  it('renders copyright applications', async () => {
    let fakeRepository = {
      _getCopyrightApplications: () => (
        [
          {
            id: 1,
            primary_title: 'Title A',
            created_by: { username: 'Frank' },
            created_on: 'some date',
            application_status: 'New'
          },
          {
            id: 2,
            primary_title: 'Title B',
            created_by: { username: 'Ted' },
            created_on: 'another date',
            application_status: 'Old'
          }
        ]
      )
    }

    const wrapper = mount(CopyrightApplications, {
      sync: false,
      propsData: { repository: fakeRepository },
      stubs: ['router-link']
    })

    await Vue.nextTick()

    const application1 = wrapper.find('#app-id-1').text()
    expect(application1).to.include('Title A')
    expect(application1).to.include('Frank')
    expect(application1).to.include('some date')
    expect(application1).to.include('New')

    const application2 = wrapper.find('#app-id-2').text()
    expect(application2).to.include('Title B')
    expect(application2).to.include('Ted')
    expect(application2).to.include('another date')
    expect(application2).to.include('Old')
  })
})
