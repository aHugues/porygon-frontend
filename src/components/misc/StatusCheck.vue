<template>
  <div>
    <span class="status-icon">
      <md-icon :class="getClass()">{{ getIconName() }}</md-icon>
    </span>
    <span class="status-name">
      {{ statusName }}
    </span>
  </div>
</template>

<script>

const Status = {
  WAITING: 0,
  VALID: 1,
  ERROR: 2,
  WARNING: 3,
};


export default {
  name: 'StatusCheck',
  props: {
    statusName: String,
    statusCheck: Number,
  },
  data() {
    return {
      status: Status,
    };
  },
  methods: {
    getClass() {
      let result = '';
      switch (this.statusCheck) {
        case Status.WAITING:
          result = 'check-waiting';
          break;
        case Status.VALID:
          result = 'check-valid';
          break;
        case Status.ERROR:
          result = 'check-error';
          break;
        case Status.WARNING:
          result = 'check-warning';
          break;
        default:
          break;
      }
      return result;
    },
    getIconName() {
      let result = '';
      switch (this.statusCheck) {
        case Status.WAITING:
          result = 'pause_circle_filled';
          break;
        case Status.VALID:
          result = 'check_circle';
          break;
        case Status.ERROR:
          result = 'remove_circle';
          break;
        case Status.WARNING:
          result = 'error';
          break;
        default:
          break;
      }
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.status-icon {
  padding: 5px;
}

.check-waiting {
  color: #01579B !important;
}

.check-warning {
  color: #F57F17 !important;
}

.check-valid {
  color: #1B5E20 !important;
}

.check-error {
  color: #b71c1c !important;
}
</style>
