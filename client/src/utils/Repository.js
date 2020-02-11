import { keysToCamel, keysToSnake } from './FieldTranslators'
const axios = require('axios')

let accessToken = null

export default class Repository {
  async _getCopyrightApplications (pageSize, page, applicationStatus) {
    const accessToken = await this._getAccessToken()
    const fields = ['primary_title', 'created_on', 'created_by', 'application_status', 'service_request_id'].join()
    let filter = ''
    if (applicationStatus !== 'all') { filter = ',filters:!((col:application_status,opr:eq,value:' + applicationStatus + '))' }
    let url = '/api/v1/copyright_application/?q=(columns:!(' + fields + '),page:' + page + ',page_size:' + pageSize + '' + filter + ')'

    const copyrightApplicationsResponse = await axios({
      url,
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

    return keysToCamel(results)
  }

  async _saveCopyrightApplication (copyrightApplication) {
    const baseUrl = '/api/v1/copyright_application/'
    const id = copyrightApplication.id
    const url = (id) ? baseUrl + id : baseUrl
    const method = (id) ? 'PUT' : 'POST'
    const accessToken = await this._getAccessToken()
    const translatedCopyrightApplication = keysToSnake(copyrightApplication)
    const response = await axios({
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      },
      data: {
        ...translatedCopyrightApplication
      }
    }).catch(error => this.handleError(error))

    return keysToCamel(response.data)
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
    return keysToCamel(result)
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
        username: 'user1',
        password: 'password',
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

    return keysToCamel(result)
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

  async _uploadFile (formData, serviceRequestId) {
    const response = await axios({
      url: '/api/v1/copyrightapplicationfileapi/file-upload?service_request_id=' + serviceRequestId,
      method: 'POST',
      data: formData
    }).then(response => response.data.file_url)
      .catch(error => this.handleError(error))

    return response
  }

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
    return {
      data: results,
      count: response.data.count
    }
  }
}
