import Vue from 'vue';
import {
  MdButton, MdApp, MdDrawer, MdToolbar, MdContent, MdLayout, MdAvatar, MdList,
  MdIcon, MdEmptyState, MdMenu, MdSwitch, MdSnackbar, MdField, MdCard, MdDivider,
  MdDialogAlert, MdCheckbox, MdProgress,
} from 'vue-material/dist/components';
import App from './App.vue';
import router from './router';
import appConfig from './config';
import './registerServiceWorker';
import 'vue-material/dist/vue-material.min.css';
import './ml';

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

const env = process.env.NODE_ENV || 'development';

if (!appConfig[env].porygonApiAuthentication) {
  localStorage.setItem('vue-user-firstname', 'Test');
  localStorage.setItem('vue-user-lastname', 'User');
  localStorage.setItem('vue-user-url', 'https://google.com');
}
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
