<template>
  <md-empty-state
    :md-icon="resourceIcon"
    :md-label="$ml.get(resource).empty_title"
    :md-description="$ml.get(resource).empty_description">

    <md-button
      v-if="action"
      @click="createResource()" class="md-primary md-raised">
        {{ $ml.get(resource).empty_title }}
    </md-button>

  </md-empty-state>
</template>

<script>
export default {
  name: 'EmptyPage',
  props: {
    resource: String,
    action: Boolean,
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
    createResource() {
      this.$emit('resource-created');
    },
  },
};
</script>
