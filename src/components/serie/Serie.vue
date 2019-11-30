<template>
  <div class="full-size">
    <div class="md-layout full-size">
      <div class="md-layout-item md-xlarge-size-20 md-large-size-30 md-medium-size-70">
        <span v-if="category.label === null" class="md-caption">
          {{ $ml.get('category').undefined }}
        </span>
        <span v-else>
          {{ category.label }}
        </span>
      </div>
      <div v-if="width < 1280" class="md-layout-item md-xlarge-size-20 md-medium-size-30">
        {{ location.location }}
      </div>
      <div class="md-layout-item md-xlarge-size-60 md-large-size-50
                  md-medium-size-100 series-title-wrapper">
        {{ serie.title }}
      </div>
      <div v-if="width >= 1280" class="md-layout-item md-xlarge-size-20 md-medium-size-30">
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
  data() {
    return {
      width: 0,
    };
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.width = window.innerWidth;
    },
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

@media only screen and (max-width: 1279px) {
  .series-title-wrapper {
    padding-top: 10px;
  }
}

</style>
