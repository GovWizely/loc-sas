<template>
  <div id="app">
    <md-toolbar class="md-primary" md-elevation="1">
      <div class="title-container">
        <!-- TODO: Conditional rendering for demo; need to remove for Prod deployment -->
        <img id="logo" height="20px" src="./assets/copyrightLogo.png" v-if="currentUserInfo.loggedIn"/>
        <h1 class="md-title" v-if="currentUserInfo.loggedIn">| U.S. Copyright Office Registration System</h1>
      </div>
      <div v-if="currentUserInfo.loggedIn">
        <div id="nav">
          <router-link to="/">
            <button :class="getClasses('Home')">Home</button>
          </router-link>
           <router-link to="/account">
            <button :class="getClasses('Account')">Account</button>
          </router-link>
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
@import "@/style/copyright-palette.scss";
@include md-register-theme("default", (
  primary: get-copyright-color('dark-blue'),
  accent: get-copyright-color('light-blue')
));
@import "~vue-material/dist/theme/all";
@import "@/style/material-overrides.scss";

.title-container {
  display: flex;
  flex: 1;
  height: 60px;
  padding-top: 15px;
}

#logo {
  height: 28px;
}

.nav-btn {
  text-decoration: none;
  height: 60px;
  border: none;
  background-color: get-copyright-color('dark-blue');
  font-size: 16px;
  font-weight: bold;
  color: white;
  padding: 8px 20px 0 20px;
  border-bottom: get-copyright-color('dark-blue') 5px solid;
  cursor: pointer;
}

.nav-btn.active {
  border-bottom: white 5px solid;
}

.nav-btn:hover {
  background-color: get-copyright-color('light-blue');
  border-bottom: get-copyright-color('lighter-blue') 5px solid;
}

#nav {
  margin: 0 40px 0 0;
}

.header {
  margin-left: 25px;
  padding-right: 24px;
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

.secondary-button {
  background: white;
  display: inline-block;
  padding: 0 20px 0 20px;
  height: 40px;
  border-radius: 3px;
  border: solid 3px get-copyright-color('light-blue');
  color: get-copyright-color('light-blue');
  font-size: 16px;
  font-weight: bold;
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
    },
    getClasses (route) {
      return (this.$route.name === route) ? 'nav-btn active' : 'nav-btn'
    }
  }
}
</script>
