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
          <md-switch v-model="darkTheme">Dark Theme</md-switch>
        </md-menu-item>

        <!-- <md-menu-item>
          <md-field>
            <label for="language">Language</label>
            <md-select v-model="language" name="language" id="language">
              <md-option value="fr">French</md-option>
              <md-option value="en">English</md-option>
            </md-select>
          </md-field>
        </md-menu-item> -->

        <md-menu-item>
          <md-button target="_blank" :href="userAccountUrl">
            <div class="logout-button-content">
              <md-icon>account_box</md-icon>
              <div>Account</div>
            </div>
          </md-button>
        </md-menu-item>

        <md-menu-item>
          <md-button @click="logout">
            <div class="logout-button-content">
              <md-icon>logout</md-icon>
              <div>Logout</div>
            </div>
          </md-button>
        </md-menu-item>

      </md-menu-content>
    </md-menu>

  </div>
</template>

<script>
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
      if(firstname) {
        const firstnameArray = firstname.split('-')
        initials += firstnameArray[0][0];
        if (firstnameArray[1]) {
          initials += firstnameArray[1][0];
        }
      } else {
        initials = '-'
      }
      return initials;
    },
    userAccountUrl() { return localStorage.getItem('vue-user-url'); },
  },
  data: () => ({
    darkTheme: undefined,
    language: 'en',
    showSnackbar: false,
  }),
  methods: {
    logout() {
      this.$keycloak.logout('/');
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
</style>
