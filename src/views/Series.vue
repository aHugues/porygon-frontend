<template>
  <div class="home">
    <md-empty-state
      v-if="series.length == 0 && !showDialog"
      md-icon="tv"
      md-label="Create your first series"
      md-description="Creating series, you'll be able to store and order your series library.">
      <md-button class="md-primary md-raised">Create your first series</md-button>
    </md-empty-state>

     <div v-if="series.length > 0">
      <md-list>
        <div v-for="(serie, key) in series" :key="key">
          <md-list-item @click="onSelect(serie.Serie.id)">
            <serie
            :serie="serie.Serie" :category="serie.Category" :location="serie.Location"
            ></serie>
          </md-list-item>
          <md-divider></md-divider>
        </div>
      </md-list>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Serie from '@/components/serie/Serie.vue';
// import LocationForm from '@/components/location/LocationForm.vue';
import config from '../config';

export default {
  name: 'SeriesView',
  created() {
    this.fetchData();
  },
  data() {
    return {
      series: [],
      environment: process.env.NODE_ENV,
      showDialog: false,
    };
  },
  components: {
    Serie,
  },
  computed: {
    apiBaseUrl() { return config[this.environment].porygonApiBaseUrl; },
    authenticationRequired() { return config[this.environment].porygonApiAuthentication; },
  },
  methods: {
    buildHeaders() {
      const headers = { 'Content-Type': 'application/json' };
      if (this.authenticationRequired) {
        headers.Authorization = `Bearer ${localStorage.getItem('vue-token')}`;
      }
      return headers;
    },
    fetchData() {
      axios
        .get(`${this.apiBaseUrl}/series`, {
          headers: this.buildHeaders(),
        })
        .then((response) => { this.series = response.data; });
    },
    onSelect(id) {
      console.log(`Selected serie ${id}`);
    },
  },
};
</script>
