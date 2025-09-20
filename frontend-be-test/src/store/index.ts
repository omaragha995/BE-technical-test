import { createStore } from "vuex";

import authModule from "./modules/AuthModule";
import examModule from "./modules/ExamModule";
import studentModule from "./modules/studentModule";

export default createStore({
  modules: {
    authModule,
    examModule,
    studentModule,
  },
});
