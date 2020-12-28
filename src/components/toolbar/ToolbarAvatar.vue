<template>
  <div class="avatar-wrapper">
    <md-menu md-align-trigger :MdCloseOnClick="false" :MdCloseOnSelect="false"
    :md-active="menuOpened" md-size="big">

      <md-button md-menu-trigger class="md-icon-button">
        <md-avatar class="md-avatar-icon md-accent">
          {{ userInitials }}
        </md-avatar>
      </md-button>

      <md-menu-content>
        <div class="menu-content-wrapper">
          <!-- <transition name="slide-right"> -->
            <div class="menu-page" :class="{ 'slide-left': selectedTab !== 1 }">
              <md-menu-item>
                <div class="version-wrapper">
                  <div class="version-number md-body-2">Porygon v{{ porygonVersion }}</div>
                  <div class="dev-version md-caption">({{ $ml.get('menu').dev_version }})</div>
                </div>
              </md-menu-item>

              <div class="divider-container">
                <md-divider></md-divider>
              </div>

              <md-menu-item>
                <md-button @click.stop="selectedTab = 2">
                  <div class="logout-button-content">
                    <md-icon>color_lens</md-icon>
                    <div>{{ $ml.get('menu').theme }}</div>
                    <md-icon>arrow_right</md-icon>
                  </div>
                </md-button>
              </md-menu-item>

              <md-menu-item>
                <md-button @click.stop="selectedTab = 3">
                  <div class="logout-button-content">
                    <md-icon>language</md-icon>
                    <div>{{ $ml.get('menu').languages }}</div>
                    <md-icon>arrow_right</md-icon>
                  </div>
                </md-button>
              </md-menu-item>

              <md-menu-item>
                <md-button target="_blank" :href="userAccountUrl">
                  <div class="logout-button-content">
                    <md-icon>account_box</md-icon>
                    <div>{{ $ml.get('menu').account }}</div>
                    <md-icon></md-icon>
                  </div>
                </md-button>
              </md-menu-item>

              <md-menu-item>
                <md-button @click="logout">
                  <div class="logout-button-content">
                    <md-icon>logout</md-icon>
                    <div>{{ $ml.get('menu').logout }}</div>
                    <md-icon></md-icon>
                  </div>
                </md-button>
              </md-menu-item>
            </div>
          <!-- </transition> -->

            <div class="menu-page" :class="{ 'slide-left': selectedTab !== 1 }">

              <div v-if="selectedTab == 2">
                <md-menu-item>
                  <md-button @click.stop="selectedTab=1">
                    <div class="logout-button-content">
                      <md-icon>chevron_left</md-icon>
                      <div>{{ $ml.get('menu').theme_selection }}</div>
                    </div>
                  </md-button>
                </md-menu-item>

                <div class="divider-container">
                  <md-divider></md-divider>
                </div>

                <md-menu-item>
                  <md-button @click.stop="darkTheme = false">
                    <div class="logout-button-content">
                      <md-icon>brightness_5</md-icon>
                      <span>{{ $ml.get('menu').light_theme }}</span>
                      <span class="lang-flag"></span>
                    </div>
                  </md-button>
                </md-menu-item>

                <md-menu-item>
                  <md-button @click.stop="darkTheme = true">
                    <div class="logout-button-content">
                      <md-icon>brightness_6</md-icon>
                      <span>{{ $ml.get('menu').dark_theme }}</span>
                      <span class="lang-flag"></span>
                    </div>
                  </md-button>
                </md-menu-item>
              </div>

              <div v-if="selectedTab == 3">
                <md-menu-item>
                  <md-button  @click.stop="selectedTab=1">
                    <div class="logout-button-content">
                      <md-icon>chevron_left</md-icon>
                      <div>{{ $ml.get('menu').language_selection }}</div>
                    </div>
                  </md-button>
                </md-menu-item>

                <div class="divider-container">
                  <md-divider></md-divider>
                </div>

                <md-menu-item v-for="lang in $ml.list" :key="lang">
                  <md-button @click.stop="updateLanguage(lang)">
                    <div class="logout-button-content">
                      <span class="lang-flag"><img :src="`/img/flags/${flags[lang]}.png`"/></span>
                      <span class="lang-name">{{ lang }}</span>
                      <span class="lang-flag"></span>
                    </div>
                  </md-button>
                </md-menu-item>
              </div>
            </div>
        </div>

      </md-menu-content>
    </md-menu>

  </div>
