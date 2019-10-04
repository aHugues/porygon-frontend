<template>
  <div class="locations">
   <md-empty-state
    v-if="locations.length == 0 && !showDialog"
    md-icon="folder"
    md-label="Create your first location"
    md-description="Creating locations, you'll be able to store and order movies and series.">
    <md-button @click="newLocation()" class="md-primary md-raised">Create your first location</md-button>
   </md-empty-state>

   <div class="edit-form-wrapper" v-if="showDialog">
      <location-form
      :method="dialogMethod" :id="currentId" :currentLocation="currentLocation"
      :currentPhysical="currentPhysical"
      @location-added-or-modified="fetchData(); showDialog = false;"
      ></location-form>
   </div>

  <div v-if="locations.length > 0 && showDialog" class="divider-wrapper">
    <md-divider></md-divider>
  </div>


    <div class="md-layout" v-if="locations.length > 0">
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

    <div class="add-button-wrapper" v-if="locations.length > 0">
     <md-button class="md-fab md-primary" @click="newLocation()">
       <md-icon>add</md-icon>
     </md-button>
   </div>

  </div>
</template>

<script>

import axios from 'axios';
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
        })
        .then((response) => { this.locations = response.data; });
    },
    newLocation() {
      this.dialogMethod = 'create';
      this.showDialog = true;
    },
    editLocation(id, location, physical) {
      this.dialogMethod = 'modify';
      this.currentId = id;
      this.currentLocation = location;
      this.currentPhysical = physical;
      this.showDialog = true;
    },
  },
  components: {
    Location,
    LocationForm,
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
