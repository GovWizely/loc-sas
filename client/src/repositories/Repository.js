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
        ...translatedCopyrightApplication
      }
    })
  }

  async _getCopyrightApplication (id) {
    let token = await this._getToken()
    let copyrightApplicationsResponse = await axios({
      url: '/api/v1/copyright_application/' + id,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })

    let results = copyrightApplicationsResponse.data.result

    return results
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

  async _getCurrentUserInfo () {
    let currentUserId = await axios({
      url: ' /api/v1/currentuserapi/current-user-id',
      method: 'GET'
    })

    if (currentUserId.data == null) {
      return false
    }

    const userId = currentUserId.data.user_id
    let usersListResponse = await axios({
      url: '/users/api/read?_flt_0_id=' + userId,
      method: 'GET'
    })
    const usersList = usersListResponse.data
    const currentUser = usersList.result[0]
    return currentUser
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
