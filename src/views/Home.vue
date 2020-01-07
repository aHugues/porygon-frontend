<template>
  <div class="home">
     <empty-page
      resource="home" :action="false">
    </empty-page>
  </div>
</template>

<script>

import EmptyPage from '@/components/misc/EmptyPage.vue';

export default {
  name: 'home',
  components: {
    EmptyPage,
  },
};
</script>
