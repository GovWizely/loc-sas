const axios = require('axios')

export default class Repository {
  async _getCopyrightApplications () {
    let _getCopyrightApplicationsResponse = await axios({
      url: '/superusercopyrightapplicationmodelview/api/read',
      method: 'GET'
    })

    let pks = _getCopyrightApplicationsResponse.data.pks
    let results = _getCopyrightApplicationsResponse.data.result

    for (var i = 0; i < pks.length; i++) {
      results[i].id = pks[i]
    }

    return results
  }
}
