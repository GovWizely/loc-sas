import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import CopyrightApplications from '@/views/CopyrightApplications'
import Sinon from 'sinon'
import Vue from 'vue'
import VueMaterial from 'vue-material'

Vue.use(VueMaterial)

describe('CopyrightApplications.vue', () => {
  it('renders login button', () => {
    let fakeRepository = {
      _getCopyrightApplications: Sinon.spy()
    }

    const wrapper = mount(CopyrightApplications, {
      propsData: { repository: fakeRepository }
    })
    expect(wrapper.text()).to.include('Login')
  })

  it('renders copyright applications', async () => {
    let fakeRepository = {
      _getCopyrightApplications: () => {
        return [
          { id: 1, primary_title: 'Title A', 'created_by.username': 'Frank', created_on: 'some date', application_status: 'New' },
          { id: 2, primary_title: 'Title B', 'created_by.username': 'Ted', created_on: 'another date', application_status: 'Old' }
        ]
      }
    }

    const wrapper = mount(CopyrightApplications, {
      propsData: { repository: fakeRepository }
    })

    await Vue.nextTick()

    const viewText = wrapper.text()
    expect(viewText).to.include('Logout')

    expect(viewText).to.include('Primary Title')
    expect(viewText).to.include('Created On')
    expect(viewText).to.include('Created By')
    expect(viewText).to.include('Status')

    expect(viewText).to.include('Title A')
    expect(viewText).to.include('Title B')

    expect(viewText).to.include('Frank')
    expect(viewText).to.include('Ted')

    expect(viewText).to.include('some date')
    expect(viewText).to.include('another date')

    expect(viewText).to.include('New')
    expect(viewText).to.include('Old')
  })
})
