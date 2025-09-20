import axios from "../../services/ApiService";

const auth = {
  state: {
    role: null,
    loggedIn: false,
  },
  getters: {
    getRole(state: any) {
      return state.role;
    },
    isLoggedIn(state: any) {
      return state.loggedIn;
    },
  },
  mutations: {
    setRole(state: any, role: string) {
      state.role = role;
    },
    setLoggedIn(state: any, status: boolean) {
      state.loggedIn = status;
    },
  },
  actions: {
    initFromCookies(context: any) {
      const cookies = document.cookie.split(";");
      let role = "";
      let loggedIn = false;

      cookies.forEach((cookie) => {
        const [key, value] = cookie.trim().split("=");
        if (key === "type") role = value;
        if (key === "loggedIn") loggedIn = value.toLowerCase() === "true";
      });

      context.commit("setRole", role);
      context.commit("setLoggedIn", loggedIn);

      return Promise.resolve();
    },
    login(context: any, payload: any) {
      return new Promise((resolve, reject) => {
        axios
          .post("/auth/login", payload, { withCredentials: true })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};

export default auth;
