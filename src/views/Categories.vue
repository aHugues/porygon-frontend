<template>
  <div class="categories">
   <md-empty-state
    md-icon="category"
    md-label="Create your first category"
    md-description="Creating category, you'll be able to better organize movies and series.">
    <md-button class="md-primary md-raised">Create your first category</md-button>
   </md-empty-state>

  <category v-for="(category, key) in categories" :key="key" :id="category.id" :label="category.label"></category>
  </div>
</template>

<script>

import axios from 'axios';
import Category from '@/components/category/Category.vue';

export default {
  mounted() {
    this.fetchData();
  },
  name: 'CategoriesView',
  data: () => ({
    categories: {},
  }),
  methods: {
    fetchData() {
      axios
        .get('http://localhost:4000/api/v1/categories')
        .then((response) => { this.categories = response.data; });
    },
  },
  components: {
    Category,
  },
};
</script>
