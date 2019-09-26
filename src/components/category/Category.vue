<template>
  <div>
    id: {{ id }}
    label: {{ label }}
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

</style>