<template>
  <div class="movies">

    <div v-if="loading" class="loader">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>

    <movie-form v-if="!loading && showDialog" :method="'create'" :movie="{}"
        :categories="categories" :locations="locations"
        @movie-added-or-modified="refreshList(-1)"></movie-form>

    <md-empty-state
      v-if="!loading && movies.length == 0 && !showDialog"
      md-icon="movie"
      md-label="Create your first movie"
      md-description="Creating movies, you'll be able to store and order your movies library.">
      <md-button @click="newMovie()" class="md-primary md-raised">
        Create your first movie
      </md-button>
    </md-empty-state>

    <div v-if="!loading && movies.length > 0">
      <md-list :md-expand-single="true">
        <div v-for="(movie, key) in movies" :key="key" :id="`movie-elt-${key}`">
          <md-list-item @click="onSelect(key)" md-expand
          :md-expanded.sync="expanded[key - 1]">
            <movie
            :movie="movie.Movie" :category="movie.Category" :location="movie.Location"
            ></movie>
            <movie-form :currentMovie="movie.Movie"
            :categories="categories" :locations="locations"
            :method="'modify'" slot="md-expand"
            @movie-added-or-modified="refreshList(key - 1)"></movie-form>
          </md-list-item>
          <md-divider></md-divider>
        </div>
      </md-list>
    </div>

    <div class="add-button-wrapper" v-if="!loading && movies.length > 0">
     <md-button class="md-fab md-primary" @click="newMovie()">
       <md-icon>add</md-icon>
     </md-button>
   </div>

  </div>
</template>

<script>

import axios from 'axios';
import Movie from '@/components/movie/Movie.vue';
import MovieForm from '@/components/movie/MovieForm.vue';
import config from '../config';

export default {
  name: 'MoviesView',
  created() {
    this.fetchData();
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
    fetchMovies() {
      axios
        .get(`${this.apiBaseUrl}/movies`, {
          headers: this.buildHeaders(),
        })
        .then((response) => {
          this.expanded = Array(response.data.length);
          this.expanded.fill(false);
          this.movies = response.data;
          this.resourcesLoaded += 1;
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
      this.scrollTo(id);
    },
    newMovie() {
      this.showDialog = true;
    },
    scrollTo(id) {
      const container = this.$el.querySelector(`#movie-elt-${id}`);
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
