import Vue from 'vue';
import { MLInstaller, MLCreate, MLanguage } from 'vue-multilanguage';

Vue.use(MLInstaller);

export default new MLCreate({
  initial: 'english',
  save: process.env.NODE_ENV === 'production',
  languages: [
    new MLanguage('english').create({
      navigation: {
        title: 'Navigation',
        home: 'Home',
        movies: 'Movies',
        series: 'Series',
        locations: 'Locations',
        categories: 'Categories',
      },
      test: 'english',
    }),
    new MLanguage('french').create({
      navigation: {
        title: 'Navigation',
        home: 'Accueil',
        movies: 'Films',
        series: 'Séries',
        locations: 'Emplacements',
        categories: 'Catégories',
      },
      test: 'français',
    }),
  ],
});
