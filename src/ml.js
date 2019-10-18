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
      category: {
        undefined: 'Undefined category',
        label: 'Label',
        description: 'Description',
        edit: 'Edit category',
        delete: 'Delete category',
        create: 'Create category',
        empty_button: 'Create your first category',
        empty_description: "Creating category, you'll be able to better organize movies and series.",
        label_required: 'The label is required',
        label_too_long: 'The label is too long',
      },
      location: {
        location: 'Location',
        physical_location: 'Physical location',
        edit: 'Edit location',
        delete: 'Delete location',
        create: 'Create location',
        empty_button: 'Create your first location',
        empty_description: "Creating locations, you'll be able to store and order movies and series.",
        location_required: 'The location is required',
        location_too_long: 'The location is too long',
      },
      home: {
        title: 'Nothing here',
        subtitle: 'Work in progress.',
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
      category: {
        undefined: 'Catégorie non définie',
        label: 'Label',
        description: 'Description',
        edit: 'Éditer catégorie',
        delete: 'Supprimer catégorie',
        create: 'Créer catégorie',
        empty_button: 'Créez votre première catégorie',
        empty_description: 'En créant des catégories, vous pourrez mieux organiser vos films et séries.',
        label_required: 'Le label est requis',
        label_too_long: 'Le label est trop long',
      },
      location: {
        location: 'Emplacement',
        physical_location: 'Emplacement physique',
        edit: 'Éditer emplacement',
        delete: 'Supprimer emplacement',
        create: 'Créer emplacement',
        empty_button: 'Ajouter un premier emplacement',
        empty_description: 'En ajoutant des emplacements, vous pourrez y stocker des films et séries.',
        location_required: "L'emplacement est requis",
        location_too_long: "L'emplacement est trop long",
      },
      home: {
        title: 'Cette page est vide',
        subtitle: 'Développement en cours.',
      },
    }),
  ],
});
