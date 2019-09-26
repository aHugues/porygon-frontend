<template>
  <div id="app">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary toolbar-wrapper">
        <toolbar-title title="Porygon"></toolbar-title>
        <div class="separator-2"></div>
        <toolbar-avatar></toolbar-avatar>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          <h3 class="md-title">Navigation</h3>
        </md-toolbar>

        <md-list>
          <md-list-item to="/" exact>
                <md-icon>home</md-icon>
                <span class="md-list-item-text">Home</span>
          </md-list-item>

          <md-list-item to="/movies">
              <md-icon>movie</md-icon>
              <span class="md-list-item-text">Movies</span>
          </md-list-item>

          <md-list-item to="/series">
              <md-icon>tv</md-icon>
              <span class="md-list-item-text">Series</span>
          </md-list-item>

          <md-list-item to="/locations">
              <md-icon>folder</md-icon>
              <span class="md-list-item-text">Locations</span>
          </md-list-item>

          <md-list-item to="/categories">
              <md-icon>category</md-icon>
              <span class="md-list-item-text">Categories</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import ToolbarTitle from '@/components/toolbar/ToolbarTitle.vue';
import ToolbarAvatar from '@/components/toolbar/ToolbarAvatar.vue';

export default {
  name: 'app',
  components: {
    ToolbarTitle,
    ToolbarAvatar,
  },
};
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine";

@include md-register-theme("default", (
  primary: #C6525A,
  accent: #57AFBA
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
</style>
