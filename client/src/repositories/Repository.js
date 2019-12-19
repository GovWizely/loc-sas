const axios = require('axios')

export default class Repository {
  async _getCopyrightApplications () {
    let token = await this._getToken()
    const fields = ['primary_title', 'created_on', 'created_by', 'application_status'].join()
    let copyrightApplicationsResponse = await axios({
      url: '/api/v1/copyright_application/?q=(columns:!(' + fields + '),page:0,page_size:100)',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })

    let ids = copyrightApplicationsResponse.data.ids
    let results = copyrightApplicationsResponse.data.result

    for (var i = 0; i < ids.length; i++) {
      results[i].id = ids[i]
    }

    return results
  }

  async _createCopyrightApplication (copyrightApplication) {
    let token = await this._getToken()
    let translatedCopyrightApplication = this.translateToSnakeCase(copyrightApplication)
    await axios({
      url: '/api/v1/copyright_application/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      data: {
        ...translatedCopyrightApplication,
        claimant_address: 'TEST',
        claimant_city: 'TEST',
        claimant_country: 'TEST',
        claimant_postal_code: 'TEST',
        claimant_state: 'TEST',
        correspondence_contact_address: 'TEST',
        correspondence_contact_city: 'TEST',
        correspondence_contact_country: 'TEST',
        correspondence_contact_postal_code: 'TEST',
        correspondence_contact_state: 'TEST'
      }
    })
  }

  async _getToken () {
    let tokenResponse = await axios({
      url: '/api/v1/security/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        username: 'admin',
        password: 'admin',
        provider: 'db'
      }
    })

    return tokenResponse.data.access_token
  }

  async _userIsAuthenticated () {
    // Using this API to verify a user is logged in...
    let usersListResponse = await axios({
      url: '/users/api/readvalues',
      method: 'GET'
    })

    return (usersListResponse !== null)
  }

  translateToSnakeCase (obj) {
    let objClone = { ...obj }
    Object.keys(objClone).map(key => {
      let snakeCaseField = this.camelToSnake(key)
      objClone[snakeCaseField] = objClone[key]
      delete objClone[key]
    })
    return objClone
  }

  camelToSnake = (string) => {
    return string.replace(/[\w]([A-Z])/g, function (m) {
      return m[0] + '_' + m[1]
    }).toLowerCase()
  }
}
