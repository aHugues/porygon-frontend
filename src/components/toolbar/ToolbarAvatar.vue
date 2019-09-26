<template>
  <div class="avatar-wrapper">
    <md-menu md-align-trigger :md-close-on-select=false md-size="auto">

      <md-button md-menu-trigger class="md-icon-button">
        <md-avatar class="md-avatar-icon md-accent">
          {{ firstNameInitial }}{{ lastNameInitial }}
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
          <md-button to="/logout" @click="showSnackbar = true" disabled>
            <div class="logout-button-content">
              <md-icon>logout</md-icon>
              <div>Logout</div>
            </div>
          </md-button>
        </md-menu-item>
      </md-menu-content>
    </md-menu>

    <md-snackbar :md-active.sync="showSnackbar" :md-duration="2000">
      Logout will soon be implemented.
    </md-snackbar>
  </div>
</template>

<script>
export default {
  name: 'ToolbarAvatar',
  computed: {
    firstNameInitial() { return localStorage.getItem('vue-user-firstname')[0]; },
    lastNameInitial() { return localStorage.getItem('vue-user-lastname')[0]; },
  },
  data: () => ({
    darkTheme: false,
    language: 'en',
    showSnackbar: false,
  }),
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
