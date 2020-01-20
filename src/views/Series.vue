<template>
  <div id="series-list" class="series">

    <div v-if="state === State.LOADING" class="loader">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>

    <div v-if="state === State.EDIT" :method="'create'" class="add-form-wrapper">
      <div class="close-button-wrapper">
        <md-button class="md-icon-button" @click="closeDialog()">
          <md-icon>close</md-icon>
        </md-button>
      </div>
      <serie-form :method="'create'" :serie="{}"
        :categories="categories" :locations="locations"
        @serie-added-or-modified="refreshList(-1)">
      </serie-form>
    </div>

    <empty-page
      v-if="state === State.EMPTY"
      resource="serie" :action="true"
      @resource-created="newSerie()">
    </empty-page>

    <error-state
      v-if="state === State.ERRORED" resource="serie"
      @reload-page="reloadPage()">
    </error-state>

     <div v-if="state === State.OK">
      <md-list :md-expand-single="true">
        <div v-for="(serie, key) in series" :key="key" :id="`serie-elt-${key}`">
          <md-list-item @click="onSelect(key)" md-expand
          :md-expanded.sync="expanded[key - 1]">
            <serie
            :serie="serie.Serie" :location="serie.Location"
            :categories="serie.Categories.filter(category => category.id !== null)"
            ></serie>
            <div slot="md-expand">
              <serie-form :currentSerie="serie.Serie" :serieCategories="serie.Categories"
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

    <div class="add-button-wrapper" v-if="state === State.OK">
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
import EmptyPage from '@/components/misc/EmptyPage.vue';
import ErrorState from '@/components/misc/ErrorState.vue';
import Serie from '@/components/serie/Serie.vue';
import SerieForm from '@/components/serie/SerieForm.vue';
import config from '../config';

const State = {
  LOADING: 'loading',
  ERRORED: 'errored',
  EMPTY: 'empty',
  OK: 'ok',
  EDIT: 'edit',
};

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
      expanded: [],
      categories: [],
      locations: [],
      selectedId: -1,
      errorDisplayed: false,
      resource: '',
      resourcesLoaded: 0,
      State,
      state: State.LOADING,
    };
  },
  watch: {
    resourcesLoaded(newValue) {
      if (newValue === 3) {
        this.state = this.series.length === 0 ? State.EMPTY : State.OK;
      }
    },
  },
  components: {
    EmptyPage,
    Serie,
    SerieForm,
    ErrorState,
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
          withCredentials: true,
        })
        .then((response) => {
          if (response) {
            this.locations = response.data;
            this.resourcesLoaded += 1;
          }
        })
        .catch(() => {
          this.resource = 'locations_list';
          this.state = State.ERRORED;
          this.errorDisplayed = true;
          this.locations = [];
          this.resourcesLoaded += 1;
        });
    },
    fetchCategories() {
      axios
        .get(`${this.apiBaseUrl}/categories`, {
          headers: this.buildHeaders(),
          withCredentials: true,
        })
        .then((response) => {
          if (response) {
            this.categories = response.data;
            this.resourcesLoaded += 1;
          }
        })
        .catch(() => {
          this.resource = 'categories_list';
          this.state = State.ERRORED;
          this.errorDisplayed = true;
          this.categories = [];
          this.resourcesLoaded += 1;
        });
    },
    fetchSeries() {
      axios
        .get(`${this.apiBaseUrl}/series`, {
          headers: this.buildHeaders(),
          withCredentials: true,
        })
        .then((response) => {
          if (response) {
            this.expanded = Array(response.data.length);
            this.expanded.fill(false);
            this.series = response.data;
            this.resourcesLoaded += 1;
          }
        })
        .catch(() => {
          this.resource = 'series_list';
          this.state = State.ERRORED;
          this.errorDisplayed = true;
          this.series = [];
          this.resourcesLoaded += 1;
        });
    },
    fetchData() {
      this.fetchSeries();
      this.fetchLocations();
      this.fetchCategories();
    },
    closeDialog() {
      this.state = this.series.length === 0 ? State.EMPTY : State.OK;
    },
    refreshList(id) {
      if (id > 0) {
        this.expanded[id] = false;
      }
      this.resourcesLoaded = 0;
      this.state = State.LOADING;
      this.fetchData();
    },
    onSelect(id) {
      this.selectedId = id;
      this.$nextTick(() => {
        this.scrollTo(id);
      });
    },
    newSerie() {
      this.state = State.EDIT;
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
