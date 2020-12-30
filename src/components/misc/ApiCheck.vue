<template>
<div>

  <md-card>
    <md-card-header>
      <div class="md-title">
        <md-icon :class="getClass()">{{ getIconName() }}</md-icon> Porygon API</div>
    </md-card-header>

    <md-card-content>

      <div v-if="pageState === state.LOADING">
        {{ $ml.get('home').status_check.waiting }}
      </div>

      <div v-if="pageState !== state.LOADING">
        <status-check v-for="(status, index) in getStatusList()"
          :key="index" :status-name="status[0]" :status-check="status[1]">
        </status-check>
      </div>
    </md-card-content>
  </md-card>

</div>
</template>

<script>

import axios from 'axios';
import config from '../../config';
import requests from '../../utils/requests';
import StatusCheck from './StatusCheck.vue';

const Status = {
  WAITING: 0,
  VALID: 1,
  ERROR: 2,
  WARNING: 3,
};

const State = {
  LOADING: 0,
  VALID: 1,
  ERROR: 2,
};

export default {
  name: 'ApiCheck',
  components: {
    StatusCheck,
  },
  mounted() {
    this.checkAPI()
      .then(() => {
        this.pageState = (
          this.apiReachableStatus === Status.VALID && this.apiVersionStatus === Status.VALID
          && this.databaseStatus === Status.VALID
        ) ? State.VALID : State.ERROR;
      })
      .catch(() => { this.pageState = State.ERROR; });
  },
  data() {
    return {
      pageState: State.LOADING,
      apiReachableStatus: Status.WAITING,
      apiVersionStatus: Status.WAITING,
      databaseStatus: Status.WAITING,
      state: State,
      status: Status,
    };
  },
  computed: {
    minRequiredApiVersion() { return config.all.porygonApiMinVersion; },
  },
  methods: {
    getStatusList() {
      const statusList = [
        ['API reachable', this.apiReachableStatus],
        ['API version valid', this.apiVersionStatus],
        ['Database status', this.databaseStatus],
      ];
      return statusList;
    },
    parseVersionNumber(version) {
      const parsedVersion = version.replace('v', '').split('.').map((x) => Number(x));
      while (parsedVersion.length !== 3) {
        parsedVersion.push(0);
      }
      return parsedVersion;
    },
    isVersionValid(requiredVersion, serverVersion) {
      const minVersionArray = this.parseVersionNumber(requiredVersion);
      const serverVersionArray = this.parseVersionNumber(serverVersion);

      return (
        (serverVersionArray[0] > minVersionArray[0])
        || (serverVersionArray[0] === minVersionArray[0] && serverVersionArray[1] > minVersionArray[1]) // eslint-disable-line max-len
        || (serverVersionArray[0] === minVersionArray[0] && serverVersionArray[1] === minVersionArray[1] && serverVersionArray[2] > minVersionArray[2]) // eslint-disable-line max-len
        || (JSON.stringify(serverVersionArray) === JSON.stringify(minVersionArray))
      );
    },
    checkAPI() {
      return new Promise((resolve, reject) => {
        axios
          .get(requests.buildUrl('healthcheck'), requests.buildOptions())
          .then((response) => {
            this.apiReachableStatus = Status.VALID;
            this.databaseStatus = response.data.database.status ? Status.VALID : Status.ERROR;
            const distantVersion = response.data.ApiVersion;
            const apiVersionValid = this.isVersionValid(
              this.minRequiredApiVersion, distantVersion,
            );
            this.apiVersionStatus = apiVersionValid ? Status.VALID : Status.ERROR;
            resolve();
          })
          .catch(() => {
            this.databaseStatus = Status.ERROR;
            this.apiReachableStatus = Status.ERROR;
            this.apiVersionStatus = Status.ERROR;
            this.$emit('server-version-error');
            reject();
          });
      });
    },
    getClass() {
      let result = '';
      switch (this.pageState) {
        case State.LOADING:
          result = 'check-waiting';
          break;
        case State.VALID:
          result = 'check-valid';
          break;
        case State.ERROR:
          result = 'check-error';
          break;
        default:
          break;
      }
      return result;
    },
    getIconName() {
      let result = '';
      switch (this.pageState) {
        case State.LOADING:
          result = 'pause_circle_filled';
          break;
        case State.VALID:
          result = 'check_circle';
          break;
        case State.ERROR:
          result = 'remove_circle';
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
.check-waiting {
  color: #01579B !important;
}

.check-valid {
  color: #1B5E20 !important;
}

.check-error {
  color: #b71c1c !important;
}
</style>
