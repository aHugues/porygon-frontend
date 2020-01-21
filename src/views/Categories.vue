<template>
  <div class="categories">

    <div v-if="state === State.LOADING" class="loader">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>

    <empty-page
      v-if="state === State.EMPTY"
      resource="category" :action="true"
      @resource-created="newCategory()">
    </empty-page>

    <error-state
      v-if="state === State.ERRORED" resource="category"
      @reload-page="reloadPage()">
    </error-state>

    <div class="edit-form-wrapper" v-if="state === State.EDIT">
      <div class="close-button-wrapper">
        <md-button class="md-icon-button" @click="closeEdit()">
          <md-icon>close</md-icon>
        </md-button>
      </div>
      <category-form
      :method="dialogMethod" :id="currentId" :currentLabel="currentLabel"
      :currentDescription="currentDescription"
      @category-added-or-modified="fetchData()">
      </category-form>
    </div>

  <div v-if="State === State.EDIT && categories.length > 0" class="divider-wrapper">
    <md-divider></md-divider>
  </div>

   <div class="md-layout" v-if="state === State.OK || state === State.EDIT">
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

   <div class="add-button-wrapper" v-if="state === State.OK">
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
import requests from '../utils/requests';

const State = {
  LOADING: 'loading',
  ERRORED: 'errored',
  EMPTY: 'empty',
  OK: 'ok',
  EDIT: 'edit',
};

export default {
  mounted() {
    this.fetchData();
  },
  name: 'CategoriesView',
  data() {
    return {
      categories: [],
      environment: process.env.NODE_ENV,
      dialogMethod: 'create',
      currentId: -1,
      currentLabel: '',
      currentDescription: '',
      errorDisplayed: false,
      resource: 'categories_list',
      State,
      state: State.LOADING,
    };
  },
  methods: {
    fetchData() {
      axios
        .get(requests.buildUrl('categories'), requests.buildOptions())
        .then((response) => {
          if (response) {
            this.categories = response.data;
            this.state = this.categories.length === 0 ? State.EMPTY : State.OK;
          }
        })
        .catch(() => {
          this.errorDisplayed = true;
          this.categories = [];
          this.state = State.ERRORED;
        });
    },
    newCategory() {
      this.dialogMethod = 'create';
      this.state = State.EDIT;
    },
    reloadPage() {
      this.$router.go();
    },
    closeEdit() {
      this.state = this.categories.length === 0 ? State.EMPTY : State.OK;
      this.currentId = -1;
    },
    editCategory(id, label, description) {
      if (id === this.currentId) {
        this.closeEdit();
      } else {
        this.dialogMethod = 'modify';
        this.currentId = id;
        this.currentLabel = label;
        this.currentDescription = description;
        this.state = State.EDIT;
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
