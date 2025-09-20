import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/auth/Login.vue"),
  },
  {
    path: "/student-test",
    name: "studentTest",
    meta: {
      authorizers: ["student"],
    },
    component: () => import("../views/students/MedicalTest.vue"),
  },
  {
    path: "/trainee-test",
    name: "traineeTest",
    meta: {
      authorizers: ["trainee"],
    },
    component: () => import("../views/trainees/Tests.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  let isLoggedIn = false;
  let type = "";

  const cookies = document.cookie.split(";");

  next();

  cookies.forEach((cookie) => {
    const [key, value] = cookie.trim().split("=");

    if (key === "loggedIn")
      isLoggedIn = value.toLowerCase() === "true".toLowerCase();
    else if (key === "type") {
      type = value;
    }
  });

  if (to.name === "login") {
    if (type === "student") {
      router.push({ name: "studentTest" });
    } else if (type === "trainee") {
      router.push({ name: "traineeTest" });
    }
  } else {
    const authorizers = to.meta.authorizers as string[];
    if (
      !isLoggedIn ||
      (isLoggedIn && !authorizers.find((authorizer) => authorizer === type))
    ) {
      // go to login
      router.push({ name: "login" });
    } else {
      next();
    }
  }
});

export default router;
