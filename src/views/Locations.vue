<template>
  <div class="locations">

    <div v-if="state === State.LOADING" class="loader">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>

    <empty-page
      v-if="state === State.EMPTY"
      resource="location" :action="true"
      @resource-created="newLocation()">
    </empty-page>

    <error-state
      v-if="state === State.ERRORED" resource="location"
      @reload-page="reloadPage()">
    </error-state>

   <div class="edit-form-wrapper" v-if="state === State.EDIT">
      <div class="close-button-wrapper">
        <md-button class="md-icon-button" @click="closeEdit()">
          <md-icon>close</md-icon>
        </md-button>
      </div>
      <location-form
      :method="dialogMethod" :id="currentId" :currentLocation="currentLocation"
      :currentPhysical="currentPhysical"
      @location-added-or-modified="fetchData()">
      </location-form>
    </div>

  <div v-if="state === State.EDIT && locations.length > 0" class="divider-wrapper">
    <md-divider></md-divider>
  </div>

    <div class="md-layout" v-if="state === State.OK || state === State.EDIT">
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

    <div class="add-button-wrapper" v-if="state === State.OK">
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
  name: 'LocationsView',
  data() {
    return {
      locations: [],
      dialogMethod: 'create',
      currentId: -1,
      currentLocation: '',
      currentPhysical: true,
      errorDisplayed: false,
      resource: 'locations_list',
      State,
      state: State.LOADING,
    };
  },
  methods: {
    fetchData() {
      axios
        .get(requests.buildUrl('locations'), requests.buildOptions())
        .then((response) => {
          if (response) {
            this.locations = response.data;
            this.state = this.locations.length === 0 ? State.EMPTY : State.OK;
          }
        })
        .catch(() => {
          this.errorDisplayed = true;
          this.locations = [];
          this.state = this.State.ERRORED;
        });
    },
    newLocation() {
      this.dialogMethod = 'create';
      this.state = State.EDIT;
    },
    reloadPage() {
      this.$router.go();
    },
    closeEdit() {
      this.state = this.locations.length === 0 ? State.EMPTY : State.OK;
      this.currentId = -1;
    },
    editLocation(id, location, physical) {
      // unselect if already selected
      if (id === this.currentId) {
        this.closeEdit();
      } else {
        this.dialogMethod = 'modify';
        this.currentId = id;
        this.currentLocation = location;
        this.currentPhysical = physical;
        this.state = State.EDIT;
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
