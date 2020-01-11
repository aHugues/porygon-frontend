<template>
  <div class="home">
    <div class="check-card">
      <version-check></version-check>
    </div>
  </div>
</template>

<script>

import VersionCheck from '@/components/misc/VersionCheck.vue';

export default {
  name: 'home',
  components: {
    VersionCheck,
  },
};
</script>

<style lang="scss" scoped>

  .check-card {
    width: 40%;
  }

</style>
