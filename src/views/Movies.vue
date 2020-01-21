<template>
  <div id="movies-list" class="movies">

    <div v-if="state === State.LOADING" class="loader">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>

    <div v-if="state === State.EDIT" :method="'create'" class="add-form-wrapper">
      <div class="close-button-wrapper">
        <md-button class="md-icon-button" @click="closeDialog()">
          <md-icon>close</md-icon>
        </md-button>
      </div>
      <movie-form :method="'create'"  :movie="{}"
        :categories="categories" :locations="locations"
        @movie-added-or-modified="refreshList(-1)">
      </movie-form>
    </div>

    <empty-page
      v-if="state === State.EMPTY"
      resource="movie" :action="true"
      @resource-created="newMovie()">
    </empty-page>

    <error-state
      v-if="state === State.ERRORED" resource="movie"
      @reload-page="reloadPage()">
    </error-state>

    <div v-if="state === State.OK">
      <md-list :md-expand-single="true">
        <div v-for="(movie, key) in movies" :key="key" :id="`movie-elt-${key}`">
          <md-list-item @click="onSelect(key)" md-expand
          :md-expanded.sync="expanded[key - 1]">
            <movie
            :movie="movie.Movie" :location="movie.Location"
            :categories="movie.Categories.filter(category => category.id !== null)"
            ></movie>
            <div slot="md-expand">
              <movie-form :currentMovie="movie.Movie" :movieCategories="movie.Categories"
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

    <div class="add-button-wrapper" v-if="state === State.OK">
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
import requests from '../utils/requests';

const State = {
  LOADING: 'loading',
  ERRORED: 'errored',
  EMPTY: 'empty',
  OK: 'ok',
  EDIT: 'edit',
};

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
        this.state = this.movies.length === 0 ? State.EMPTY : State.OK;
      }
    },
  },
  components: {
    Movie,
    MovieForm,
    EmptyPage,
    ErrorState,
  },
  methods: {
    fetchLocations() {
      axios
        .get(requests.buildUrl('locations'), requests.buildOptions())
        .then((response) => {
          if (response) {
            this.locations = response.data;
            this.resourcesLoaded += 1;
          }
        })
        .catch(() => {
          this.resource = 'locations_list';
          this.errorDisplayed = true;
          this.state = State.ERRORED;
          this.locations = [];
          this.resourcesLoaded += 1;
        });
    },
    fetchCategories() {
      axios
        .get(requests.buildUrl('categories'), requests.buildOptions())
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
    fetchMovies() {
      axios
        .get(requests.buildUrl('movies'), requests.buildOptions())
        .then((response) => {
          if (response) {
            this.expanded = Array(response.data.length);
            this.expanded.fill(false);
            this.movies = response.data;
            this.resourcesLoaded += 1;
          }
        })
        .catch(() => {
          this.resource = 'movies_list';
          this.state = State.ERRORED;
          this.errorDisplayed = true;
          this.movies = [];
          this.resourcesLoaded += 1;
        });
    },
    fetchData() {
      this.fetchLocations();
      this.fetchCategories();
      this.fetchMovies();
    },
    closeDialog() {
      this.state = this.movies.length === 0 ? State.EMPTY : State.OK;
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
    reloadPage() {
      this.$router.go();
    },
    newMovie() {
      this.state = State.EDIT;
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
