import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import UserView from "@/views/UserView.vue";
import LoginView from "@/views/LoginView.vue";
import EditProfile from "@/views/EditProfile.vue";
import ReelsView from "../views/ReelsView.vue";
import { auth } from "@/firebase";

const routes = [
  {
    path: "/",
    redirect: "/profile",
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/reels",
    name: "Reels",
    component: ReelsView,
  },
  {
    path: "/edit-profile",
    name: "edit-profile",
    component: EditProfile,
    beforeEnter: (to, from, next) => {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (auth.currentUser || user) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/profile/:userId?",
    name: "UserView",
    component: UserView,
    beforeEnter: (to, from, next) => {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (auth.currentUser || user) {
        next(); // Користувач автентифікований, дозволяємо доступ
      } else {
        next("/login"); // Перенаправляємо на логін, якщо немає автентифікації
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
