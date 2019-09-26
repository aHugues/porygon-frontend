<template>
  <div class="categories">
   <md-empty-state
    v-if="categories.length == 0"
    md-icon="category"
    md-label="Create your first category"
    md-description="Creating category, you'll be able to better organize movies and series.">
    <md-button class="md-primary md-raised">Create your first category</md-button>
   </md-empty-state>

   <div class="md-layout" v-if="categories.length > 0">
     <div
      v-for="(category, key) in categories" :key="key"
      class="md-layout-item md-large-size-20 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
      <category
      :id="category.id"
      :label="category.label">
      </category>
     </div>
   </div>

   <div class="add-button-wrapper" v-if="categories.length > 0">
     <md-button class="md-fab md-primary">
       <md-icon>add</md-icon>
     </md-button>
   </div>
  </div>
</template>

<script>

import axios from 'axios';
import Category from '@/components/category/Category.vue';
import config from '../config';

export default {
  mounted() {
    this.fetchData();
  },
  name: 'CategoriesView',
  data() {
    return {
      categories: [],
      environment: process.env.NODE_ENV,
    };
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
        .get(`${this.apiBaseUrl}/categories`, {
          headers: this.buildHeaders(),
        })
        .then((response) => { this.categories = response.data; });
    },
  },
  components: {
    Category,
  },
};
</script>

<style lang="scss" scoped>
.add-button-wrapper {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 99;
}
</style>
