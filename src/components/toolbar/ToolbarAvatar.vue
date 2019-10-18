<template>
  <div class="avatar-wrapper">
    <md-menu md-align-trigger :md-close-on-select=false md-size="auto">

      <md-button md-menu-trigger class="md-icon-button">
        <md-avatar class="md-avatar-icon md-accent">
          {{ userInitials }}
        </md-avatar>
      </md-button>

      <md-menu-content>
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
          <md-switch v-model="darkTheme">{{ $ml.get('menu').dark_theme }}</md-switch>
        </md-menu-item>

        <md-menu-item>
          <md-list md-expand-single>
            <md-list-item md-expand :md-expanded.sync="expandLanguages"
            @click.stop class="language-selector">
              <md-icon>language</md-icon>
              <span class="md-list-item-text">{{ $ml.get('menu').languages }}</span>

              <md-list slot="md-expand">
                <md-list-item v-for="lang in $ml.list" :key="lang" @click="updateLanguage(lang)">
                  <span>
                    <span class="lang-flag">{{ emojis[lang] }}</span>
                    <span class="lang-name">{{ lang }}</span>
                  </span>
                </md-list-item>
              </md-list>
            </md-list-item>
          </md-list>
        </md-menu-item>

        <md-menu-item>
          <md-button target="_blank" :href="userAccountUrl">
            <div class="logout-button-content">
              <md-icon>account_box</md-icon>
              <div>{{ $ml.get('menu').account }}</div>
            </div>
          </md-button>
        </md-menu-item>

        <md-menu-item>
          <md-button @click="logout">
            <div class="logout-button-content">
              <md-icon>logout</md-icon>
              <div>{{ $ml.get('menu').logout }}</div>
            </div>
          </md-button>
        </md-menu-item>

      </md-menu-content>
    </md-menu>

  </div>
</template>

<script>
import emojis from '../../emoji';

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
  },
  data: () => ({
    darkTheme: undefined,
    language: 'en',
    showSnackbar: false,
    expandLanguages: false,
    emojis,
  }),
  methods: {
    logout() {
      this.$keycloak.logout('/');
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
  width: 120px;
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
