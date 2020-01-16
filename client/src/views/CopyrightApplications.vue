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
      <md-table v-model="copyrightApplications" md-sort="id" md-sort-order="desc">
        <md-table-row slot-scope="{ item }" slot="md-table-row" :id="getId(item.id)">
          <md-table-cell md-label="Service Request #" md-sort-by="id">
            <router-link :to="'/view?id=' + item.id">{{item.service_request_id}}</router-link>
          </md-table-cell>
          <md-table-cell md-label="Primary Title" md-sort-by="primary_title">{{item.primary_title}}</md-table-cell>
          <md-table-cell md-label="Created On" md-sort-by="created_on">{{item.created_on}}</md-table-cell>
          <md-table-cell md-label="Created By" md-sort-by="created_by.username">{{item.created_by.username}}</md-table-cell>
          <md-table-cell
            md-label="Status"
            md-sort-by="application_status"
          >{{item.application_status}}</md-table-cell>
        </md-table-row>
      </md-table>
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
    errorMessage: null
  }),
  async created () {
    let response = await this.repository._getCopyrightApplications()
    if (response.error) {
      this.errorOccured = true
      this.errorMessage = response.error
    } else {
      this.copyrightApplications = response
    }
  },
  methods: {
    getId (id) {
      return 'app-id-' + id
    }
  }
}
</script>
