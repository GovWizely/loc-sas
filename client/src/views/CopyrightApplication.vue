<template>
  <json-viewer v-if="copyrightApplication" :value="copyrightApplication"></json-viewer>
</template>
<script>
export default {
  props: ['repository'],
  data: () => {
    return {
      copyrightApplication: null
    }
  },
  async created () {
    this.copyrightApplication = await this.repository._getCopyrightApplication(this.$route.query['id'])
  }
}
</script>
