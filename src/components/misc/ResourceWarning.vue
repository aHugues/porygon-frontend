<template>
  <div class="md-layout-item md-size-50">
    <md-card class="container">
      <md-card-content>
        <md-icon>warning</md-icon>
        {{ message }}
      </md-card-content>
      <md-card-actions md-alignment="left">
        <md-button :to="resourceLink">{{ buttonLabel }}</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'ResourceWarning',
  props: {
    resource: {
      type: String,
      required: true,
      validator: value => ['category', 'location'].indexOf(value) !== -1,
    },
  },
  computed: {
    message() {
      return this.$ml.get('error')[`empty_${this.resource}`];
    },
    buttonLabel() {
      return this.$ml.get(this.resource).create;
    },
    resourceLink() {
      return {
        category: '/categories',
        location: '/locations',
      }[this.resource];
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: rgba(255,160,0 ,0.5);
  box-sizing: border-box;
}
</style>>
