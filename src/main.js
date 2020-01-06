import Vue from 'vue';
import {
  MdButton, MdApp, MdDrawer, MdToolbar, MdContent, MdLayout, MdAvatar, MdList,
  MdIcon, MdEmptyState, MdMenu, MdSwitch, MdSnackbar, MdField, MdCard, MdDivider,
  MdDialogAlert, MdCheckbox, MdProgress,
} from 'vue-material/dist/components';
import * as Keycloak from 'keycloak-js';
import App from './App.vue';
import router from './router';
import keycloakConfig from './keycloak.json';
import appConfig from './config';
import './registerServiceWorker';
import 'vue-material/dist/vue-material.min.css';
import './ml';


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
Vue.use(MdCheckbox);
Vue.use(MdDialogAlert);
Vue.use(MdProgress);

const keycloak = Keycloak(keycloakConfig);
const env = process.env.NODE_ENV || 'development';

if (appConfig[env].porygonApiAuthentication) {
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
          localStorage.setItem('vue-token', keycloak.token);
          localStorage.setItem('vue-refresh-token', keycloak.refreshToken);

          const accountUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/account`;
          localStorage.setItem('vue-user-url', accountUrl);

          Vue.prototype.$keycloak = keycloak;

          new Vue({
            router,
            render: h => h(App),
          }).$mount('#app');
        })
        .error(() => {
          console.error('Impossible to load user profile');
        });

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
} else {
  // set default values for dev environment
  localStorage.setItem('vue-user-firstname', 'Test');
  localStorage.setItem('vue-user-lastname', 'User');
  localStorage.setItem('vue-user-url', 'https://google.com');

  new Vue({
    router,
    render: h => h(App),
  }).$mount('#app');
}
