<template>
<div>
  <md-card>
    <form novalidate @submit.prevent="validateLocation">
    <md-card-header>
      <div v-if="method === 'create'" class="md-title">Create Location</div>
      <div v-if="method === 'modify'" class="md-title">Edit Location</div>
    </md-card-header>

    <md-card-content>


      <md-field :class="getValidationClass('location')">
        <label for="location">Location</label>
        <md-input name="location" id="location" v-model="location"/>
        <span class="md-error" v-if="!$v.location.required">The label is required</span>
        <span class="md-error" v-if="!$v.location.maxLength">The label is too long</span>
      </md-field>

      <md-switch name="physical" id="physical" v-model="physical">Physical Location</md-switch>

    </md-card-content>

    <md-card-actions>
      <md-button v-if="method === 'modify'" @click="deleteLocation" class="md-primary">
        Delete location
      </md-button>
      <md-button v-if="method === 'create'" type="submit" class="md-accent">
        Create location
      </md-button>
      <md-button v-if="method === 'modify'" type="submit" class="md-accent">
        Edit location
      </md-button>
    </md-card-actions>
    </form>
  </md-card>

</div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, maxLength } from 'vuelidate/lib/validators';
import axios from 'axios';
import config from '../../config';

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
    };
  },
  computed: {
    apiBaseUrl() { return config[this.environment].porygonApiBaseUrl; },
    authenticationRequired() { return config[this.environment].porygonApiAuthentication; },
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
      validator: value => ['create', 'modify'].indexOf(value) !== -1,
    },
    id: Number,
    currentLocation: String,
    currentPhysical: Boolean,
  },
  methods: {
    deleteLocation() {
      axios({
        method: 'delete',
        url: `${this.apiBaseUrl}/locations/${this.id}`,
        headers: this.buildHeaders(),
      })
        .then(() => this.$emit('location-added-or-modified'))
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
      axios({
        method,
        url: `${this.apiBaseUrl}/locations${urlId}`,
        headers: this.buildHeaders(),
        data: {
          location: this.location,
          is_physical: this.physical,
        },
      })
        .then(() => this.$emit('location-added-or-modified'))
        .catch(error => console.error(error));
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
