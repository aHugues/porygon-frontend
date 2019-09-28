<template>
<div>
  <md-card>
    <form novalidate @submit.prevent="validateCategory">
    <md-card-header>
      <div v-if="method === 'create'" class="md-title">Create category</div>
      <div v-if="method === 'modify'" class="md-title">Edit category</div>
    </md-card-header>

    <md-card-content>


      <md-field :class="getValidationClass('label')">
        <label for="label">Label</label>
        <md-input name="label" id="label" v-model="label"/>
        <span class="md-error" v-if="!$v.label.required">The label is required</span>
        <span class="md-error" v-if="!$v.label.maxLength">The label is too long</span>
      </md-field>

    </md-card-content>

    <md-card-actions>
      <md-button type="submit" class="md-primary">Create category</md-button>
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
  name: 'CategoryForm',
  mixins: [validationMixin],
  mounted() {
    if (this.method === 'modify') {
      this.label = this.currentLabel;
    }
  },
  watch: {
    currentLabel(newLabel) {
      this.label = newLabel;
    },
  },
  data() {
    return {
      label: '',
      environment: process.env.NODE_ENV,
    };
  },
  computed: {
    apiBaseUrl() { return config[this.environment].porygonApiBaseUrl; },
    authenticationRequired() { return config[this.environment].porygonApiAuthentication; },
  },
  validations: {
    label: {
      required,
      maxLength: maxLength(42),
    },
  },
  props: {
    method: {
      type: String,
      required: true,
      validator: value => ['create', 'modify'].indexOf(value) !== -1,
    },
    id: Number,
    currentLabel: String,
  },
  methods: {
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
    saveCategory() {
      const method = (this.method === 'create') ? 'post' : 'put';
      const urlId = (this.method === 'modify') ? `/${this.id}` : '';
      axios({
        method,
        url: `${this.apiBaseUrl}/categories${urlId}`,
        headers: this.buildHeaders(),
        data: {
          label: this.label,
        },
      })
        .then(() => this.$emit('category-added-or-modified'))
        .catch(error => console.error(error));
    },
    validateCategory() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.saveCategory();
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
