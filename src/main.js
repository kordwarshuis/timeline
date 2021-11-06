import Vue from "vue";
import App from "./App.vue";

//https://stackoverflow.com/a/65555991
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import VueGtag from 'vue-gtag';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");

Vue.use(VueGtag, {
  config: { id: process.env.VUE_APP_GOOGLE_ANALYTICS_ID }
});