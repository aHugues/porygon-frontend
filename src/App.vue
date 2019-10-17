<template>
  <div id="app">
    <md-app md-waterfall md-mode="fixed">
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
  </div>
</template>

<script>
import ToolbarTitle from '@/components/toolbar/ToolbarTitle.vue';
import ToolbarAvatar from '@/components/toolbar/ToolbarAvatar.vue';

export default {
  data() {
    return {
      showNavigation: false,
      pageWidth: window.innerWidth,
    };
  },
  mounted() {
    window.onresize = () => {
      this.pageWidth = window.innerWidth;
    };
  },
  created() {
    let currentTheme = localStorage.getItem('vue-user-theme');
    if (currentTheme === null || currentTheme === undefined) {
      currentTheme = 'porygon-light';
      localStorage.setItem('vue-user-theme', 'porygon-light');
    }
    this.$material.theming.theme = currentTheme;
  },
  name: 'app',
  components: {
    ToolbarTitle,
    ToolbarAvatar,
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
</style>
