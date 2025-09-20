<template>
  <el-container class="exam-management">
    <el-header>
      <h2>Trainee Exam Management</h2>
    </el-header>
    <el-main>
      <el-card class="timer-card">
        <h1>{{ formattedTime }}</h1>
      </el-card>

      <el-row justify="center" :gutter="10" class="controls">
        <el-col>
          <el-button type="success" @click="startExam" :disabled="disableBtns"
            >Start</el-button
          >
          <el-button type="warning" @click="pauseExam" :disabled="disableBtns"
            >Pause</el-button
          >
          <el-button type="danger" @click="resetExam" :disabled="disableBtns"
            >Reset</el-button
          >
          <!-- <el-button :disabled="disableBtns">+30 sec</el-button>
          <el-button :disabled="disableBtns">-30 sec</el-button> -->
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from "vue";

import store from "../../store/index";
import { useRoute, useRouter } from "vue-router";

import socket from "../../socket/socket";
import { ElNotification } from "element-plus";

export default defineComponent({
  name: "ExamManagement",
  setup() {
    const timeLeft = ref(0);
    const disableBtns = ref(false);
    const route = useRoute();
    const router = useRouter();
    const exam: any = ref({});
    const students: any = ref([]);
    const dialogVisible = ref(false);
    const ExamObj: any = ref({
      title: "",
      duration: 0,
      studentIds: [],
    });

    const formattedTime = computed(() => {
      const minutes = Math.floor(timeLeft.value / 60);
      const seconds = timeLeft.value % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    });

    const getAvailableStudents = () => {
      return new Promise((resolve, reject) => {
        store
          .dispatch("getAvailableStudents")
          .then((response) => {
            students.value = [...response.data.data];

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    };

    const getCurrentExam = () => {
      return new Promise((resolve, reject) => {
        store
          .dispatch("getCurrentExam")
          .then((response) => {
            exam.value = { ...response.data.data };
            timeLeft.value = exam.value.remaining || 0;

            if (exam.value.id) {
              router.replace({
                name: "traineeTest",
                query: {
                  examId: exam.value.id,
                },
              });
            }

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    };

    const createAndStartExam = () => {
      disableBtns.value = true;

      store
        .dispatch("createExam", {
          title: "",
          duration: 0,
          studentIds: students.value,
        })
        .then((response) => {
          // Join the exam room
          socket.emit("joinExam", response.data.data.id);

          // Listen for exam updates
          socket.on("examUpdate", (data) => {
            console.log("📡 Exam update:", data.remaining);
            timeLeft.value = data.remaining;
            exam.value = data;
          });

          return store.dispatch("startExam", {
            examId: response.data.data.id,
          });
        })
        .then(() => {
          disableBtns.value = false;
        })
        .catch((error) => {
          disableBtns.value = false;
        });
    };

    const startExam = () => {
      disableBtns.value = true;

      if (exam.value.id) {
        store
          .dispatch("startExam", { examId: route.query.examId as "" })
          .then((response) => {
            disableBtns.value = false;

            ElNotification({
              title: "Success",
              message: "Exam started successfully",
              type: "success",
            });
          })
          .catch(() => {
            disableBtns.value = true;
          });
      } else {
        createAndStartExam();
      }
    };

    const pauseExam = () => {
      disableBtns.value = true;

      store
        .dispatch("pauseExam", { examId: route.query.examId as "" })
        .then((response) => {
          disableBtns.value = false;

          ElNotification({
            title: "Success",
            message: "Exam paused successfully",
            type: "success",
          });
        })
        .catch(() => {
          disableBtns.value = true;
        });
    };
    const resetExam = () => {
      disableBtns.value = true;

      store
        .dispatch("resetExam", { examId: route.query.examId as "" })
        .then((response) => {
          ElNotification({
            title: "Success",
            message: "Exam reseted successfully",
            type: "success",
          });

          disableBtns.value = false;
        })
        .catch(() => {
          disableBtns.value = true;
        });
    };

    onMounted(() => {
      Promise.all([getAvailableStudents(), getCurrentExam()]).then(() => {
        if (exam.value.id) {
          router.replace({
            name: "traineeTest",
            query: {
              examId: exam.value.id,
            },
          });

          // Join the exam room
          socket.emit("joinExam", exam.value.id);

          // Listen for exam updates
          socket.on("examUpdate", (data) => {
            console.log("📡 Exam update:", data);
            timeLeft.value = data.remaining;
            exam.value = data;
          });
        }
      });
    });

    onUnmounted(() => {
      socket.close();
    });

    return {
      disableBtns,
      ExamObj,
      dialogVisible,
      students,
      timeLeft,
      formattedTime,
      startExam,
      pauseExam,
      resetExam,
    };
  },
});
</script>

<style scoped>
.exam-management {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.timer-card {
  /* width: 300px; */
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
}
.controls {
  /* margin-top: 20px; */
}
</style>
