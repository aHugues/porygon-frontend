<template>
  <md-card>
    <md-card-header>
      <div class="md-title">
        {{ capitalizedResource }} by location
      </div>
    </md-card-header>
    <md-card-content>
      <div class="graph-wrapper">
        <svg height="200" width="100%">
          <g
            v-for="c in packChart" :key="c.id"
            :transform="`translate(${c.x}, ${c.y})`"
          >
            <circle :r="c.r" :fill="c.fill" :stroke="c.stroke"></circle>
            <text
              dy=".2em" :fill="textColor" class="location-label"
              :font-size="c.r/3"
            >
              {{c.title}}
            </text>
            <text
              dy="1.3em" :fill="textColor" class="location-label"
              :font-size="c.r/3"
            >
              {{c.value}} {{resource}}
            </text>
          </g>
        </svg>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>
import axios from 'axios';
import * as d3 from 'd3';
import requests from '../../utils/requests';

export default {
  name: 'StatsLocation',
  data() {
    return {
      dataset: { children: [] },
    };
  },
  props: {
    resource: String,
  },
  mounted() {
    this.getData();
  },
  computed: {
    packData() {
      return d3.hierarchy(this.dataset).sum((d) => d.count);
    },
    textColor() {
      return '#212121';
    },
    capitalizedResource() {
      return `${this.resource.charAt(0).toUpperCase()}${this.resource.substring(1)}`;
    },
    packChart() {
      const diameter = 200;
      const color = d3.scaleOrdinal(d3.schemePaired);
      const packChart = d3.pack();
      packChart.size([diameter, diameter]);
      packChart.padding(1.5);
      const output = packChart(this.packData).descendants();
      if (this.dataset.children.length === 0) return [];
      return output
        .filter((d) => !d.children)
        .filter((d) => d.r > 0)
        .map((d, i) => {
          const fill = color(i);
          return {
            id: i + 1,
            title: d.data.location,
            value: d.data.count,
            r: d.r,
            x: d.x,
            y: d.y,
            fill,
            stroke: 'grey',
          };
        });
    },
  },
  methods: {
    getData() {
      axios.get(requests.buildUrl('locations/count'), requests.buildOptions())
        .then((response) => {
          this.dataset.children = response.data.map((value) => ({
            location: value.location,
            count: this.resource === 'movies' ? value.movie_count : value.serie_count,
          }));
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style lang="scss" scoped>
.graph-wrapper {
  width: 80%;
  margin: auto;
}

.location-label {
  text-anchor: middle;
}
</style>
