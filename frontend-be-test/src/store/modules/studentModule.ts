import apiService from "../../services/ApiService";

const exam = {
  actions: {
    getCurrentStudentExam(context: any, payload: any) {
      return new Promise((resolve, reject) => {
        apiService
          .get(`/students/current`, { withCredentials: true })
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

export default exam;
