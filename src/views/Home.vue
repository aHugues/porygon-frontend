<template>
  <div class="home">
    <div class="check-card">
      <api-check></api-check>
    </div>
  </div>
</template>

<script>

import ApiCheck from '@/components/misc/ApiCheck.vue';

export default {
  name: 'home',
  components: {
    ApiCheck,
  },
};
</script>

<style lang="scss" scoped>

  .check-card {
    width: 40%;
  }

</style>
