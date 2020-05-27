import getters from "./getters.js";
import app from "./modules/app.js";
import errorLog from "./modules/errorLog.js";
import permission from "./modules/permission.js";
import settings from "./modules/settings.js";
import tagsView from "./modules/tagsView.js";
import user from "./modules/user.js";

const modules = {
  app,
  errorLog,
  permission,
  settings,
  tagsView,
  user
};

const store = new Vuex.Store({
  modules,
  getters
});

export default store;