</template>

<script>
import axios from 'axios';
import flags from '../../flags';
import requests from '../../utils/requests';
import config from '../../config';

export default {
  name: 'ToolbarAvatar',
  created() {
    const currentTheme = localStorage.getItem('vue-user-theme');
    this.darkTheme = currentTheme === 'porygon-dark';
  },
  updated() {
    const selectedTheme = (this.darkTheme) ? 'porygon-dark' : 'porygon-light';
    this.$material.theming.theme = selectedTheme;
  },
  watch: {
    darkTheme(newTheme) {
      const selectedTheme = (newTheme) ? 'porygon-dark' : 'porygon-light';
      localStorage.setItem('vue-user-theme', selectedTheme);
      this.$material.theming.theme = selectedTheme;
    },
  },
  computed: {
    userInitials() {
      const firstname = localStorage.getItem('vue-user-firstname');
      let initials = '';
      if (firstname) {
        const firstnameArray = firstname.split('-');
        initials += firstnameArray[0][0];
        if (firstnameArray[1]) {
          initials += firstnameArray[1][0];
        }
      } else {
        initials = '-';
      }
      return initials;
    },
    userAccountUrl() { return localStorage.getItem('vue-user-url'); },
    porygonVersion() { return process.env.PACKAGE_VERSION || '0'; },
    environment() { return process.env.NODE_ENV; },
    authBaseUrl() { return config[this.environment].authBaseUrl; },
  },
  data: () => ({
    darkTheme: undefined,
    language: 'en',
    showSnackbar: false,
    expandLanguages: false,
    flags,
    selectedTab: 1,
    menuOpened: false,
  }),
  methods: {
    logout() {
      const options = requests.buildOptions();

      axios({
        method: 'get',
        url: `${this.authBaseUrl}/logout`,
        headers: options.headers,
        withCredentials: options.withCredentials,
      })
        .then(() => {
          this.$router.go('/');
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateLanguage(newLanguage) {
      localStorage.setItem('vue-user-language', newLanguage);
      this.$ml.change(newLanguage);
    },
  },
};
</script>

<style scoped lang="scss">
.md-switch {
  display: flex;
}
.logout-button-content {
  width: 190px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    vertical-align: middle;
  }
}
.md-button {
  margin: 0;
}

.divider-container {
  width: 80%;
  margin: auto;
}

.version-wrapper {
  text-align: center;
  width: 100%;
}

.version-number {
  width: 100%;
  text-align: center;
}

.dev-version {
  width: 100%;
}

.lang-flag {
  padding-left: 5px;
  padding-right: 15px;

  img {
    padding-bottom: 3px;
  }
}

// .slide-left-enter-active, .slide-left-leave-active,
// .slide-right-leave-active, .slide-right-enter-active, .menu-page {
//   transition: all 5s ease;
//   overflow: hidden;
// }

.slide-left {
  transform: translateX(-100%);
}

.slide-right {
  transform: translateX(100%);
}

// .slide-left-enter, .slide-left-leave-to {
//   transform: translateX(300px);
//   overflow: hidden;
// }

// .slide-right-leave-to, .slide-right-enter {
//   transform: translateX(-300px);
//   overflow: hidden;
// }

.menu-content-wrapper {
  overflow: hidden;
  display: flex;
  flex-direction: row;
  width: 200%;
}

.menu-page {
  flex: 1;
  overflow: hidden;
  width: 100%;
  transition: all 0.3s ease;
}
// .language-selector {
//   background-color: yellow;
//   div {
//     background-color: red;
//     padding-left: -16px;
//     div:first-child {
//       background-color: pink;
//     }
//   }
// }
</style>
