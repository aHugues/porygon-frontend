<template>
  <div id="app">
    <md-app md-waterfall md-mode="fixed" v-if="this.$route.name !== 'login'">
      <md-app-toolbar class="md-primary toolbar-wrapper">
        <md-button v-if="pageWidth<600"
        class="md-icon-button" @click="showNavigation = true">
          <md-icon>menu</md-icon>
        </md-button>
        <toolbar-title title="Porygon"></toolbar-title>
        <div class="separator-2"></div>
        <toolbar-avatar></toolbar-avatar>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full" :md-active.sync="showNavigation" md-swipeable>
        <md-toolbar class="md-transparent" md-elevation="0">
          <h3 class="md-title">{{ $ml.get('navigation').title }}</h3>
        </md-toolbar>

        <md-list>
          <md-list-item to="/" exact>
                <md-icon>home</md-icon>
                <span class="md-list-item-text">{{ $ml.get('navigation').home }}</span>
          </md-list-item>

          <md-list-item to="/movies">
              <md-icon>movie</md-icon>
              <span class="md-list-item-text">{{ $ml.get('navigation').movies }}</span>
          </md-list-item>

          <md-list-item to="/series">
              <md-icon>tv</md-icon>
              <span class="md-list-item-text">{{ $ml.get('navigation').series }}</span>
          </md-list-item>

          <md-list-item to="/locations">
              <md-icon>folder</md-icon>
              <span class="md-list-item-text">{{ $ml.get('navigation').locations }}</span>
          </md-list-item>

          <md-list-item to="/categories">
              <md-icon>category</md-icon>
              <span class="md-list-item-text">{{ $ml.get('navigation').categories }}</span>
          </md-list-item>

        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view/>
      </md-app-content>

    </md-app>

    <div v-if="this.$route.name === 'login'">
      <router-view/>
    </div>

    <md-snackbar :md-active.sync="authError">
      <span>{{ $ml.get('error').auth }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import axios from 'axios';
import ToolbarTitle from '@/components/toolbar/ToolbarTitle.vue';
import ToolbarAvatar from '@/components/toolbar/ToolbarAvatar.vue';
import config from './config';

export default {
  data() {
    return {
      showNavigation: false,
      pageWidth: window.innerWidth,
      environment: process.env.NODE_ENV,
      authError: false,
    };
  },
  mounted() {
    window.onresize = () => {
      this.pageWidth = window.innerWidth;
    };
    if (this.$route.name !== 'login') {
      this.checkLogin();
    }
  },
  created() {
    let currentTheme = localStorage.getItem('vue-user-theme');
    if (currentTheme === null || currentTheme === undefined) {
      currentTheme = 'porygon-light';
      localStorage.setItem('vue-user-theme', 'porygon-light');
    }
    this.$material.theming.theme = currentTheme;
    const currentLanguage = localStorage.getItem('vue-user-language');
    if (currentLanguage !== null && currentLanguage !== undefined) {
      this.$ml.change(currentLanguage);
    }
  },
  name: 'app',
  computed: {
    authBaseUrl() { return config[this.environment].authBaseUrl; },
    authenticationRequired() { return config[this.environment].porygonApiAuthentication; },
  },
  components: {
    ToolbarTitle,
    ToolbarAvatar,
  },
  methods: {
    buildHeaders() {
      const headers = { 'Content-Type': 'application/json' };
      if (this.authenticationRequired) {
        // headers.Authorization = `Bearer ${localStorage.getItem('vue-token')}`;
      }
      return headers;
    },
    checkLogin() {
      axios
        .get(`${this.authBaseUrl}/login`, {
          headers: this.buildHeaders(),
          withCredentials: true,
        })
        .then(() => {
          this.authError = false;
        })
        .catch((error) => {
          if (error.message.includes('401') || error.message.includes('403')) {
            this.$router.push('login');
          }
        });
    },
  },
};
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine";
@import url("https://unpkg.com/vue-material@beta/dist/theme/default.css");

@include md-register-theme("porygon-light", (
  primary: #C6525A,
  accent: #57AFBA,
));

@include md-register-theme("porygon-dark", (
  primary: #C6525A,
  accent: #57AFBA,
  theme: dark,
));

@import "~vue-material/dist/theme/all";

.toolbar-wrapper {
  display: flex;
}

.separator-2 {
  flex: 2;
}

.md-app {
  height: 100vh;
}

.md-drawer {
  max-width: 300px !important;
}

.md-menu-content-container {
  overflow: hidden !important;
  max-width: 224px;
}
</style>
