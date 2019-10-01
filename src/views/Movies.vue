<template>
  <div class="movies">
    <md-empty-state
      v-if="movies.length == 0 && !showDialog"
      md-icon="movie"
      md-label="Create your first movie"
      md-description="Creating movies, you'll be able to store and order your movies library.">
      <md-button class="md-primary md-raised">Create your first movie</md-button>
    </md-empty-state>

    <div v-if="movies.length > 0">
      <md-list>
        <div v-for="(movie, key) in movies" :key="key">
          <md-list-item @click="onSelect(movie.Movie.id)">
            <movie
            :movie="movie.Movie" :category="movie.Category" :location="movie.Location"
            ></movie>
          </md-list-item>
          <md-divider></md-divider>
        </div>
      </md-list>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import Movie from '@/components/movie/Movie.vue';
// import LocationForm from '@/components/location/LocationForm.vue';
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
    };
  },
  components: {
    Movie,
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
        .get(`${this.apiBaseUrl}/movies`, {
          headers: this.buildHeaders(),
        })
        .then((response) => { this.movies = response.data; });
    },
    onSelect(id) {
      console.log(`Selected movie ${id}`);
    },
  },
};
</script>
