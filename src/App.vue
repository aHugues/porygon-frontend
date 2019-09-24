<template>
  <div id="app">
    <md-app>
      <md-app-toolbar class="md-primary">
        <toolbar-title title="Porygon"></toolbar-title>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar>
      </md-app-drawer>

      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import ToolbarTitle from '@/components/toolbar/ToolbarTitle.vue';

export default {
  name: 'app',
  components: {
    ToolbarTitle,
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
</style>
