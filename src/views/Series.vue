<template>
  <div id="series-list" class="series">

    <div v-if="loading" class="loader">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>

    <div v-if="!loading && showDialog &&!errored" :method="'create'" class="add-form-wrapper">
      <div class="close-button-wrapper">
        <md-button class="md-icon-button" @click="showDialog = false">
          <md-icon>close</md-icon>
        </md-button>
      </div>
      <serie-form :method="'create'" :serie="{}"
          :categories="categories" :locations="locations"
          @serie-added-or-modified="refreshList(-1)"></serie-form>
    </div>

    <md-empty-state
      v-if="!loading && series.length == 0 && !showDialog && !errored"
      md-icon="tv"
      :md-label="$ml.get('serie').empty_button"
      :md-description="$ml.get('serie').empty_description">
      <md-button @click="newSerie()" class="md-primary md-raised">
        {{ $ml.get('serie').empty_button }}
      </md-button>
    </md-empty-state>

    <md-empty-state
      v-if="errored"
      md-icon="tv"
      :md-label="$ml.get('error').reload_button"
      :md-description="$ml.get('error').errored_description">
      <md-button @click="reloadPage()" class="md-primary md-raised">
        {{ $ml.get('error').reload_button }}
      </md-button>
    </md-empty-state>

     <div v-if="!loading && series.length > 0 && !errored">
      <md-list :md-expand-single="true">
        <div v-for="(serie, key) in series" :key="key" :id="`serie-elt-${key}`">
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

    <div class="add-button-wrapper" v-if="!loading && series.length > 0 && !errored">
     <md-button class="md-fab md-primary" @click="newSerie()">
       <md-icon>add</md-icon>
     </md-button>
   </div>

  <md-snackbar :md-active.sync="errorDisplayed">
     <span>{{ $ml.get('error').resources[resource] }}</span>
   </md-snackbar>

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
    window.addEventListener('md-collapsed', () => { this.scrollTo(this.selectedId); });
    window.addEventListener('md-expanded', () => { this.scrollTo(this.selectedId); });
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
      selectedId: -1,
      errorDisplayed: false,
      errored: false,
      resource: '',
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
        .catch(() => {
          this.resource = 'locations_list';
          this.errored = true;
          this.errorDisplayed = true;
          this.locations = [];
          this.resourcesLoaded += 1;
        })
        .then((response) => {
          if (response) {
            this.locations = response.data;
            this.resourcesLoaded += 1;
          }
        });
    },
    fetchCategories() {
      axios
        .get(`${this.apiBaseUrl}/categories`, {
          headers: this.buildHeaders(),
        })
        .catch(() => {
          this.resource = 'categories_list';
          this.errored = true;
          this.errorDisplayed = true;
          this.categories = [];
          this.resourcesLoaded += 1;
        })
        .then((response) => {
          if (response) {
            this.categories = response.data;
            this.resourcesLoaded += 1;
          }
        });
    },
    fetchSeries() {
      axios
        .get(`${this.apiBaseUrl}/series`, {
          headers: this.buildHeaders(),
        })
        .catch(() => {
          this.resource = 'series_list';
          this.errored = true;
          this.errorDisplayed = true;
          this.series = [];
          this.resourcesLoaded += 1;
        })
        .then((response) => {
          if (response) {
            this.expanded = Array(response.data.length);
            this.expanded.fill(false);
            this.series = response.data;
            this.resourcesLoaded += 1;
          }
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
      this.selectedId = id;
      this.$nextTick(() => {
        this.scrollTo(id);
      });
    },
    newSerie() {
      this.showDialog = true;
    },
    reloadPage() {
      this.$router.go();
    },
    scrollTo(id) {
      this.$nextTick(() => {
        const container = document.getElementById(`serie-elt-${id}`);
        const wrapper = document.getElementById('series-list');
        wrapper.scrollTo(0, container.offsetTop);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.close-button-wrapper {
  position: absolute;
  top: 5px;
  right: 15px;
}

.add-form-wrapper {
  position: relative;
}

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
