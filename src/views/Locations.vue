<template>
  <div class="locations">

    <div v-if="loading" class="loader">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>

    <empty-page
      v-if="!loading && locations.length == 0 && !showDialog && !errored"
      resource="location" :action="true"
      @resource-created="newLocation()">
    </empty-page>

    <error-state v-if="errored" resource="location" @reload-page="reloadPage()"></error-state>

   <div class="edit-form-wrapper" v-if="showDialog && !errored">
      <div class="close-button-wrapper">
        <md-button class="md-icon-button" @click="showDialog = false; currentId = -1">
          <md-icon>close</md-icon>
        </md-button>
      </div>
      <location-form
      :method="dialogMethod" :id="currentId" :currentLocation="currentLocation"
      :currentPhysical="currentPhysical"
      @location-added-or-modified="fetchData(); showDialog = false;"
      ></location-form>
   </div>

  <div v-if="!loading && locations.length > 0 && showDialog" class="divider-wrapper">
    <md-divider></md-divider>
  </div>


    <div class="md-layout" v-if="!loading && locations.length > 0 && !errored">
     <div
      v-for="(location, key) in locations" :key="key"
      @click="editLocation(location.id, location.location, Boolean(location.is_physical))"
      class="md-layout-item md-large-size-33
      md-medium-size-50 md-small-size-100 md-xsmall-size-100">
      <location
      :id="location.id"
      :location="location.location"
      :physical="Boolean(location.is_physical)"
      :selected="location.id == currentId">
      </location>
     </div>
   </div>

    <div class="add-button-wrapper" v-if="!loading && locations.length > 0 && !errored">
     <md-button class="md-fab md-primary" @click="newLocation()">
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
import Location from '@/components/location/Location.vue';
import LocationForm from '@/components/location/LocationForm.vue';
import config from '../config';


export default {
  mounted() {
    this.fetchData();
  },
  name: 'LocationsView',
  data() {
    return {
      locations: [],
      environment: process.env.NODE_ENV,
      showDialog: false,
      dialogMethod: 'create',
      currentId: -1,
      currentLocation: '',
      currentPhysical: true,
      loading: true,
      errorDisplayed: false,
      errored: false,
      resource: 'locations_list',
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
        .get(`${this.apiBaseUrl}/locations`, {
          headers: this.buildHeaders(),
          withCredentials: true,
        })
        .catch(() => {
          this.errored = true;
          this.errorDisplayed = true;
          this.locations = [];
          this.loading = false;
        })
        .then((response) => {
          if (response) {
            this.locations = response.data;
            this.loading = false;
          }
        });
    },
    newLocation() {
      this.dialogMethod = 'create';
      this.showDialog = true;
    },
    reloadPage() {
      this.$router.go();
    },
    editLocation(id, location, physical) {
      // unselect if already selected
      if (id === this.currentId) {
        this.showDialog = false;
        this.currentId = -1;
      } else {
        this.dialogMethod = 'modify';
        this.currentId = id;
        this.currentLocation = location;
        this.currentPhysical = physical;
        this.showDialog = true;
      }
    },
  },
  components: {
    Location,
    LocationForm,
    EmptyPage,
    ErrorState,
  },
};
</script>

<style lang="scss" scoped>

.close-button-wrapper {
  position: absolute;
  top: 5px;
  right: 15px;
}

.edit-form-wrapper {
  position: relative;
}

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

.loader {
  text-align: center;
  width: 100%;
  height: 100%;
  padding-top: 30%;
}
</style>
