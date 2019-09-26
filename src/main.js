import Vue from 'vue';
import {
  MdButton, MdApp, MdDrawer, MdToolbar, MdContent, MdLayout, MdAvatar, MdList,
  MdIcon, MdEmptyState, MdMenu, MdSwitch, MdSnackbar, MdField, MdCard,
} from 'vue-material/dist/components';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import 'vue-material/dist/vue-material.min.css';
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

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
