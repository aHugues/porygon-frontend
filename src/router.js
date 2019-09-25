import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Movies from './views/Movies.vue';
import Series from './views/Series.vue';
import Locations from './views/Locations.vue';
import Categories from './views/Categories.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/movies',
      name: 'movies',
      component: Movies,
    },
    {
      path: '/series',
      name: 'series',
      component: Series,
    },
    {
      path: '/locations',
      name: 'locations',
      component: Locations,
    },
    {
      path: '/categories',
      name: 'categories',
      component: Categories,
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
  ],
});
