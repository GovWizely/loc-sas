<template>
  <div>
    <section class="login-section">
      <md-button v-if="!isUserLoggedIn" @click="login()">Login</md-button>
      <md-button v-else @click="logout()">Logout</md-button>
    </section>
    <div class="content" v-if="copyrightApplications">
      <md-table v-model="copyrightApplications" md-sort="id" md-sort-order="asc">
        <md-table-row slot-scope="{ item }" slot="md-table-row">
          <md-table-cell md-label="Primary Title" md-sort-by="primary_title">{{item.primary_title}}</md-table-cell>
          <md-table-cell md-label="Created On" md-sort-by="created_on">{{item.created_on}}</md-table-cell>
          <md-table-cell md-label="Created By">{{item['created_by.username']}}</md-table-cell>
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
    copyrightApplications: null,
    isUserLoggedIn: false
  }),
  async created () {
    this.copyrightApplications = await this.repository._getCopyrightApplications()
    if (this.copyrightApplications != null) {
      this.isUserLoggedIn = true
    }
  },
  methods: {
    login () {
      window.location = 'http://localhost:5000/login'
    },
    logout () {
      window.location = 'http://localhost:5000/logout'
    }
  }
}
</script>
