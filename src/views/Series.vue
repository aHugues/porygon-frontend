<template>
  <div class="series">

    <div v-if="loading" class="loader">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>

    <serie-form v-if="!loading && showDialog" :method="'create'" :serie="{}"
        :categories="categories" :locations="locations"
        @serie-added-or-modified="refreshList(-1)"></serie-form>

    <md-empty-state
      v-if="!loading && series.length == 0 && !showDialog"
      md-icon="tv"
      md-label="Create your first series"
      md-description="Creating series, you'll be able to store and order your series library.">
      <md-button @click="newSerie()" class="md-primary md-raised">
        Create your first series
      </md-button>
    </md-empty-state>

     <div v-if="!loading && series.length > 0">
      <md-list :md-expand-single="true">
        <div v-for="(serie, key) in series" :key="key" :id="`movie-elt-${key}`">
          <md-list-item @click="onSelect(key)" md-expand
          :md-expanded.sync="expanded[key - 1]">
            <serie
            :serie="serie.Serie" :category="serie.Category" :location="serie.Location"
            ></serie>
            <div slot="md-expand">
              <serie-form :currentSerie="serie.Serie"
              v-if="expanded[key - 1]"
              :categories="categories" :locations="locations"
              :method="'modify'"
              @serie-added-or-modified="refreshList(key - 1)"></serie-form>
            </div>
          </md-list-item>
          <md-divider></md-divider>
        </div>
      </md-list>
    </div>

    <div class="add-button-wrapper" v-if="!loading && series.length > 0">
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
      loading: true,
      resourcesLoaded: 0,
    };
  },
  watch: {
    resourcesLoaded(newValue) {
      if (newValue === 3) {
        this.loading = false;
      }
    },
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
        .then((response) => { this.locations = response.data; this.resourcesLoaded += 1; });
    },
    fetchCategories() {
      axios
        .get(`${this.apiBaseUrl}/categories`, {
          headers: this.buildHeaders(),
        })
        .then((response) => { this.categories = response.data; this.resourcesLoaded += 1; });
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
          this.resourcesLoaded += 1;
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
    scrollTo(id) {
      const container = this.$el.querySelector(`#serie-elt-${id}`);
      this.$nextTick(() => {
        container.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.series {
  height: 100%;
}

.add-button-wrapper {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 10;
}

.loader {
  text-align: center;
  width: 100%;
  height: 100%;
  padding-top: 30%;
}
</style>
