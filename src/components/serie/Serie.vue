<template>
  <div class="full-size">
    <div class="md-layout full-size">
      <div class="md-layout-item md-xlarge-size-20 md-large-size-30 md-medium-size-70">
        <span v-if="categories.length === 0" class="md-caption">
          {{ $ml.get('category').undefined }}
        </span>
        <span v-else>
          {{ categories.map(category => category.label).join(', ') }}
        </span>
      </div>
      <div v-if="width < 1280" class="md-layout-item md-xlarge-size-20 md-medium-size-30">
        {{ location.location }}
      </div>
      <div class="md-layout-item md-xlarge-size-50 md-large-size-40
                  md-medium-size-80 series-title-wrapper">
        {{ serie.title }}
      </div>
      <div class="md-layout-item md-xlarge-size-10 md-large-size-10
                  md-medium-size-20 series-title-wrapper">
        {{ $ml.get('serie').season }} {{ serie.season }}
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
    categories: Array,
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
