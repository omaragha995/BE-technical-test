import apiService from "../../services/ApiService";

const exam = {
  actions: {
    getAvailableStudents() {
      return new Promise((resolve, reject) => {
        apiService
          .get("/exams/available-students")
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getCurrentExam(context: any, payload: any) {
      return new Promise((resolve, reject) => {
        apiService
          .get(`/exams/current`, { withCredentials: true })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    createExam(context: any, payload: any) {
      return new Promise((resolve, reject) => {
        apiService
          .post("/exams", payload, { withCredentials: true })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    startExam(context: any, payload: any) {
      return new Promise((resolve, reject) => {
        apiService
          .get(`/exams/${payload.examId}/start`, { withCredentials: true })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    pauseExam(context: any, payload: any) {
      return new Promise((resolve, reject) => {
        apiService
          .get(`/exams/${payload.examId}/pause`, { withCredentials: true })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    resetExam(context: any, payload: any) {
      return new Promise((resolve, reject) => {
        apiService
          .get(`/exams/${payload.examId}/reset`, { withCredentials: true })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    adjustTimeExam(context: any, payload: any) {
      // return new Promise((resolve, reject) => {});
    },
  },
};

export default exam;
