import { createRouter, createWebHistory } from 'vue-router';
import Editor from './components/Editor.vue';
import Home from './components/Home.vue';

const routes = [
  {
    path: '/room/:roomId',
    name: 'Room',
    component: Editor
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/',
    redirect: '/home'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
