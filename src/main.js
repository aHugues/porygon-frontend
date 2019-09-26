import Vue from 'vue';
import {
  MdButton, MdApp, MdDrawer, MdToolbar, MdContent, MdLayout, MdAvatar, MdList,
  MdIcon, MdEmptyState, MdMenu, MdSwitch, MdSnackbar, MdField, MdCard, MdDivider,
  MdDialogAlert,
} from 'vue-material/dist/components';
import * as Keycloak from 'keycloak-js';
import App from './App.vue';
import router from './router';
import keycloakConfig from './keycloak.json';
import './registerServiceWorker';
import 'vue-material/dist/vue-material.min.css';

// import Keycloak from './keycloak';
// import 'vue-material/dist/theme/default.css';

Vue.config.productionTip = false;
Vue.use(MdButton);
Vue.use(MdApp);
Vue.use(MdDrawer);
Vue.use(MdToolbar);
Vue.use(MdContent);
Vue.use(MdLayout);
Vue.use(MdAvatar);
Vue.use(MdList);
Vue.use(MdIcon);
Vue.use(MdEmptyState);
Vue.use(MdMenu);
Vue.use(MdSwitch);
Vue.use(MdSnackbar);
Vue.use(MdField);
Vue.use(MdCard);
Vue.use(MdDivider);
Vue.use(MdDialogAlert);

const keycloak = Keycloak(keycloakConfig);
keycloak.init({ onLoad: 'login-required' })
  .success((auth) => {
    if (!auth) {
      window.location.reload();
    }

    keycloak.loadUserInfo()
      .success(() => {
        const { userInfo } = keycloak;
        localStorage.setItem('vue-user-firstname', userInfo.given_name);
        localStorage.setItem('vue-user-lastname', userInfo.family_name);
        localStorage.setItem('vue-user-firstname', userInfo.given_name);
      })
      .error(() => {
        console.error('Impossible to load user profile');
      });

    new Vue({
      router,
      render: h => h(App),
    }).$mount('#app');

    localStorage.setItem('vue-token', keycloak.token);
    localStorage.setItem('vue-refresh-token', keycloak.refreshToken);

    Vue.prototype.$keycloak = keycloak;

    setTimeout(() => {
      keycloak.updateToken(70)
        .success(() => {})
        .error(() => {
          console.error('Failed to refresh token');
        });
    }, 60000);
  })
  .error(() => {
    console.error('Authentication failed.');
  });
