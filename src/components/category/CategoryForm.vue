<template>
<div>
  <md-card>
    <form novalidate @submit.prevent="validateCategory">
    <md-card-header>
      <div v-if="method === 'create'" class="md-title">{{ $ml.get('category').create }}</div>
      <div v-if="method === 'modify'" class="md-title">{{ $ml.get('category').edit }}</div>
    </md-card-header>

    <md-card-content>


      <md-field :class="getValidationClass('label')">
        <label for="label">{{ $ml.get('category').label }}</label>
        <md-input name="label" id="label" v-model="label"/>
        <span class="md-error" v-if="!$v.label.required">
          {{ $ml.get('category').label_required }}
        </span>
        <span class="md-error" v-if="!$v.label.maxLength">
          {{ $ml.get('category').label_too_long }}
        </span>
      </md-field>

      <md-field :class="getValidationClass('description')">
        <label for="description">{{ $ml.get('category').description }}</label>
        <md-input name="description" id="description" v-model="description"/>
      </md-field>

    </md-card-content>

    <md-card-actions>
      <md-button v-if="method === 'modify'" @click="deleteCategory" class="md-primary">
        {{ $ml.get('category').delete }}
      </md-button>
      <md-button v-if="method === 'create'" type="submit" class="md-accent">
        {{ $ml.get('category').create }}
      </md-button>
      <md-button v-if="method === 'modify'" type="submit" class="md-accent">
        {{ $ml.get('category').edit }}
      </md-button>
    </md-card-actions>
    </form>
  </md-card>

    <md-snackbar :md-active.sync="errored">
     <span>{{ $ml.get('error').form_error.category }}</span>
   </md-snackbar>

</div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, maxLength } from 'vuelidate/lib/validators';
import axios from 'axios';
import requests from '../../utils/requests';

export default {
  name: 'CategoryForm',
  mixins: [validationMixin],
  mounted() {
    if (this.method === 'modify') {
      this.label = this.currentLabel;
      this.description = this.currentDescription;
    }
  },
  watch: {
    currentLabel(newLabel) {
      this.label = newLabel;
    },
    currentDescription(newDescription) {
      this.description = newDescription;
    },
  },
  data() {
    return {
      label: '',
      description: '',
      errored: false,
    };
  },
  validations: {
    label: {
      required,
      maxLength: maxLength(32),
    },
    description: {},
  },
  props: {
    method: {
      type: String,
      required: true,
      validator: value => ['create', 'modify'].indexOf(value) !== -1,
    },
    id: Number,
    currentLabel: String,
    currentDescription: String,
  },
  methods: {
    deleteCategory() {
      const options = requests.buildOptions();
      axios({
        method: 'delete',
        url: requests.buildUrl(`categories/${this.id}`),
        headers: options.headers,
        withCredentials: options.withCredentials,
      })
        .then(() => this.$emit('category-added-or-modified'))
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
    saveCategory() {
      const method = (this.method === 'create') ? 'post' : 'put';
      const urlId = (this.method === 'modify') ? `/${this.id}` : '';
      const options = requests.buildOptions();
      axios({
        method,
        url: requests.buildUrl(`categories${urlId}`),
        withCredentials: options.withCredentials,
        headers: options.headers,
        data: {
          label: this.label,
          description: this.description,
        },
      })
        .then(() => this.$emit('category-added-or-modified'))
        .catch((error) => {
          console.error(error);
          this.errored = true;
        });
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
