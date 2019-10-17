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
      menu: {
        dev_version: 'Development version',
        dark_theme: 'Dark theme',
        languages: 'Languages',
        account: 'Account',
        logout: 'Logout',
      },
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
      menu: {
        dev_version: 'Version de développement',
        dark_theme: 'Thème sombre',
        languages: 'Langues',
        account: 'Profil',
        logout: 'Déconnexion',
      },
    }),
  ],
});
