<template>
  <el-container class="exam-page">
    <el-header>
      <h2>Student Exam Timer</h2>
    </el-header>
    <el-main>
      <el-card class="timer-card">
        <h1>{{ formattedTime }}</h1>
      </el-card>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from "vue";

import socket from "../../socket/socket";
import store from "@/store";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ExamPage",
  setup() {
    const router = useRouter();

    const timeLeft = ref(0);
    const exam: any = ref({});

    const formattedTime = computed(() => {
      const minutes = Math.floor(timeLeft.value / 60);
      const seconds = timeLeft.value % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    });

    const getCurrentStudentExam = () => {
      return new Promise((resolve, reject) => {
        store
          .dispatch("getCurrentStudentExam")
          .then((response) => {
            exam.value = { ...response.data.data };

            timeLeft.value = exam.value.remaining || 0;

            console.log(timeLeft.value, response.data.data);

            router.replace({
              name: "studentTest",
              query: { examId: exam.value.id },
            });

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    };

    onMounted(() => {
      getCurrentStudentExam().then(() => {
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
      timeLeft,
      formattedTime,
    };
  },
});
</script>

<style scoped>
.exam-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.timer-card {
  width: 300px;
  text-align: center;
  font-size: 2rem;
}
</style>
