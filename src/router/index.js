import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import UserView from "@/views/UserView.vue";
import LoginView from "@/views/LoginView.vue";
import EditProfile from "@/views/EditProfile.vue";
import ReelsView from "@/views/ReelsView.vue";
import { auth } from "@/firebase";

const isAuthenticated = () => {
  const storedUser = localStorage.getItem("user");
  return auth.currentUser || (storedUser && JSON.parse(storedUser));
};

const requireAuth = (to, from, next) => {
  isAuthenticated() ? next() : next("/login");
};

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
    name: "reels",
    component: ReelsView,
  },
  {
    path: "/edit-profile",
    name: "edit-profile",
    component: EditProfile,
    beforeEnter: requireAuth,
  },
  {
    path: "/profile/:userId?",
    name: "user-view",
    component: UserView,
    beforeEnter: requireAuth,
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;
