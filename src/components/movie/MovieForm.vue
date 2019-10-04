<template>
<div class="movie-edit-form">
    <form novalidate @submit.prevent="validateMovie">
      <div class="md-layout md-gutter">

        <div class="md-layout-item md-size-100">
          <md-field :class="getValidationClass('title')">
            <label for="title">Title</label>
            <md-input name="title" id="title" v-model="movie.title"/>
            <span class="md-error" v-if="!$v.movie.title.required">The title is required</span>
            <span class="md-error" v-if="!$v.movie.title.maxLength">The title is too long</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-50 md-small-size-100">
          <md-field :class="getValidationClass('year')">
            <label for="year">Year</label>
            <md-input name="year" id="year" v-model="movie.year"/>
            <span class="md-error" v-if="!$v.movie.year.required">The year is required</span>
            <span class="md-error" v-if="!$v.movie.year.between">
              The year should be between 1920 and 210
            </span>
            <span class="md-error" v-if="!$v.movie.year.integer">
              The year should be a number
            </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-50 md-small-size-100">
          <md-field :class="getValidationClass('duration')">
            <label for="duration">Duration (mins.)</label>
            <md-input name="duration" id="duration" v-model="movie.duration"/>
            <span class="md-error" v-if="!$v.movie.duration.required">
              The duration is required
            </span>
            <span class="md-error" v-if="!$v.movie.duration.between">
              The duration should be between 0 and 600
            </span>
            <span class="md-error" v-if="!$v.movie.duration.integer">
              The duration should be a number
            </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field :class="getValidationClass('director')">
            <label for="director">Director</label>
            <md-input name="director" id="director" v-model="movie.director"/>
            <span class="md-error" v-if="!$v.movie.director.maxLength">
              The director is too long
            </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field :class="getValidationClass('actors')">
            <label for="actors">Actors</label>
            <md-input name="actors" id="actors" v-model="movie.actors"/>
            <span class="md-error" v-if="!$v.movie.actors.maxLength">
              The actors list is too long
            </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field>
            <label for="support">Supports</label>
            <md-select v-model="supports" name="supports" id="supports" multiple>
              <md-option value="dvd">DvD</md-option>
              <md-option value="bluray">Bluray</md-option>
              <md-option value="digital">Digital</md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field>
            <label for="location">Location</label>
            <md-select v-model="movie.location_id" name="location" id="location">
              <md-option v-for="(location, key) in locations" :key="key"
              :value="location.id">{{ location.location }}</md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field>
            <label for="category">Category</label>
            <md-select v-model="movie.category_id" name="category" id="category">
              <md-option v-for="(category, key) in categories" :key="key"
              :value="category.id">{{ category.label }}</md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field :class="getValidationClass('remarks')">
            <label for="remarks">Remarks</label>
            <md-input name="remarks" id="remarks" v-model="movie.remarks"/>
            <span class="md-error" v-if="!$v.movie.remarks.maxLength">
              The remarks are too long
            </span>
          </md-field>
        </div>

      </div>

      <md-button v-if="method === 'create'" type="submit" class="md-accent">
        Create movie
      </md-button>
      <md-button v-if="method === 'modify'" type="submit" class="md-accent">
        Edit movie
      </md-button>
      <md-button v-if="method === 'modify'" @click="deleteMovie" class="md-primary">
        Delete movie
      </md-button>
    </form>

</div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
  required, maxLength, between, integer,
} from 'vuelidate/lib/validators';
import axios from 'axios';
import config from '../../config';

export default {
  name: 'MovieForm',
  mixins: [validationMixin],
  created() {
    this.getLocationsList();
    this.getCategoriesList();
  },
  mounted() {
    if (this.method === 'modify') {
      this.movie = this.currentMovie;
      const mapping = {
        is_dvd: 'dvd',
        is_bluray: 'bluray',
        is_digital: 'digital',
      };
      Object.keys(mapping).forEach((key) => {
        if (this.movie[key]) {
          this.supports.push(mapping[key]);
        }
      });
    } else {
      this.movie = {};
      this.supports = [false, false, false];
    }
  },
  watch: {
    supports(newSupports) {
      const mapping = {
        dvd: 'is_dvd',
        bluray: 'is_bluray',
        digital: 'is_digital',
      };
      const vars = ['is_dvd', 'is_bluray', 'is_digital'];
      vars.forEach(element => { this.movie[element] = false; })
      this.supports.forEach(support => { this.movie[mapping[support]] = true; })
    },
  },
  data() {
    return {
      movie: {},
      environment: process.env.NODE_ENV,
      locations: [],
      categories: [],
      supports: [],
    };
  },
  computed: {
    apiBaseUrl() { return config[this.environment].porygonApiBaseUrl; },
    authenticationRequired() { return config[this.environment].porygonApiAuthentication; },
  },
  validations: {
    movie: {
      title: {
        required,
        maxLength: maxLength(128),
      },
      duration: {
        required,
        between: between(0, 600),
        integer,
      },
      year: {
        required,
        between: between(1910, 2100),
        integer,
      },
      director: {
        maxLength: maxLength(128),
      },
      actors: {
        maxLength: maxLength(128),
      },
      remarks: {
        maxLength: maxLength(255),
      },
    },
  },
  props: {
    method: {
      type: String,
      required: true,
      validator: value => ['create', 'modify'].indexOf(value) !== -1,
    },
    currentMovie: Object,
    currentLocation: Object,
    currentCategory: Object,
  },
  methods: {
    deleteMovie() {
      axios({
        method: 'delete',
        url: `${this.apiBaseUrl}/movies/${this.id}`,
        headers: this.buildHeaders(),
      })
        .then(() => this.$emit('movie-added-or-modified'))
        .catch(error => console.error(error));
    },
    buildHeaders() {
      const headers = { 'Content-Type': 'application/json' };
      if (this.authenticationRequired) {
        headers.Authorization = `Bearer ${localStorage.getItem('vue-token')}`;
      }
      return headers;
    },
    getValidationClass(fieldName) {
      const field = this.$v.movie[fieldName];
      let returnedClass = {};

      if (field) {
        returnedClass = {
          'md-invalid': field.$invalid && field.$dirty,
        };
      }

      return returnedClass;
    },
    getLocationsList() {
      axios
        .get(`${this.apiBaseUrl}/locations`, {
          headers: this.buildHeaders(),
        })
        .then((response) => { this.locations = response.data; });
    },
    getCategoriesList() {
      axios
        .get(`${this.apiBaseUrl}/categories`, {
          headers: this.buildHeaders(),
        })
        .then((response) => { this.categories = response.data; });
    },
    saveMovie() {
      const method = (this.method === 'create') ? 'post' : 'put';
      const urlId = (this.method === 'modify') ? `/${this.movie.id}` : '';
      axios({
        method,
        url: `${this.apiBaseUrl}/movies${urlId}`,
        headers: this.buildHeaders(),
        data: this.movie,
      })
        .then(() => this.$emit('movie-added-or-modified'))
        .catch(error => console.error(error));
    },
    validateMovie() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.saveMovie();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.movie-edit-form {
  width: 90%;
  margin: auto;
}
</style>
