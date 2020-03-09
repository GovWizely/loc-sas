<template>
  <div>
    <div v-if="copyrightApplications">
      <div class="header">
        <div class="header-row-1">
          <h1 class="title">Welcome to the U.S. Copyright Registration System</h1>
          <md-button class="md-raised md-accent" to="/create">Create new application</md-button>
        </div>
        <div class="header-row-2">
          <h4>To register a work for copyright, please click the "Create new application" button.</h4>
        </div>
      </div>
      <div class="applications-container">
        <div class="application-filter accent-border accent-bg">
          <div class="display-label">
            <label class="field-label">Display:</label>
          </div>
          <md-radio v-model="applicationStatus" value="all">All</md-radio>
          <md-radio v-model="applicationStatus" value="draft">Draft</md-radio>
          <md-radio v-model="applicationStatus" value="under_review">Under Review</md-radio>
          <md-radio v-model="applicationStatus" value="approved">Approved</md-radio>
        </div>
        <md-table class="accent-border" v-model="copyrightApplications" md-sort="createdOn" md-sort-order="desc">
          <md-table-row slot-scope="{ item }" slot="md-table-row" :id="getId(item.id)">
            <md-table-cell md-label="Service Request #" md-sort-by="id">
              <router-link v-if="item.applicationStatus !== 'draft'" :to="'/view?id=' + item.id">{{item.serviceRequestId}}</router-link>
              <router-link v-else :to="'/create?id=' + item.id">{{item.serviceRequestId}}</router-link>
            </md-table-cell>
            <md-table-cell md-label="Primary Title" md-sort-by="primaryTitle">{{item.primaryTitle}}</md-table-cell>
            <md-table-cell md-label="Created On" md-sort-by="createdOn">{{item.createdOn}}</md-table-cell>
            <md-table-cell md-label="Created By" md-sort-by="createdBy.username">{{item.createdBy.username}}</md-table-cell>
            <md-table-cell
              md-label="Status"
              md-sort-by="applicationStatus"
            >{{snakeToTitle(item.applicationStatus)}}</md-table-cell>
          </md-table-row>
        </md-table>
        <div class="pagination accent-border-bottom accent-border-left accent-border-right">
          <div class="pagination-rows">
            <select v-model="pageSize" class="copyright-select">
              <option value=10>Rows per page: 10</option>
              <option value=50>Rows per page: 50</option>
              <option value=100>Rows per page: 100</option>
            </select>
          </div>
          <div class="pagination-center" v-if="loading">
           loading...
          </div>
          <div class="pagination-center" v-else>
            {{getRangeLabelText()}}
          </div>
          <div class="pagination-pages">
            <md-button class="md-icon-button" @click="page--" :disabled="page === 1">
              <md-icon>
                <img class="sm-icon" src="@/assets/left-sm-caret.png" alt="Left small caret"/>
              </md-icon>
            </md-button>
            <md-button class="md-icon-button" @click="page = 1" :disabled="page === 1">
              <md-icon>
                <img class="sm-icon" src="@/assets/far-left-sm-caret.png" alt="Far left small caret" />
              </md-icon>
            </md-button>
            <select v-model="page" class="copyright-select">
              <option v-for="n in pages" :key="n" :value="n">Page {{n}}</option>
            </select>
            <md-button class="md-icon-button" @click="page = pages" :disabled="page === pages">
              <md-icon>
                <img class="sm-icon" src="@/assets/far-right-sm-caret.png" alt="Far right small caret" />
              </md-icon>
            </md-button>
            <md-button class="md-icon-button" @click="page++" :disabled="page === pages">
              <md-icon>
                <img class="sm-icon" src="@/assets/right-sm-caret.png" alt="Right small caret"/>
              </md-icon>
            </md-button>
          </div>
        </div>
      </div>
    </div>
    <md-dialog-alert class="error" :md-active.sync="errorOccured" md-title="Error Occured!" :md-content="errorMessage" />
  </div>
</template>

<script>
export default {
  name: 'CopyrightApplications',
  props: ['repository'],
  data: () => ({
    copyrightApplications: null,
    errorOccured: false,
    errorMessage: null,
    applicationStatus: 'all',
    recordCount: null,
    pages: null,
    pageSize: 10,
    page: 1,
    loading: false
  }),
  async created () {
    await this.getApplications()
  },
  methods: {
    getId (id) {
      return 'app-id-' + id
    },
    async getApplications () {
      this.loading = true
      let response = await this.repository._getCopyrightApplications(this.pageSize, this.page - 1, this.applicationStatus)
      if (response.error) {
        this.errorOccured = true
        this.errorMessage = response.error
      } else {
        this.copyrightApplications = response.data
        this.recordCount = response.count
        this.pages = Math.ceil(this.recordCount / this.pageSize)
      }
      this.loading = false
    },
    snakeToTitle (str) {
      return str
        .replace('_', ' ')
        .replace('-', ' ')
        .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
    },
    getRangeLabelText () {
      let startRecord = 1
      if (this.page === 1 && this.recordCount === this.copyrightApplications.length) {
        return 'Showing '.concat(startRecord, ' - ', this.recordCount)
      } else if (this.page === 1) {
        return 'Showing  '.concat(startRecord, ' - ', this.pageSize)
      } else if (this.page === this.pages) {
        startRecord = this.recordCount - this.copyrightApplications.length + 1
        return 'Showing '.concat(startRecord, ' - ', this.recordCount)
      } else {
        startRecord = (parseInt(this.pageSize) * (this.page - 1)) + 1
        let endRecord = startRecord + parseInt(this.pageSize)
        return 'Showing '.concat(startRecord, ' - ', endRecord)
      }
    }
  },
  watch: {
    applicationStatus: function (oldVal, newVal) {
      if (oldVal !== newVal) {
        this.page = 1
        this.getApplications()
      }
    },
    page: function (oldVal, newVal) { this.getApplications() },
    pageSize: function (oldVal, newVal) {
      if (oldVal !== newVal) {
        this.page = 1
        this.getApplications()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.applications-container {
  margin-left: 28px;
  margin-right: 28px;
}

.application-filter {
  display: flex;
  margin: auto;
  margin-bottom: 32px;
}

.applications {
  border: 1px solid black;
}

.display-label {
  padding-top: 16px;
  margin-left: 20px;
  margin-right: 12px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  padding: 14px;
}

.pagination-center {
  padding-top: 8px;
}

.pagination-pages > .copyright-select {
  padding-top: 12px;
}

</style>
