<template>
  <div class="full-size">
    <div class="md-layout full-size">
      <div class="md-layout-item md-size-20 col-20">
        <span v-if="category.label === null" class="md-caption">
          {{ $ml.get('category').undefined }}
        </span>
        <span v-else>
          {{ category.label }}
        </span>
      </div>
      <div class="md-layout-item md-size-60 col-60">
        {{ serie.title }}
      </div>
      <div class="md-layout-item md-size-20 col-20">
        {{ location.location }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Serie',
  props: {
    serie: Object,
    location: Object,
    category: Object,
  },
};
</script>

<style scoped lang="scss">
.full-size {
  width: 100%;
}
.col-20 {
  width: 20%;
}
.col-60 {
  width: 60%;
}
.md-layout-item {
  margin: auto;
}
</style>
