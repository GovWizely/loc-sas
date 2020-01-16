<template>
  <div id="app">
    <md-toolbar class="md-primary" md-elevation="1">
      |
      <h1 class="md-title" style="flex: 1">Demo</h1>
      <div v-if="currentUserInfo.loggedIn">
        <div id="nav">
          <md-tabs md-sync-route class="md-primary">
            <md-tab id="tab-home" md-label="Home" to="/" exact></md-tab>
          </md-tabs>
        </div>
      </div>
      <md-button v-if="!currentUserInfo.loggedIn" @click="login()">Login</md-button>
      <md-menu v-else>
        <md-button class="md-icon-button" md-menu-trigger>
          <initials-avatar :initials="this.currentUserInfo.first_name[0] + this.currentUserInfo.last_name[0]" />
        </md-button>
        <md-menu-content>
          <md-menu-item>
             <md-button @click="logout()">Logout</md-button>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
    </md-toolbar>
    <div v-if="currentUserInfo.loggedIn">
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

@include md-register-theme("default", (
  primary: md-get-palette-color(blue, 900),
  accent: md-get-palette-color(blue, 700)
));

@import "~vue-material/dist/theme/all";

.logo {
  margin: 0 10px 0 0;
}

#app .md-toolbar {
  min-height: 0;
}

#app .md-title {
  font-weight: bold;
}

#nav .md-button-content {
  font-weight: bold;
}

#nav {
  margin: 0 40px 0 0;
}

.header {
  margin-left: 25px;
}

.title {
  flex: 1;
}

.header-row-1 {
  display: flex;
}

.header-row-2 {
  display: flex;
}

.current-route {
  margin: 15px;
}

.please-log-in {
  display: flex;
  justify-content: center;
  margin-top: 124px;
}

.md-theme-default .md-button {
  text-transform: none;
  font-weight: bold;
}

.secondary-button {
  background: white;
  display: inline-block;
  width: 144px;
  height: 40px;
  border-radius: 3px;
  border: solid 3px #4476c1;
  color: #4476c1;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  cursor: pointer;
}

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
    let currentUserInfo = await this.repository._getCurrentUserInfo()

    if (currentUserInfo.loggedIn === false) {
      this.message = 'Please log in.'
    } else if (currentUserInfo.loggedIn === true) {
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
    }
  }
}
</script>
