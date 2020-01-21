<template>
<div>

  <md-card>
    <md-card-header>
      <div class="md-title">Porygon API</div>
    </md-card-header>

    <md-card-content>

      <div v-if="pageState === state.LOADING">
        {{ $ml.get('home').status_check.waiting }}
      </div>

      <div v-if="pageState !== state.LOADING">
        {{ displayStatusCheckValue() }}
      </div>
    </md-card-content>
  </md-card>

</div>
</template>

<script>

import axios from 'axios';
import config from '../../config';
import requests from '../../utils/requests';

const State = {
  LOADING: 0,
  VALID: 1,
  VERSION_MISMATCH: 2,
  ERROR: 3,
};

export default {
  name: 'VersionCheck',
  mounted() {
    this.getApiVersion()
      .then(() => {
        this.pageState = this.isVersionValid(this.minRequiredApiVersion, this.distantVersion)
          ? State.VALID : State.VERSION_MISMATCH;
      })
      .catch(() => { this.pageState = State.ERROR; });
  },
  data() {
    return {
      distantVersion: '',
      pageState: State.LOADING,
      state: State,
    };
  },
  computed: {
    minRequiredApiVersion() { return config.all.porygonApiMinVersion; },
  },
  methods: {
    parseVersionNumber(version) {
      const parsedVersion = version.replace('v', '').split('.').map(x => Number(x));
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
    getApiVersion() {
      return new Promise((resolve, reject) => {
        axios
          .get(requests.buildUrl(), requests.buildOptions())
          .then((response) => {
            this.distantVersion = response.headers['porygon-api-version'];
            resolve();
          })
          .catch(() => {
            this.$emit('server-version-error');
            reject();
          });
      });
    },
    displayStatusCheckValue() {
      const baseStrings = this.$ml.get('home').status_check;
      let result = '';
      switch (this.pageState) {
        case State.VALID:
          result = baseStrings.version_ok.replace('{0}', this.minRequiredApiVersion);
          break;
        case State.VERSION_MISMATCH:
          result = baseStrings.version_error.replace('{0}', this.minRequiredApiVersion).replace('{1}', this.distantVersion);
          break;
        case State.ERROR:
          result = baseStrings.version_checking_error;
          break;
        default:
          break;
      }
      return result;
    },
  },

};
</script>
