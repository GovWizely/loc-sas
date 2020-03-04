<template>
  <div id="app">
    <md-toolbar class="md-primary" md-elevation="1">
      <div class="title-container">
        <img id="logo" height="20px" src="./assets/copyrightLogo.png"/>
        <h1 class="md-title">| U.S. Copyright Office Registration System</h1>
      </div>
      <div v-if="currentUserInfo">
        <div id="nav">
          <router-link to="/">
            <button :class="getClasses('Home')">Home</button>
          </router-link>
           <router-link to="/account">
            <button :class="getClasses('Account')">Account</button>
          </router-link>
        </div>
      </div>
      <md-button v-if="!currentUserInfo" @click="login()">Login</md-button>
      <md-menu v-else>
        <md-button class="md-icon-button" md-menu-trigger v-if="currentUserInfo.firstName && currentUserInfo.lastName">
          <initials-avatar :initials="this.currentUserInfo.firstName[0] + this.currentUserInfo.lastName[0]" />
        </md-button>
      </md-menu>
    </md-toolbar>
    <div v-if="currentUserInfo">
      <div class="current-route md-caption">
        {{this.$route.name}} |
      </div>
      <router-view />
    </div>
    <div class="please-log-in md-title">
      <span id="message" name="message">{{message}}</span>
    </div>
    <md-dialog-alert
      class="error"
      id="error"
      name="error"
      :md-active.sync="errorOccured"
      md-title="Error Occured!"
      :md-content="errorMessage" />
  </div>
</template>
<style lang="scss">
@import "~vue-material/dist/theme/engine";
@import "@/style/copyright-palette.scss";
@include md-register-theme("default", (
  primary: get-copyright-color('dark-blue'),
  accent: get-copyright-color('light-blue')
));
@import "~vue-material/dist/theme/all";
@import "@/style/variables.scss";
@import "@/style/material-overrides.scss";
@import "@/style/general.scss";
</style>

<script>
import InitialsAvatar from '@/views/InitialsAvatar'

export default {
  components: {
    'initials-avatar': InitialsAvatar
  },
  props: ['repository'],
  data: () => ({
    currentUserInfo: false,
    message: null,
    errorOccured: false,
    errorMessage: null
  }),
  async created () {
    let accessToken = await this.repository._getAccessToken()
    let currentUserInfo = await this.repository._getCurrentUserInfo(accessToken)
    if (!currentUserInfo) {
      this.message = 'Please log in.'
    } else if (!currentUserInfo.error) {
      this.currentUserInfo = currentUserInfo
    } else if (currentUserInfo.error) {
      this.errorOccured = true
      this.errorMessage = currentUserInfo.error
    }
  },
  methods: {
    logout () {
      window.location = '/logout'
    },
    login () {
      window.location = '/login'
    },
    getClasses (route) {
      return (this.$route.name === route) ? 'nav-btn active' : 'nav-btn'
    }
  }
}
</script>
