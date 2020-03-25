import { keysToCamel, keysToSnake } from './FieldTranslators'
const axios = require('axios')

export default class Repository {
  async _getCopyrightApplications (pageSize, page, applicationStatus) {
    const fields = ['primary_title', 'created_on', 'created_by', 'application_status', 'service_request_id'].join()
    let filter = ''
    if (applicationStatus !== 'all') { filter = ',filters:!((col:application_status,opr:eq,value:' + applicationStatus + '))' }
    let url = '/api/v1/copyright_application/?q=(columns:!(' + fields + '),page:' + page + ',page_size:' + pageSize + '' + filter + ')'

    const copyrightApplicationsResponse = await axios({
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.accessToken
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
    await this._saveAuthors(copyrightApplication.id, copyrightApplication.authors)
    await this._saveClaimants(copyrightApplication.id, copyrightApplication.claimants)
    const tmpCopyrightApplication = { ...copyrightApplication }
    tmpCopyrightApplication.authors = copyrightApplication.authors.map(a => a.id)
    tmpCopyrightApplication.claimants = copyrightApplication.claimants.map(c => c.id)
    return this.saveRequest('/api/v1/copyright_application/', tmpCopyrightApplication)
  }

  async _saveAuthor (copyrightApplicationId, author) {
    author.copyrightApplicationId = copyrightApplicationId
    return this.saveRequest('/api/v1/author/', author)
  }

  async _saveAuthors (copyrightApplicationId, authors) {
    Promise.all(
      authors.map(async a => {
        return this._saveAuthor(copyrightApplicationId, a)
      })
    )
  }

  _deleteAuthor (id) {
    this.deleteRequest('author', id)
  }

  _deleteClaimant (id) {
    this.deleteRequest('claimant', id)
  }

  async _saveClaimant (copyrightApplicationId, claimant) {
    claimant.copyrightApplicationId = copyrightApplicationId
    return this.saveRequest('/api/v1/claimant/', claimant)
  }

  async _saveClaimants (copyrightApplicationId, claimants) {
    Promise.all(
      claimants.map(async c => {
        return this._saveClaimant(copyrightApplicationId, c)
      })
    )
  }

  deleteRequest (entity, id) {
    axios({
      url: '/api/v1/' + entity + '/' + id,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.accessToken
      }
    }).catch(error => this.handleError(error))
  }

  async saveRequest (baseUrl, entity) {
    const id = entity.id
    const url = (id) ? baseUrl + id : baseUrl
    const method = (id) ? 'PUT' : 'POST'
    const response = await axios({
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.accessToken
      },
      data: {
        ...keysToSnake(entity)

      }
    }).then(resp => {
      if (id) {
        return { ...resp.data.result, id }
      } else {
        return { ...resp.data.result, id: resp.data.id }
      }
    }).catch(error => this.handleError(error))

    return keysToCamel(response)
  }

  async _getCopyrightApplication (id) {
    const copyrightApplicationResponse = await axios({
      url: '/api/v1/copyright_application/' + id,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.accessToken
      }
    }).catch(error => this.handleError(error))

    let result
    if (copyrightApplicationResponse.error) {
      result = copyrightApplicationResponse
    } else {
      result = {
        ...copyrightApplicationResponse.data.result,
        id: copyrightApplicationResponse.data.id
      }
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
    }).then(response => 'Bearer ' + response.data.access_token)
      .catch(error => this.handleError(error))

    localStorage.accessToken = result
  }

  async _getCurrentUserInfo () {
    let result = await axios({
      url: '/api/v1/currentuserapi/current-user',
      method: 'GET',
      headers: {
        Authorization: localStorage.accessToken
      }
    }).then(response => response.data.user)
      .catch(error => this.handleError(error))

    return keysToCamel(result)
  }

  async _generateServiceRequest () {
    const serviceRequestId = await axios({
      url: '/api/v1/copyrightapplicationservicerequestapi/generate-service-request',
      method: 'GET',
      headers: {
        Authorization: localStorage.accessToken
      }
    }).then(response => response.data.id)
      .catch(error => this.handleError(error))
    return serviceRequestId
  }

  async _uploadFile (formData, serviceRequestId) {
    const response = await axios({
      url: '/api/v1/copyrightapplicationfileapi/file-upload?service_request_id=' + serviceRequestId,
      method: 'POST',
      data: formData,
      headers: {
        Authorization: localStorage.accessToken
      }
    }).then(resp => resp.data.file_url)
      .catch(error => this.handleError(error))

    return response
  }

  async _downloadFile (url, fileName) {
    axios({
      url,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Authorization: localStorage.accessToken
      }
    }).then((response) => {
      const linkhref = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = linkhref
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
    })
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
