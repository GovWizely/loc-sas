<template>
  <div>
    <json-viewer v-if="copyrightApplication" :value="copyrightApplication"></json-viewer>
    <md-dialog-alert class="error" :md-active.sync="errorOccured" md-title="Error Occured!" :md-content="errorMessage" />
  </div>
</template>
<script>
export default {
  props: ['repository'],
  data: () => ({
    copyrightApplication: null,
    errorOccured: false,
    errorMessage: null
  }),
  async created () {
    let response = await this.repository._getCopyrightApplication(this.$route.query['id'])
    if (response.error) {
      this.errorOccured = true
      this.errorMessage = response.error
    } else {
      this.copyrightApplication = response
    }
  }
}
</script>
