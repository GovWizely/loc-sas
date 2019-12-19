<template>
  <div id="app">
    <md-toolbar class="md-primary" md-elevation="1">
      <img class="logo" src="./assets/copyrightLogo.png" /> |
      <h1 class="md-title" style="flex: 1">Registration System</h1>
      <div v-if="userIsAuthenticated">
        <div id="nav">
          <md-tabs md-sync-route class="md-primary">
            <md-tab id="tab-home" md-label="Home" to="/" exact></md-tab>
          </md-tabs>
        </div>
      </div>
      <md-button v-if="!userIsAuthenticated" @click="login()">Login</md-button>
      <md-button v-else @click="logout()">Logout</md-button>
    </md-toolbar>
    <div class="current-route md-caption">
      {{this.$route.name}} /
    </div>
    <router-view />
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

.nav {
  margin: 0 20px 0 0;
}

.header {
  display: flex;
}

.header-title {
  margin-left: 25px;
}

.current-route {
  margin: 15px;
}
</style>

<script>
import Repository from './repositories/Repository'

export default {
  data: () => ({
    userIsAuthenticated: false
  }),
  async created () {
    const repository = new Repository()
    this.userIsAuthenticated = await repository._userIsAuthenticated()
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
