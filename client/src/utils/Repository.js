import { keysToCamel, keysToSnake } from './FieldTranslators'
const axios = require('axios')

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
    const result = await axios({
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
    }).then(response => response.data.access_token)
      .catch(error => this.handleError(error))

    return result
  }

  async _getCurrentUserInfo (accessToken) {
    let result
    if (accessToken) {
      result = await axios({
        url: '/api/v1/currentuserapi/current-user',
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      }).then(response => response.data.user)
        .catch(error => this.handleError(error))
    } else {
      result = {
        error: 'Could not procure access token'
      }
    }

    return keysToCamel(result)
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
