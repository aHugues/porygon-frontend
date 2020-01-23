<template>
<div class="serie-edit-form">

    <resource-warning resource="location" v-if="locations.length === 0"></resource-warning>
    <resource-warning resource="category" v-if="categories.length === 0"></resource-warning>

    <form novalidate @submit.prevent="validateSerie">
      <div class="md-layout md-gutter">

        <div class="md-layout-item md-size-100">
          <md-field :class="getValidationClass('title')">
            <label for="title">{{ $ml.get('serie').title }}</label>
            <md-input name="title" id="title" v-model="serie.title"/>
            <span class="md-error" v-if="!$v.serie.title.required">
              {{ $ml.get('serie').title_required }}
            </span>
            <span class="md-error" v-if="!$v.serie.title.maxLength">
              {{ $ml.get('serie').title_too_long }}
            </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-33 md-small-size-100">
          <md-field :class="getValidationClass('year')">
            <label for="year">{{ $ml.get('serie').year }}</label>
            <md-input name="year" id="year" v-model="serie.year"/>
            <span class="md-error" v-if="!$v.serie.year.required">
              {{ $ml.get('serie').year_required }}
              </span>
            <span class="md-error" v-if="!$v.serie.year.between">
              {{ $ml.get('serie').year_between }}
            </span>
            <span class="md-error" v-if="!$v.serie.year.integer">
              {{ $ml.get('serie').year_integer }}
            </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-33 md-small-size-100">
          <md-field :class="getValidationClass('season')">
            <label for="season">{{ $ml.get('serie').season }}</label>
            <md-input name="season" id="season" v-model="serie.season"/>
            <span class="md-error" v-if="!$v.serie.season.integer">
              {{ $ml.get('serie').season_integer }}
            </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-33 md-small-size-100">
          <md-field :class="getValidationClass('episodes')">
            <label for="episodes">{{ $ml.get('serie').episodes }}</label>
            <md-input name="episodes" id="episodes" v-model="serie.episodes"/>
            <span class="md-error" v-if="!$v.serie.episodes.integer">
              {{ $ml.get('serie').episodes_integer }}
            </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-50 md-small-size-100">
          <md-field>
            <label for="support">{{ $ml.get('serie').supports }}</label>
            <md-select v-model="supports" name="supports" id="supports" multiple>
              <md-option value="dvd">DvD</md-option>
              <md-option value="bluray">Bluray</md-option>
              <md-option value="digital">{{ $ml.get('serie').support_digital }}</md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-50 md-small-size-100">
          <md-field>
            <label for="location">{{ $ml.get('location').location }}</label>
            <md-select v-model="serie.location_id" name="location" id="location">
              <md-option v-for="(location, key) in locations" :key="key"
              :value="location.id">{{ location.location }}</md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field>
            <label for="categories">{{ $ml.get('category').categories }}</label>
            <md-select v-model="serie.categories" name="categories" id="categories" multiple>
              <md-option v-for="(category, key) in categories" :key="key"
              :value="category.id">{{ category.label }}</md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field :class="getValidationClass('remarks')">
            <label for="remarks">{{ $ml.get('serie').remarks }}</label>
            <md-input name="remarks" id="remarks" v-model="serie.remarks"/>
            <span class="md-error" v-if="!$v.serie.remarks.maxLength">
              {{ $ml.get('serie').remarks_too_long }}
            </span>
          </md-field>
        </div>

      </div>

      <md-button v-if="method === 'create'" type="submit" class="md-accent">
        {{ $ml.get('serie').create }}
      </md-button>
      <md-button v-if="method === 'modify'" type="submit" class="md-accent">
        {{ $ml.get('serie').edit }}
      </md-button>
      <md-button v-if="method === 'modify'" @click="deleteSerie" class="md-primary">
        {{ $ml.get('serie').delete }}
      </md-button>
    </form>

    <md-snackbar :md-active.sync="errored">
     <span>{{ $ml.get('error').form_error.serie }}</span>
   </md-snackbar>
</div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
  required, maxLength, integer, between,
} from 'vuelidate/lib/validators';
import axios from 'axios';
import ResourceWarning from '../misc/ResourceWarning.vue';
import requests from '../../utils/requests';

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
      delete this.serie.category_id;
      this.serie.categories = this.serieCategories
        .map(category => category.id)
        .filter(x => x !== null);
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
      supports: [],
      errored: false,
    };
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
      year: {
        required,
        between: between(1910, 2100),
        integer,
      },
      remarks: {
        maxLength: maxLength(255),
      },
    },
  },
  components: {
    ResourceWarning,
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
    serieCategories: Array,
  },
  methods: {
    deleteSerie() {
      const options = requests.buildOptions();
      axios({
        method: 'delete',
        url: requests.buildUrl(`series/${this.serie.id}`),
        headers: options.headers,
        withCredentials: options.withCredentials,
      })
        .then(() => this.$emit('serie-added-or-modified'))
        .catch((error) => {
          this.errored = true;
          console.error(error);
        });
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
      const options = requests.buildOptions();
      delete this.serie.id;
      axios({
        method,
        url: requests.buildUrl(`series${urlId}`),
        headers: options.headers,
        withCredentials: options.withCredentials,
        data: this.serie,
      })
        .then(() => this.$emit('serie-added-or-modified'))
        .catch((error) => {
          this.errored = true;
          console.error(error);
        });
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
