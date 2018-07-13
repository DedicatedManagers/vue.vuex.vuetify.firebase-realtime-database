import firebase from 'firebase/app';
import Router from 'vue-router';
import Vue from 'vue';
import ClientContainer from '@/components/ClientContainer';
import Client from '@/components/Client';
import Child from '@/components/Child';
import Dashboard from '@/components/Dashboard';
import Login from '@/components/Login';

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
      path: '/client/:clientId',
      props: true,
      name: 'Client',
      component: ClientContainer,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/client/:clientId/child/:childId',
      props: true,
      name: 'Child',
      component: ClientContainer,
      meta: {
        requiresAuth: true,
      },
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
  console.log('router.beforeEach');
  console.log('to:');
  console.log(to);
  console.log('from:');
  console.log(from);

  if (requiresAuth && !currentUser){
    next('/login');
  }
  else if(currentUser && to.matched.some(record=>record.path == "/login")){
    next('/dashboard');
  } 
  else {
    next();
  }
});

export default router;
