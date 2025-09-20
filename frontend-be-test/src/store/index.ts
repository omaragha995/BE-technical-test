import { createStore } from "vuex";

import authModule from "./modules/AuthModule";
import examModule from "./modules/ExamModule";

export default createStore({
  modules: {
    authModule,
    examModule,
  },
});
