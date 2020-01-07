<template>
  <div class="categories">

    <div v-if="loading" class="loader">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>

    <empty-page
      v-if="!loading && categories.length == 0 && !showDialog && !errored"
      resource="category" :action="true"
      @resource-created="newCategory()">
    </empty-page>

<error-state v-if="errored" resource="category" @reload-page="reloadPage()"></error-state>

   <div class="edit-form-wrapper" v-if="!loading && showDialog && !errored">
      <div class="close-button-wrapper">
        <md-button class="md-icon-button" @click="showDialog = false; currentId = -1">
          <md-icon>close</md-icon>
        </md-button>
      </div>
      <category-form
      :method="dialogMethod" :id="currentId" :currentLabel="currentLabel"
      :currentDescription="currentDescription"
      @category-added-or-modified="fetchData(); showDialog = false;"
      ></category-form>
   </div>

  <div v-if="!loading && categories.length > 0 && showDialog && !errored" class="divider-wrapper">
    <md-divider></md-divider>
  </div>

   <div class="md-layout" v-if="!loading && categories.length > 0 && !errored">
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

   <div class="add-button-wrapper" v-if="!loading && categories.length > 0 && !errored">
     <md-button class="md-fab md-primary" @click="newCategory()">
       <md-icon>add</md-icon>
     </md-button>
   </div>

  <md-snackbar :md-active.sync="errorDisplayed">
     <span>{{ $ml.get('error').resources[resource] }}</span>
   </md-snackbar>

  </div>
</template>

<script>

import axios from 'axios';
import EmptyPage from '@/components/misc/EmptyPage.vue';
import ErrorState from '@/components/misc/ErrorState.vue';
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
      loading: true,
      errorDisplayed: false,
      errored: false,
      resource: 'categories_list',
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
          withCredentials: true,
        })
        .catch(() => {
          this.errored = true;
          this.errorDisplayed = true;
          this.categories = [];
          this.loading = false;
        })
        .then((response) => {
          if (response) {
            this.categories = response.data;
            this.loading = false;
          }
        });
    },
    newCategory() {
      this.dialogMethod = 'create';
      this.showDialog = true;
    },
    reloadPage() {
      this.$router.go();
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
    EmptyPage,
    ErrorState,
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

.close-button-wrapper {
  position: absolute;
  top: 5px;
  right: 15px;
}

.edit-form-wrapper {
  position: relative;
}

.md-dialog-alert {
  background-color: var(--md-theme-default-background, #fff);
}
.divider-wrapper {
  margin-top: 18px;
  margin-bottom: 10px;
}

.loader {
  text-align: center;
  width: 100%;
  height: 100%;
  padding-top: 30%;
}
</style>
