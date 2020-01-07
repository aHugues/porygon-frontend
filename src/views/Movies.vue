<template>
  <div id="movies-list" class="movies">

    <div v-if="loading" class="loader">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>

    <div v-if="!loading && showDialog && !errored" :method="'create'" class="add-form-wrapper">
      <div class="close-button-wrapper">
        <md-button class="md-icon-button" @click="showDialog = false">
          <md-icon>close</md-icon>
        </md-button>
      </div>
      <movie-form :method="'create'"  :movie="{}" :categories="categories" :locations="locations"
          @movie-added-or-modified="refreshList(-1)"></movie-form>
    </div>

    <empty-page
      v-if="!loading && movies.length == 0 && !showDialog && !errored"
      resource="movie" :action="true"
      @resource-created="newMovie()">
    </empty-page>

    <error-state v-if="errored" resource="movie" @reload-page="reloadPage()"></error-state>

    <div v-if="!loading && movies.length > 0 && !errored">
      <md-list :md-expand-single="true">
        <div v-for="(movie, key) in movies" :key="key" :id="`movie-elt-${key}`">
          <md-list-item @click="onSelect(key)" md-expand
          :md-expanded.sync="expanded[key - 1]">
            <movie
            :movie="movie.Movie" :category="movie.Category" :location="movie.Location"
            ></movie>
            <div slot="md-expand">
              <movie-form :currentMovie="movie.Movie"
              v-if="expanded[key - 1]"
              :categories="categories" :locations="locations"
              :method="'modify'"
              @movie-added-or-modified="refreshList(key - 1)"></movie-form>
            </div>
          </md-list-item>
          <md-divider></md-divider>
        </div>
      </md-list>
    </div>

    <div class="add-button-wrapper" v-if="!loading && movies.length > 0 && !errored">
     <md-button class="md-fab md-primary" @click="newMovie()">
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
import Movie from '@/components/movie/Movie.vue';
import MovieForm from '@/components/movie/MovieForm.vue';
import config from '../config';

export default {
  name: 'MoviesView',
  created() {
    this.fetchData();
    window.addEventListener('md-collapsed', () => { this.scrollTo(this.selectedId); });
    window.addEventListener('md-expanded', () => { this.scrollTo(this.selectedId); });
  },
  data() {
    return {
      movies: [],
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
    Movie,
    MovieForm,
    EmptyPage,
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
          withCredentials: true,
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
    fetchMovies() {
      axios
        .get(`${this.apiBaseUrl}/movies`, {
          headers: this.buildHeaders(),
          withCredentials: true,
        })
        .catch(() => {
          this.resource = 'movies_list';
          this.errored = true;
          this.errorDisplayed = true;
          this.movies = [];
          this.resourcesLoaded += 1;
        })
        .then((response) => {
          if (response) {
            this.expanded = Array(response.data.length);
            this.expanded.fill(false);
            this.movies = response.data;
            this.resourcesLoaded += 1;
          }
        });
    },
    fetchData() {
      this.fetchLocations();
      this.fetchCategories();
      this.fetchMovies();
    },
    refreshList(id) {
      if (id > 0) {
        this.expanded[id] = false;
      }
      this.showDialog = false;
      this.fetchData();
    },
    onSelect(id) {
      console.log(`Selected movie ${id}`);
      this.selectedId = id;
      this.$nextTick(() => {
        this.scrollTo(id);
      });
    },
    reloadPage() {
      this.$router.go();
    },
    newMovie() {
      this.showDialog = true;
    },
    scrollTo(id) {
      this.$nextTick(() => {
        const container = document.getElementById(`movie-elt-${id}`);
        const wrapper = document.getElementById('movies-list');
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

.movies {
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
