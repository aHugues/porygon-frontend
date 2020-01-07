<template>
  <md-empty-state
    :md-icon="resourceIcon"
    :md-label="$ml.get('error').reload_button"
    :md-description="$ml.get('error').errored_description">

    <md-button @click="reloadPage()" class="md-primary md-raised">
      {{ $ml.get('error').reload_button }}
    </md-button>

  </md-empty-state>
</template>

<script>
export default {
  name: 'ErrorState',
  props: {
    resource: String,
  },
  computed: {
    resourceIcon() {
      const iconsMapping = {
        category: 'category',
        location: 'folder',
        movie: 'movie',
        serie: 'tv',
        home: 'home',
      };
      return iconsMapping[this.resource];
    },
  },
  methods: {
    reloadPage() {
      this.$emit('reload-page');
    },
  },
};
</script>
