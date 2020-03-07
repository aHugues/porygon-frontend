<template>
  <md-card>
    <md-card-header>
      <div class="md-title">
        {{ $ml.get('navigation')[resourceName] }}
      </div>
    </md-card-header>
    <md-card-content>
      <div class="md-display-3 stat-value">
        {{ resourceValue }}
      </div>
    </md-card-content>
  </md-card>
</template>

<script>

export default {
  name: 'ElementStat',
  props: {
    resourceName: String,
    resourceValue: Number,
  },
};
</script>

<style lang="scss" scoped>
.stat-value {
  padding-right: 30px;
  text-align: right;
}
</style>
