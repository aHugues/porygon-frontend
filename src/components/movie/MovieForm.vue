<template>
<div class="movie-edit-form">
    <form novalidate @submit.prevent="validateMovie">
      <div class="md-layout md-gutter">

        <div class="md-layout-item md-size-100">
          <md-field :class="getValidationClass('title')">
            <label for="title">{{ $ml.get('movie').title }}</label>
            <md-input name="title" id="title" v-model="movie.title"/>
            <span class="md-error" v-if="!$v.movie.title.required">
              {{ $ml.get('movie').title_required }}
            </span>
            <span class="md-error" v-if="!$v.movie.title.maxLength">
              {{ $ml.get('movie').title_too_long }}
            </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field :class="getValidationClass('french_title')">
            <label for="french_title">{{ $ml.get('movie').french_title }}</label>
            <md-input name="french_title" id="french_title" v-model="movie.french_title"/>
            <span class="md-error" v-if="!$v.movie.french_title.maxLength">
              {{ $ml.get('movie').french_title_too_long }}
            </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-50 md-small-size-100">
          <md-field :class="getValidationClass('year')">
            <label for="year">{{ $ml.get('movie').year }}</label>
            <md-input name="year" id="year" v-model="movie.year"/>
            <span class="md-error" v-if="!$v.movie.year.required">
              {{ $ml.get('movie').year_required }}
              </span>
            <span class="md-error" v-if="!$v.movie.year.between">
              {{ $ml.get('movie').year_between }}
            </span>
            <span class="md-error" v-if="!$v.movie.year.integer">
              {{ $ml.get('movie').year_integer }}
            </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-50 md-small-size-100">
          <md-field :class="getValidationClass('duration')">
            <label for="duration">{{ $ml.get('movie').duration }}</label>
            <md-input name="duration" id="duration" v-model="movie.duration"/>
            <span class="md-error" v-if="!$v.movie.duration.required">
              {{ $ml.get('movie').duration_required }}
            </span>
            <span class="md-error" v-if="!$v.movie.duration.between">
              {{ $ml.get('movie').duration_between }}
            </span>
            <span class="md-error" v-if="!$v.movie.duration.integer">
              {{ $ml.get('movie').duration_integer }}
            </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field :class="getValidationClass('director')">
            <label for="director">{{ $ml.get('movie').director }}</label>
            <md-input name="director" id="director" v-model="movie.director"/>
            <span class="md-error" v-if="!$v.movie.director.maxLength">
              {{ $ml.get('movie').director_too_long }}
            </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field :class="getValidationClass('actors')">
            <label for="actors">{{ $ml.get('movie').actors }}</label>
            <md-input name="actors" id="actors" v-model="movie.actors"/>
            <span class="md-error" v-if="!$v.movie.actors.maxLength">
              {{ $ml.get('movie').actors_too_long }}
            </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field>
            <label for="support">{{ $ml.get('movie').supports }}</label>
            <md-select v-model="supports" name="supports" id="supports" multiple>
              <md-option value="dvd">DvD</md-option>
              <md-option value="bluray">Bluray</md-option>
              <md-option value="digital">{{ $ml.get('movie').support_digital }}</md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field>
            <label for="location">{{ $ml.get('location').location }}</label>
            <md-select v-model="movie.location_id" name="location" id="location">
              <md-option v-for="(location, key) in locations" :key="key"
              :value="location.id">{{ location.location }}</md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field>
            <label for="category">{{ $ml.get('category').category }}</label>
            <md-select v-model="movie.category_id" name="category" id="category">
              <md-option v-for="(category, key) in categories" :key="key"
              :value="category.id">{{ category.label }}</md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field :class="getValidationClass('remarks')">
            <label for="remarks">{{ $ml.get('movie').remarks }}</label>
            <md-input name="remarks" id="remarks" v-model="movie.remarks"/>
            <span class="md-error" v-if="!$v.movie.remarks.maxLength">
              {{ $ml.get('movie').remarks_too_long }}
            </span>
          </md-field>
        </div>

      </div>

      <md-button v-if="method === 'create'" type="submit" class="md-accent">
        {{ $ml.get('movie').create }}
      </md-button>
      <md-button v-if="method === 'modify'" type="submit" class="md-accent">
        {{ $ml.get('movie').edit }}
      </md-button>
      <md-button v-if="method === 'modify'" @click="deleteMovie" class="md-primary">
        {{ $ml.get('movie').delete }}
      </md-button>
    </form>

  <md-snackbar :md-active.sync="errored">
     <span>{{ $ml.get('error').form_error.movie }}</span>
   </md-snackbar>

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
    }
  },
  watch: {
    supports() {
      const mapping = {
        dvd: 'is_dvd',
        bluray: 'is_bluray',
        digital: 'is_digital',
      };
      const vars = ['is_dvd', 'is_bluray', 'is_digital'];
      vars.forEach((element) => { this.movie[element] = false; });
      this.supports.forEach((support) => { this.movie[mapping[support]] = true; });
    },
  },
  data() {
    return {
      movie: {},
      environment: process.env.NODE_ENV,
      supports: [],
      errored: false,
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
      french_title: {
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
    locations: Array,
    categories: Array,
  },
  methods: {
    deleteMovie() {
      axios({
        method: 'delete',
        url: `${this.apiBaseUrl}/movies/${this.movie.id}`,
        headers: this.buildHeaders(),
      })
        .then(() => this.$emit('movie-added-or-modified'))
        .catch((error) => {
          this.errored = true;
          console.error(error);
        });
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
        .catch((error) => {
          this.errored = true;
          console.error(error);
        });
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
