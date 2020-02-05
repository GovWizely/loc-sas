const axios = require('axios')

let accessToken = null

export default class Repository {
  async _getCopyrightApplications () {
    const accessToken = await this._getAccessToken()
    const fields = ['primary_title', 'created_on', 'created_by', 'application_status', 'service_request_id'].join()
    const copyrightApplicationsResponse = await axios({
      url: '/api/v1/copyright_application/?q=(columns:!(' + fields + '),page:0,page_size:100)',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    }).catch(error => this.handleError(error))

    let results
    if (copyrightApplicationsResponse.error) {
      results = copyrightApplicationsResponse
    } else {
      results = this.appendIds(copyrightApplicationsResponse)
    }

    return results.map(obj => this.keysToCamel(obj))
  }

  async _createCopyrightApplication (copyrightApplication) {
    const accessToken = await this._getAccessToken()
    const translatedCopyrightApplication = this.keysToSnake(copyrightApplication)
    const response = await axios({
      url: '/api/v1/copyright_application/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      },
      data: {
        ...translatedCopyrightApplication
      }
    }).catch(error => this.handleError(error))

    return response
  }

  async _saveDraft (draft, draftId) {
    const accessToken = await this._getAccessToken()
    let response
    if (draftId === null) {
      response = await axios({
        url: '/api/v1/copyright_application_draft/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken
        },
        data: {
          draft
        }
      }).then(response => response.data.id)
        .catch(error => this.handleError(error))
    } else {
      response = await axios({
        url: '/api/v1/copyright_application_draft/' + draftId,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken
        },
        data: {
          draft
        }
      }).catch(error => this.handleError(error))
    }
    return response
  }

  async _getDrafts () {
    const accessToken = await this._getAccessToken()
    const response = await axios({
      url: '/api/v1/copyright_application_draft/',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    }).catch(error => this.handleError(error))

    let results
    if (response.error) {
      results = response
    } else {
      results = this.appendIds(response)
    }

    return results
  }

  async _clearDraft (draftId) {
    const accessToken = await this._getAccessToken()
    await axios({
      url: '/api/v1/copyright_application_draft/' + draftId,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    }).catch(error => this.handleError(error))
  }

  async _getCopyrightApplication (id) {
    const accessToken = await this._getAccessToken()
    const copyrightApplicationResponse = await axios({
      url: '/api/v1/copyright_application/' + id,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    }).catch(error => this.handleError(error))

    let result
    if (copyrightApplicationResponse.error) {
      result = copyrightApplicationResponse
    } else {
      result = copyrightApplicationResponse.data.result
    }
    return this.keysToCamel(result)
  }

  async _getAccessToken () {
    if (accessToken) return accessToken

    const tokenResponse = await axios({
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
    }).catch(error => this.handleError(error))

    accessToken = tokenResponse.data.access_token

    return accessToken
  }

  async _getCurrentUserInfo () {
    let result
    const currentUserResponse = await axios({
      url: '/api/v1/currentuserapi/current-user-id',
      method: 'GET'
    }).catch(error => this.handleError(error))

    if (currentUserResponse.error) {
      result = currentUserResponse
    } else {
      const userId = currentUserResponse.data.user_id
      if (userId === null) {
        result = { loggedIn: false }
      } else {
        let usersListResponse = await this.getUsersList('_flt_0_id=' + userId)
        if (usersListResponse.error) {
          result = usersListResponse
        } else {
          const usersList = usersListResponse.data
          const currentUser = usersList.result[0]
          currentUser.loggedIn = true
          currentUser.userId = userId
          result = currentUser
        }
      }
    }

    return this.keysToCamel(result)
  }

  async getCurrentUser () {
    const currentUserResponse = await axios({
      url: '/api/v1/currentuserapi/current-user-id',
      method: 'GET'
    }).catch(error => this.handleError(error))
    return currentUserResponse
  }

  async getUsersList (filter) {
    const usersListResponse = await axios({
      url: '/users/api/read?' + filter,
      method: 'GET'
    }).catch(error => this.handleError(error))
    return usersListResponse
  }

  async _generateServiceRequest () {
    const serviceRequestId = await axios({
      url: '/api/v1/copyrightapplicationservicerequestapi/generate-service-request',
      method: 'GET'
    }).then(response => response.data.id)
      .catch(error => this.handleError(error))
    return serviceRequestId
  }

  keysToSnake (o) {
    if (this.isObject(o)) {
      const n = {}

      Object.keys(o)
        .forEach((k) => {
          n[this.toSnake(k)] = this.keysToSnake(o[k])
        })

      return n
    } else if (this.isArray(o)) {
      return o.map((i) => {
        return this.keysToSnake(i)
      })
    }

    return o
  }

  keysToCamel (o) {
    if (this.isObject(o)) {
      const n = {}

      Object.keys(o)
        .forEach((k) => {
          n[this.toCamel(k)] = this.keysToCamel(o[k])
        })

      return n
    } else if (this.isArray(o)) {
      return o.map((i) => {
        return this.keysToCamel(i)
      })
    }

    return o
  }

  toCamel = (str) => {
    return str.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''))
  }

  toSnake = (string) => {
    return string.replace(/[\w]([A-Z])/g, (m) => m[0] + '_' + m[1]).toLowerCase()
  }

  isArray = function (a) {
    return Array.isArray(a)
  };

  isObject = function (o) {
    return o === Object(o) && !this.isArray(o) && typeof o !== 'function'
  };

  handleError = (err) => {
    console.log(err)
    let message
    if (err.response.status === 500) {
      message = {
        error: 'Server unavailable'
      }
    } else {
      message = {
        error: err.response.data
      }
    }

    return message
  }

  appendIds (response) {
    const ids = response.data.ids
    let results = response.data.result
    for (var i = 0; i < ids.length; i++) {
      results[i].id = ids[i]
    }
    return results
  }
}
