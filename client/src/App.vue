<template>
  <div id="app">
    <md-toolbar class="md-primary" md-elevation="1">
      <img class="logo" src="./assets/copyrightLogo.png" /> |
      <h1 class="md-title" style="flex: 1">Registration System</h1>
      <div v-if="currentUserInfo">
        <div id="nav">
          <md-tabs md-sync-route class="md-primary">
            <md-tab id="tab-home" md-label="Home" to="/" exact></md-tab>
          </md-tabs>
        </div>
      </div>
      <md-button v-if="!currentUserInfo" @click="login()">Login</md-button>
      <md-menu v-else>
        <md-button class="md-icon-button" md-menu-trigger>
          <md-icon>menu</md-icon>
        </md-button>
        <md-menu-content>
          <md-menu-item>
             <md-button @click="logout()">Logout</md-button>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
    </md-toolbar>
    <div v-if="currentUserInfo">
      <div class="current-route md-caption">
        {{this.$route.name}} /
      </div>
      <router-view />
    </div>
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
    currentUserInfo: false
  }),
  async created () {
    const repository = new Repository()
    this.currentUserInfo = await repository._userIsAuthenticated()
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
