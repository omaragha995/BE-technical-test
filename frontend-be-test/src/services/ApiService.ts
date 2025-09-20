import axios from "axios";

export default axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});
