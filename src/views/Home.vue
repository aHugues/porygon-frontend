<template>
  <div class="md-layout home">
    <div class="md-layout-item md-size-40">
      <api-check></api-check>
    </div>
    <div class="md-layout-item md-size-60 md-layout">
      <div class="md-layout-item md-size-25">
        <stat-card resourceName="movies" :resourceValue="movieCount"></stat-card>
      </div>
      <div class="md-layout-item md-size-25">
        <stat-card resourceName="series" :resourceValue="serieCount"></stat-card>
      </div>
      <div class="md-layout-item md-size-25">
        <stat-card resourceName="locations" :resourceValue="locationCount"></stat-card>
      </div>
      <div class="md-layout-item md-size-25">
        <stat-card resourceName="categories" :resourceValue="categoryCount"></stat-card>
      </div>
    </div>
    <div class="md-layout-item md-size-33">
      <stats-location resource="movies"></stats-location>
    </div>
    <div class="md-layout-item md-size-33">
      <stats-location resource="series"></stats-location>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import ApiCheck from '@/components/misc/ApiCheck.vue';
import StatCard from '@/components/misc/StatCard.vue';
import StatsLocation from '@/components/misc/StatsLocation.vue';
import requests from '../utils/requests';

export default {
  name: 'home',
  data() {
    return {
      movieCount: 0,
      serieCount: 0,
      locationCount: 0,
      categoryCount: 0,
    };
  },
  mounted() {
    this.getStats();
  },
  methods: {
    getStats() {
      axios.get(requests.buildUrl('stats'), requests.buildOptions())
        .then((response) => {
          this.movieCount = response.data.movie_count;
          this.serieCount = response.data.serie_count;
          this.locationCount = response.data.location_count;
          this.categoryCount = response.data.category_count;
        })
        .catch((error) => { console.error(error); });
    },
  },
  components: {
    ApiCheck,
    StatCard,
    StatsLocation,
  },
};
</script>

<style lang="scss" scoped>

  .check-card {
    width: 40%;
  }

  .stat-card-wrapper {
    width: 60%;
  }

</style>
