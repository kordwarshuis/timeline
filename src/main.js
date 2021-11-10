import Vue from "vue";
import App from "./App.vue";

//https://stackoverflow.com/a/65555991
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import VueGtag from 'vue-gtag';

import {
  polyfill
} from "seamless-scroll-polyfill";
polyfill();



Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");

Vue.use(VueGtag, {
  config: {
    id: process.env.VUE_APP_GOOGLE_ANALYTICS_ID
  }
});


// function tellGAClickedToPrev() {
//   // GA Google Analytics, track XMLHttpRequest
//   //http://stackoverflow.com/a/15011353
//   if (typeof (_gaq) !== "undefined") {
//       _gaq.push(["_trackPageview", window.location.pathname + window.location.hash + "-clickedToPrev"]);
//   }
// }
// function tellGAClickedToNext() {
//   // GA Google Analytics, track XMLHttpRequest
//   //http://stackoverflow.com/a/15011353
//   if (typeof (_gaq) !== "undefined") {
//       _gaq.push(["_trackPageview", window.location.pathname + window.location.hash + "-clickedToNext"]);
//   }
// }

// export {
//   tellGAClickedToPrev
// };
// export {
//   tellGAClickedToNext
// };