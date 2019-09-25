<template>
  <div class="title-wrapper">
    <img class="navbar-logo" src="../../assets/logo.png" alt="Porygon logo">
    <span class="md-title navbar-title">{{ title }}</span>
  </div>
</template>

<script>
export default {

  name: 'ToolbarTitle',
  props: {
    title: String,
  },
};
</script>

<style scoped lang="scss">
.navbar-logo {
  height: 32px;
}

.title-wrapper {
  display: flex;
}

.navbar-title {
  vertical-align: middle !important;
}
</style>
