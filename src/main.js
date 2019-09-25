import Vue from 'vue';
import {
  MdButton, MdApp, MdDrawer, MdToolbar, MdContent, MdLayout, MdAvatar,
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

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
