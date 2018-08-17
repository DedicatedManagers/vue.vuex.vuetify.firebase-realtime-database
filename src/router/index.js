import firebase from 'firebase/app';
import Router from 'vue-router';
import Vue from 'vue';
import Dashboard from '@/components/Dashboard';
import Login from '@/components/Login';
import Import from '@/components/Import';
//import {store} from '@/store/store'
import TemplateLoader from '@/components/TemplateLoader';

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
      path: '/import',
      name: 'Import',
      component: Import,
    },
    {
      path: '/db/:DbPath(.*)',
      props: true,
      name: 'dbpath',
      component: TemplateLoader,
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
  // console.log('to:');
  // console.log(to);
  // console.log(store.state.currentEntity);
  // console.log('from:');
  // console.log(from);

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
