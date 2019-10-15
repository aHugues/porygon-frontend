<template>
  <div class="categories">
   <md-empty-state
    v-if="categories.length == 0 && !showDialog"
    md-icon="category"
    md-label="Create your first category"
    md-description="Creating category, you'll be able to better organize movies and series.">
    <md-button @click="newCategory()" class="md-primary md-raised">
      Create your first category
    </md-button>
   </md-empty-state>

   <div class="edit-form-wrapper" v-if="showDialog">
      <category-form
      :method="dialogMethod" :id="currentId" :currentLabel="currentLabel"
      :currentDescription="currentDescription"
      @category-added-or-modified="fetchData(); showDialog = false;"
      ></category-form>
   </div>

  <div v-if="categories.length > 0 && showDialog" class="divider-wrapper">
    <md-divider></md-divider>
  </div>

   <div class="md-layout" v-if="categories.length > 0">
     <div
      v-for="(category, key) in categories" :key="key"
      @click="editCategory(category.id, category.label, category.description)"
      class="md-layout-item md-large-size-20 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
      <category
      :id="category.id"
      :label="category.label"
      :description="category.description"
      :selected="category.id == currentId">
      </category>
     </div>
   </div>

   <div class="add-button-wrapper" v-if="categories.length > 0">
     <md-button class="md-fab md-primary" @click="newCategory()">
       <md-icon>add</md-icon>
     </md-button>
   </div>
  </div>
</template>

<script>

import axios from 'axios';
import Category from '@/components/category/Category.vue';
import CategoryForm from '@/components/category/CategoryForm.vue';
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
      showDialog: false,
      dialogMethod: 'create',
      currentId: -1,
      currentLabel: '',
      currentDescription: '',
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
    newCategory() {
      this.dialogMethod = 'create';
      this.showDialog = true;
    },
    editCategory(id, label, description) {
      if (id === this.currentId) {
        this.showDialog = false;
        this.currentId = -1;
      } else {
        this.dialogMethod = 'modify';
        this.currentId = id;
        this.currentLabel = label;
        this.currentDescription = description;
        this.showDialog = true;
      }
    },
  },
  components: {
    Category,
    CategoryForm,
  },
};
</script>

<style lang="scss" scoped>
.add-button-wrapper {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 10;
}
.md-dialog-alert {
  background-color: var(--md-theme-default-background, #fff);
}
.divider-wrapper {
  margin-top: 18px;
  margin-bottom: 10px;
}
</style>
