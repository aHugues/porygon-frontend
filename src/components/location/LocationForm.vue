<template>
<div>
  <md-card>
    <form novalidate @submit.prevent="validateLocation">
    <md-card-header>
      <div v-if="method === 'create'" class="md-title">{{ $ml.get('location').create }}</div>
      <div v-if="method === 'modify'" class="md-title">{{ $ml.get('location').edit }}</div>
    </md-card-header>

    <md-card-content>

      <md-field :class="getValidationClass('location')">
        <label for="location">{{ $ml.get('location').location }}</label>
        <md-input name="location" id="location" v-model="location"/>
        <span class="md-error" v-if="!$v.location.required">
          {{ $ml.get('location').location_required }}
        </span>
        <span class="md-error" v-if="!$v.location.maxLength">
          {{ $ml.get('location').location_too_long }}
        </span>
      </md-field>

      <md-switch name="physical" id="physical" v-model="physical">
        {{ $ml.get('location').physical_location }}
      </md-switch>

    </md-card-content>

    <md-card-actions>
      <md-button v-if="method === 'modify'" @click="deleteLocation" class="md-primary">
        {{ $ml.get('location').delete }}
      </md-button>
      <md-button v-if="method === 'create'" type="submit" class="md-accent">
        {{ $ml.get('location').create }}
      </md-button>
      <md-button v-if="method === 'modify'" type="submit" class="md-accent">
        {{ $ml.get('location').edit }}
      </md-button>
    </md-card-actions>
    </form>
  </md-card>

  <md-snackbar :md-active.sync="errored">
     <span>{{ $ml.get('error').form_error.location }}</span>
   </md-snackbar>

</div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, maxLength } from 'vuelidate/lib/validators';
import axios from 'axios';
import requests from '../../utils/requests';

export default {
  name: 'LocationForm',
  mixins: [validationMixin],
  mounted() {
    if (this.method === 'modify') {
      this.location = this.currentLocation;
      this.physical = this.currentPhysical;
    }
  },
  watch: {
    currentLocation(newLocation) {
      this.location = newLocation;
    },
    currentPhysical(newPhysical) {
      this.physical = newPhysical;
    },
  },
  data() {
    return {
      location: '',
      physical: true,
      environment: process.env.NODE_ENV,
      errored: false,
    };
  },
  validations: {
    location: {
      required,
      maxLength: maxLength(32),
    },
    physical: {
      required,
    },
  },
  props: {
    method: {
      type: String,
      required: true,
      validator: (value) => ['create', 'modify'].indexOf(value) !== -1,
    },
    id: Number,
    currentLocation: String,
    currentPhysical: Boolean,
  },
  methods: {
    deleteLocation() {
      const options = requests.buildOptions();
      axios({
        method: 'delete',
        url: requests.buildUrl(`locations/${this.id}`),
        withCredentials: options.withCredentials,
        headers: options.headers,
      })
        .then(() => this.$emit('location-added-or-modified'))
        .catch((error) => {
          this.errored = true;
          console.error(error);
        });
    },
    getValidationClass(fieldName) {
      const field = this.$v[fieldName];
      let returnedClass = {};

      if (field) {
        returnedClass = {
          'md-invalid': field.$invalid && field.$dirty,
        };
      }

      return returnedClass;
    },
    saveLocation() {
      const method = (this.method === 'create') ? 'post' : 'put';
      const urlId = (this.method === 'modify') ? `/${this.id}` : '';
      const options = requests.buildOptions();
      axios({
        method,
        url: requests.buildUrl(`locations${urlId}`),
        headers: options.headers,
        withCredentials: options.withCredentials,
        data: {
          location: this.location,
          is_physical: this.physical,
        },
      })
        .then(() => this.$emit('location-added-or-modified'))
        .catch((error) => {
          this.errored = true;
          console.error(error);
        });
    },
    validateLocation() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.saveLocation();
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
