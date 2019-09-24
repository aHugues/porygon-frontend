import Vue from 'vue';
import {
  MdButton, MdApp, MdDrawer, MdToolbar, MdContent,
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

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
