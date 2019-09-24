import Vue from 'vue';
import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

Vue.config.productionTip = false;
Vue.component('md-button', MdButton);
Vue.use(MdContent);
Vue.use(MdTabs);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
