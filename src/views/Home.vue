<template>
  <div class="home">
    <md-empty-state
    md-icon="home"
    :md-label="$ml.get('home').title"
    :md-description="$ml.get('home').subtitle">
   </md-empty-state>
  </div>
</template>

<script>
export default {
  name: 'home',
};
</script>
