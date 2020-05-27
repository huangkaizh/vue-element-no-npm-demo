import router from "./router/index.js";
import store from "./store/index.js";
import "./permission.js"; // permission control
import "./utils/_axios.js";

window.loadScript = function(url) {
  return new Promise(resolve => {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script);
    console.log("loadScript url", url);
    script.onload = () => {
      resolve();
    };
  });
};

window.loadStyle = function(url) {
  return new this.Promise(resolve => {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
    link.onload = () => {
      console.log('style loaded url: ', url);
      resolve();
    }
  })
}

new Vue({
  router,
  store,
  el: "#root"
});
