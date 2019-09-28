<template>
  <div>
    <md-card md-with-hover :class="selectedClass">
      <md-card-header>
        <div class="md-title">{{ label }}</div>
      </md-card-header>

      <md-card-content>
        {{ description }}
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
    description: String,
    selected: Boolean,
  },
  computed: {
    selectedClass() {
      const currentTheme = localStorage.getItem('vue-user-theme');
      if (this.selected) {
        return (currentTheme === 'porygon-light') ? 'selected-light' : 'selected-dark';
      }
      return '';
    },
  },
};
</script>

<style>
.md-card {
  margin-bottom: 8px;
  margin-top: 8px;
}

.selected-light {
  background-color: #DFD4D7 !important;
}

.selected-dark {
  background-color: #645F60 !important;
}
</style>
