import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/Home",
    name: "Home1",
    component: ()=> import('@/views/HomeView1.vue'),
  },
  {
    path: "/HomeViewWithLibrary",
    name: "HomeViewWithLibrary",
    component: ()=> import('@/views/HomeViewWithLibrary.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
