<template>
  <div class="categories">
   <md-empty-state
    v-if="categories.length == 0"
    md-icon="category"
    md-label="Create your first category"
    md-description="Creating category, you'll be able to better organize movies and series.">
    <md-button class="md-primary md-raised">Create your first category</md-button>
   </md-empty-state>

   <div class="md-layout">
     <div v-for="(category, key) in categories" :key="key"  class="md-layout-item">
      <category
      :id="category.id"
      :label="category.label">
      </category>
     </div>
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
      categories: {},
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
