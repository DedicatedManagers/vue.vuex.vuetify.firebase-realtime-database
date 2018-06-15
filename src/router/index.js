import firebase from 'firebase';
import Router from 'vue-router';
import Vue from 'vue';
import Dashboard from '@/components/Dashboard';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/login',
    },
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
      },
    },
  ],
  mode: 'history',
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  console.log('Requires Auth?:', requiresAuth, 'Current User:', currentUser);

  if (requiresAuth && !currentUser) next('/login');
  else if (!requiresAuth && currentUser) next('/dashboard');
  else next();
});

export default router;
