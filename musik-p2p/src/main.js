import Vue from 'vue'
import Layout from './Layout.vue'
import vuetify from './plugins/vuetify';




Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(Layout)
}).$mount('#app')


