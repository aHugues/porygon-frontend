<template>
  <div class="series">

    <serie-form v-if="showDialog" :method="'create'" :serie="{}"
        :categories="categories" :locations="locations"
        @serie-added-or-modified="refreshList(-1)"></serie-form>

    <md-empty-state
      v-if="series.length == 0 && !showDialog"
      md-icon="tv"
      md-label="Create your first series"
      md-description="Creating series, you'll be able to store and order your series library.">
      <md-button @click="newSerie()" class="md-primary md-raised">
        Create your first series
      </md-button>
    </md-empty-state>

     <div v-if="series.length > 0">
      <md-list :md-expand-single="true">
        <div v-for="(serie, key) in series" :key="key">
          <md-list-item @click="onSelect(serie.Serie.id)" md-expand
          :md-expanded.sync="expanded[key - 1]">
            <serie
            :serie="serie.Serie" :category="serie.Category" :location="serie.Location"
            ></serie>
             <serie-form :currentSerie="serie.Serie"
            :categories="categories" :locations="locations"
            :method="'modify'" slot="md-expand"
            @serie-added-or-modified="refreshList(key - 1)"></serie-form>
          </md-list-item>
          <md-divider></md-divider>
        </div>
      </md-list>
    </div>

    <div class="add-button-wrapper" v-if="series.length > 0">
     <md-button class="md-fab md-primary" @click="newSerie()">
       <md-icon>add</md-icon>
     </md-button>
   </div>

  </div>
</template>

<script>
import axios from 'axios';
import Serie from '@/components/serie/Serie.vue';
import SerieForm from '@/components/serie/SerieForm.vue';
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
      expanded: [],
      categories: [],
      locations: [],
    };
  },
  components: {
    Serie,
    SerieForm,
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
    fetchLocations() {
      axios
        .get(`${this.apiBaseUrl}/locations`, {
          headers: this.buildHeaders(),
        })
        .then((response) => { this.locations = response.data; });
    },
    fetchCategories() {
      axios
        .get(`${this.apiBaseUrl}/categories`, {
          headers: this.buildHeaders(),
        })
        .then((response) => { this.categories = response.data; });
    },
    fetchSeries() {
      axios
        .get(`${this.apiBaseUrl}/series`, {
          headers: this.buildHeaders(),
        })
        .then((response) => {
          this.expanded = Array(response.data.length);
          this.expanded.fill(false);
          this.series = response.data;
        });
    },
    fetchData() {
      this.fetchSeries();
      this.fetchLocations();
      this.fetchCategories();
    },
    refreshList(id) {
      if (id > 0) {
        this.expanded[id] = false;
      }
      this.showDialog = false;
      this.fetchData();
    },
    onSelect(id) {
      console.log(`Selected serie ${id}`);
    },
    newSerie() {
      this.showDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.add-button-wrapper {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 10;
}
</style>
