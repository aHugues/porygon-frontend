import Vue from 'vue';
import { MLInstaller, MLCreate, MLanguage } from 'vue-multilanguage';

Vue.use(MLInstaller);

export default new MLCreate({
  initial: 'english',
  save: process.env.NODE_ENV === 'production',
  languages: [
    new MLanguage('english').create({
      auth: {
        login: 'Login',
        password: 'Password',
        login_required: 'Login required',
        password_required: 'Password required',
        send_login: 'Login',
      },
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
        light_theme: 'Light Theme',
        theme: 'Theme',
        languages: 'Languages',
        account: 'Account',
        logout: 'Logout',
        theme_selection: 'Select theme',
        language_selection: 'Select language',
      },
      category: {
        category: 'Category',
        categories: 'Categories',
        undefined: 'Undefined category',
        label: 'Label',
        description: 'Description',
        edit: 'Edit category',
        delete: 'Delete category',
        create: 'Create category',
        empty_title: 'Create your first category',
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
        empty_title: 'Create your first location',
        empty_description: "Creating locations, you'll be able to store and order movies and series.",
        location_required: 'The location is required',
        location_too_long: 'The location is too long',
        physical: 'Physical location',
        digital: 'Digital location',
      },
      movie: {
        title: 'Original title',
        french_title: 'French title',
        year: 'Year',
        duration: 'Duration (mins.)',
        director: 'Director',
        actors: 'Actors',
        supports: 'Supports',
        support_digital: 'Digital',
        remarks: 'Remarks',
        edit: 'Edit movie',
        delete: 'Delete movie',
        create: 'Create movie',
        empty_title: 'Create your first movie',
        empty_description: "Creating movies, you'll be able to store and order your movies library.",
        title_required: 'The original title is required',
        title_too_long: 'The original title is too long',
        french_title_too_long: 'The French title is too long',
        year_required: 'The year is required',
        year_between: 'The year should be between 1920 and 2100',
        year_integer: 'The year should be a number',
        duration_required: 'The duration is required',
        duration_between: 'The duration should be between 0 and 600',
        duration_integer: 'The duration should be a number',
        director_too_long: 'The director is too long',
        actors_too_long: 'The actors list is too long',
        remarks_too_long: 'The remarks are too long',
      },
      serie: {
        title: 'Title',
        season: 'Season',
        episodes: 'Number of episodes',
        supports: 'Supports',
        year: 'Year',
        support_digital: 'Digital',
        remarks: 'Remarks',
        edit: 'Edit serie',
        delete: 'Delete serie',
        create: 'Create serie',
        empty_title: 'Create your first serie',
        empty_description: "Creating series, you'll be able to store and order your series library.",
        title_required: 'The title is required',
        title_too_long: 'The title is too long',
        year_required: 'The year is required',
        year_between: 'The year should be between 1920 and 2100',
        year_integer: 'The year should be a number',
        season_integer: 'The season should be a number',
        episodes_integer: 'The number of episodes should be a number',
        remarks_too_long: 'The remarks are too long',
      },
      home: {
        empty_title: 'Nothing here',
        empty_description: 'Work in progress.',
        status_check: {
          waiting: 'Status check pending...',
          version_ok: 'Version {0}: OK',
          version_error: 'Expecting min version {0} but found version {1}',
          version_checking_error: 'Impossible to get version from the server.',
        },
      },
      error: {
        reload_button: 'Reload page',
        errored_description: 'An error has occured during loading. Please reload this page.',
        auth: 'An error has occured during authentication. Please reload this page.',
        login_error: 'Invalid username or password',
        empty_category: 'No category are present in the database. you should create at least one before continuing.',
        empty_location: 'No location are present in the database. you should create at least one before continuing.',
        resources: {
          movies_list: 'Error loading movies list from the server',
          series_list: 'Error loading series list from the server',
          locations_list: 'Error loading locations list from the server',
          categories_list: 'Error loading categories list from the server',
        },
        form_error: {
          category: 'Error adding or modifying category',
          location: 'Error adding or modifying location',
          movie: 'Error adding or modifying movie',
          serie: 'Error adding or modifying serie',
        },
      },
    }),
    new MLanguage('french').create({
      auth: {
        login: 'Utilisateur',
        password: 'Mot de passe',
        login_required: 'Utilisateur required',
        password_required: 'Mot de passe requis',
        send_login: 'Connexion',
      },
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
        light_theme: 'Thème clair',
        languages: 'Langues',
        theme: 'Thème',
        account: 'Profil',
        logout: 'Déconnexion',
        theme_selection: 'Sélectionner theme',
        language_selection: 'Sélectionner langage',
      },
      category: {
        category: 'Catégorie',
        categories: 'Catégories',
        undefined: 'Catégorie non définie',
        label: 'Label',
        description: 'Description',
        edit: 'Éditer catégorie',
        delete: 'Supprimer catégorie',
        create: 'Créer catégorie',
        empty_title: 'Créez votre première catégorie',
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
        empty_title: 'Ajouter un premier emplacement',
        empty_description: 'En ajoutant des emplacements, vous pourrez y stocker des films et séries.',
        location_required: "L'emplacement est requis",
        location_too_long: "L'emplacement est trop long",
        physical: 'Emplacement physique',
        digital: 'Emplacement numérique',
      },
      home: {
        empty_title: 'Cette page est vide',
        empty_description: 'Développement en cours.',
        status_check: {
          waiting: 'Vérification en cours...',
          version_ok: 'Version {0}: OK',
          version_error: 'Version minimum {0} attendue, mais version {1} trouvée',
          version_checking_error: 'Impossible de récupérer le numéro de version depuis le serveur.',
        },
      },
      movie: {
        title: 'Titre original',
        french_title: 'Titre français',
        year: 'Année de sortie',
        duration: 'Durée (mins.)',
        director: 'Réalisateur',
        actors: 'Acteurs',
        supports: 'Supports',
        support_digital: 'Numérique',
        remarks: 'Remarques',
        edit: 'Éditer film',
        delete: 'Supprimer film',
        create: 'Créer film',
        empty_title: 'Ajouter un premier film',
        empty_description: 'En ajoutant des films, vous pourrez les stocker et trier.',
        title_required: 'Le titre original est requis',
        title_too_long: 'Le titre original est trop long',
        french_title_too_long: 'Le titre français est trop long',
        year_required: "L'année de sortie est requise",
        year_between: "L'année de sortie doit être comprise entre 1920 et 2100",
        year_integer: "L'année de sortie doit être un nombre",
        duration_required: 'La durée est requise',
        duration_between: 'La durée doit être comprise entre 0 et 600',
        duration_integer: 'La durée doit être un nombre',
        director_too_long: 'Le réalisateur est trop long',
        actors_too_long: 'La liste des acteurs est trop longue',
        remarks_too_long: 'Les remarques sont trop longues',
      },
      serie: {
        title: 'Titre',
        season: 'Saison',
        episodes: "Nombre d'épisodes",
        year: 'Année de sortie',
        supports: 'Supports',
        support_digital: 'Numérique',
        remarks: 'Remarques',
        edit: 'Éditer série',
        delete: 'Supprimer série',
        create: 'Créer série',
        empty_title: 'Ajouter une première série',
        empty_description: 'En ajoutant des séries, vous pourrez les stocker et trier.',
        title_required: 'Le titre est requis',
        title_too_long: 'Le titre est trop long',
        year_required: "L'année de sortie est requise",
        year_between: "L'année de sortie doit être comprise entre 1920 et 2100",
        year_integer: "L'année de sortie doit être un nombre",
        season_integer: 'La saison doit être un nombre',
        episodes_integer: "Le nombre d'épisodes doit être un nombre",
        remarks_too_long: 'Les remarques sont trop longues',
      },
      error: {
        reload_button: 'Recharger la page',
        login_error: "Nom d'utilisateur ou mot de passe invalide",
        errored_description: "Une erreur s'est produite durant le chargement. Veuillez recharger la page.",
        auth: "Une erreur s'est produite lors de l'authentification, veuillez recharger la page.",
        empty_category: "Aucune catégorie n'est présente dans la base de données. Veuillez en créer au moins une avant de continuer",
        empty_location: "Aucun emplacement n'est présent dans la base de données. Veuillez en créer au moins un avant de continuer",
        resources: {
          movies_list: 'Erreur lors du téléchargement de la liste des films depuis le serveur',
          series_list: 'Erreur lors du téléchargement de la liste des séries depuis le serveur',
          locations_list: 'Erreur lors du téléchargement de la liste des emplacements depuis le serveur',
          categories_list: 'Erreur lors du téléchargement de la liste des catégories depuis le serveur',
        },
        form_error: {
          category: "Erreur lors de l'ajout ou de la modification de la catégorie",
          location: "Erreur lors de l'ajout ou de la modification de l'emplacement",
          movie: "Erreur lors de l'ajout ou de la modification du film",
          serie: "Erreur lors de l'ajout ou de la modification de la série",
        },
      },
    }),
  ],
});
