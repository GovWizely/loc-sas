<template>
  <div>
    <div v-if="copyrightApplications">
      <div class="header">
        <h2 class="header-title" style="flex: 1">Copyright applications</h2>
        <md-button class="md-raised md-accent" to="/create">NEW APPLICATION</md-button>
      </div>
      <md-table v-model="copyrightApplications" md-sort="id" md-sort-order="desc">
        <md-table-row slot-scope="{ item }" slot="md-table-row" :id="getId(item.id)">
          <md-table-cell md-label="Primary Title" md-sort-by="primary_title"><router-link :to="'/view?id=' + item.id">{{item.primary_title}}</router-link></md-table-cell>
          <md-table-cell md-label="Created On" md-sort-by="created_on">{{item.created_on}}</md-table-cell>
          <md-table-cell md-label="Created By" md-sort-by="created_by.username">{{item.created_by.username}}</md-table-cell>
          <md-table-cell
            md-label="Status"
            md-sort-by="application_status"
          >{{item.application_status}}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CopyrightApplications',
  props: ['repository'],
  data: () => ({
    copyrightApplications: null
  }),
  async created () {
    this.copyrightApplications = await this.repository._getCopyrightApplications()
  },
  methods: {
    getId (id) {
      return 'app-id-' + id
    }
  }
}
</script>
