<template>
  <div>
    {{ movie.title }}
  </div>
</template>

<script>
export default {
  name: 'Movie',
  props: {
    movie: Object,
    location: Object,
    category: Object,
  },
};
</script>

<style>
</style>
