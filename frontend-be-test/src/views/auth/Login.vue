<template>
  <el-container class="login-container">
    <el-header>
      <h2>Login</h2>
    </el-header>
    <el-main>
      <el-form :model="form" ref="loginForm" :rules="rules" label-width="100px">
        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" placeholder="Enter username" />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="Enter password"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitLogin" :loading="loading"
            >Login</el-button
          >
        </el-form-item>

        <el-alert v-if="error" :title="error" type="error" show-icon />
      </el-form>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { ElMessage, ElNotification } from "element-plus";

import store from "../../store/index";

interface LoginForm {
  username: string;
  password: string;
}

export default defineComponent({
  name: "app-login",
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const error = ref("");

    const form = reactive<LoginForm>({
      username: "",
      password: "",
    });

    const rules = {
      username: [
        { required: true, message: "Username is required", trigger: "blur" },
      ],
      password: [
        { required: true, message: "Password is required", trigger: "blur" },
      ],
    };

    const loginForm = ref();

    const submitLogin = async () => {
      store
        .dispatch("login", {
          username: form.username,
          password: form.password,
        })
        .then(() => {
          return store.dispatch("initFromCookies");
        })
        .then(() => {
          if (store.getters.getRole === "trainee") {
            return store.dispatch("createExam", {
              title: "test Exam",
              duration: 2,
              studentIds: [1, 2, 3, 4, 5],
            });
          } else {
            return Promise.resolve();
          }
        })
        .then(() => {
          ElNotification({
            title: "Success",
            message: "Logged in successfully",
            type: "success",
          });
          router.push({
            name:
              store.getters.getRole === "trainee"
                ? "traineeTest"
                : "studentTest",
          });
        })
        .catch((error) => {
          ElNotification({
            title: "Error",
            message: "Invalid credentials",
            type: "error",
          });
        });

      // error.value = "";
      // (loginForm.value as any).validate(async (valid: boolean) => {
      //   if (!valid) return;
      //   loading.value = true;
      //   try {
      //     const response = await axios.post(
      //       "http://localhost:3000/login",
      //       { username: form.username, password: form.password },
      //       { withCredentials: true }
      //     );

      //     const role = response.data.role;
      //     if (role === "student") router.push("/exam");
      //     else if (role === "trainee") router.push("/management");
      //     else throw new Error("Unknown role");

      //     ElMessage.success("Login successful!");
      //   } catch (err: any) {
      //     console.error(err);
      //     error.value = err.response?.data?.message || "Login failed";
      //   } finally {
      //     loading.value = false;
      //   }
      // });
    };

    return {
      form,
      rules,
      loginForm,
      loading,
      error,
      submitLogin,
    };
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.el-header {
  text-align: center;
  margin-bottom: 20px;
}
</style>
