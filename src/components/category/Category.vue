<template>
  <div>
    <md-card md-with-hover>
      <md-card-header>
        <div class="md-title">{{ label }}</div>
      </md-card-header>

      <md-card-content>
        Lorem ipsum
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'Category',
  props: {
    id: Number,
    label: String,
  },
};
</script>

<style>
.md-card {
  margin-bottom: 8px;
  margin-top: 8px;
}
</style>
