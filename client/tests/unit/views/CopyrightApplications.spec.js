import { renderComponent } from './../TestUtils'
import { expect } from 'chai'
import CopyrightApplications from '@/views/CopyrightApplications'

describe('Copyright Applications', () => {
  it('renders copyright applications', async () => {
    let fakeRepository = {
      _getAccessToken: () => 'Bearer 123abc',
      _getCopyrightApplications: (pageSize, page, status) => ({
        count: 2,
        data: [
          {
            id: 1,
            primaryTitle: 'Title A',
            createdBy: { username: 'Frank' },
            createdOn: 'some date',
            applicationStatus: 'draft'
          },
          {
            id: 2,
            primaryTitle: 'Title B',
            createdBy: { username: 'Ted' },
            createdOn: 'another date',
            applicationStatus: 'under_review'
          }
        ]
      })
    }

    const wrapper = renderComponent(CopyrightApplications, { repository: fakeRepository })
    await wrapper.vm.$nextTick()

    const application1 = wrapper.find('#app-id-1').text()
    expect(application1).to.include('Title A')
    expect(application1).to.include('Frank')
    expect(application1).to.include('some date')
    expect(application1).to.include('Draft')

    const application2 = wrapper.find('#app-id-2').text()
    expect(application2).to.include('Title B')
    expect(application2).to.include('Ted')
    expect(application2).to.include('another date')
    expect(application2).to.include('Under Review')
  })
})
