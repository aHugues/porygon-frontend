<template>
<div class="serie-edit-form">
    <form novalidate @submit.prevent="validateSerie">
      <div class="md-layout md-gutter">

        <div class="md-layout-item md-size-100">
          <md-field :class="getValidationClass('title')">
            <label for="title">Title</label>
            <md-input name="title" id="title" v-model="serie.title"/>
            <span class="md-error" v-if="!$v.serie.title.required">The title is required</span>
            <span class="md-error" v-if="!$v.serie.title.maxLength">The title is too long</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-50 md-small-size-100">
          <md-field :class="getValidationClass('season')">
            <label for="season">Season</label>
            <md-input name="season" id="season" v-model="serie.season"/>
            <span class="md-error" v-if="!$v.serie.season.integer">
              The season should be a number
            </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-50 md-small-size-100">
          <md-field :class="getValidationClass('episodes')">
            <label for="episodes">Number of episodes</label>
            <md-input name="episodes" id="episodes" v-model="serie.episodes"/>
            <span class="md-error" v-if="!$v.serie.episodes.integer">
              The number of episodes should be a number
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
            <md-select v-model="serie.location_id" name="location" id="location">
              <md-option v-for="(location, key) in locations" :key="key"
              :value="location.id">{{ location.location }}</md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field>
            <label for="category">Category</label>
            <md-select v-model="serie.category_id" name="category" id="category">
              <md-option v-for="(category, key) in categories" :key="key"
              :value="category.id">{{ category.label }}</md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field :class="getValidationClass('remarks')">
            <label for="remarks">Remarks</label>
            <md-input name="remarks" id="remarks" v-model="serie.remarks"/>
            <span class="md-error" v-if="!$v.serie.remarks.maxLength">
              The remarks are too long
            </span>
          </md-field>
        </div>

      </div>

      <md-button v-if="method === 'create'" type="submit" class="md-accent">
        Create serie
      </md-button>
      <md-button v-if="method === 'modify'" type="submit" class="md-accent">
        Edit serie
      </md-button>
      <md-button v-if="method === 'modify'" @click="deleteSerie" class="md-primary">
        Delete serie
      </md-button>
    </form>
</div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
  required, maxLength, integer,
} from 'vuelidate/lib/validators';
import axios from 'axios';
import config from '../../config';

export default {
  name: 'SerieForm',
  mixins: [validationMixin],
  mounted() {
    if (this.method === 'modify') {
      this.serie = this.currentSerie;
      const mapping = {
        is_dvd: 'dvd',
        is_bluray: 'bluray',
        is_digital: 'digital',
      };
      Object.keys(mapping).forEach((key) => {
        if (this.serie[key]) {
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
      vars.forEach((element) => { this.serie[element] = false; });
      this.supports.forEach((support) => { this.serie[mapping[support]] = true; });
    },
  },
  data() {
    return {
      serie: {},
      environment: process.env.NODE_ENV,
      supports: [],
    };
  },
  computed: {
    apiBaseUrl() { return config[this.environment].porygonApiBaseUrl; },
    authenticationRequired() { return config[this.environment].porygonApiAuthentication; },
  },
  validations: {
    serie: {
      title: {
        required,
        maxLength: maxLength(128),
      },
      season: {
        integer,
      },
      episodes: {
        integer,
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
    currentSerie: Object,
    locations: Array,
    categories: Array,
  },
  methods: {
    deleteSerie() {
      axios({
        method: 'delete',
        url: `${this.apiBaseUrl}/series/${this.serie.id}`,
        headers: this.buildHeaders(),
      })
        .then(() => this.$emit('serie-added-or-modified'))
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
      const field = this.$v.serie[fieldName];
      let returnedClass = {};

      if (field) {
        returnedClass = {
          'md-invalid': field.$invalid && field.$dirty,
        };
      }

      return returnedClass;
    },
    saveSerie() {
      const method = (this.method === 'create') ? 'post' : 'put';
      const urlId = (this.method === 'modify') ? `/${this.serie.id}` : '';
      axios({
        method,
        url: `${this.apiBaseUrl}/series${urlId}`,
        headers: this.buildHeaders(),
        data: this.serie,
      })
        .then(() => this.$emit('serie-added-or-modified'))
        .catch(error => console.error(error));
    },
    validateSerie() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.saveSerie();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.serie-edit-form {
  width: 90%;
  margin: auto;
}
</style>
