import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store/store.js'

// components
import TheDashboardVue from '@/components/TheDashboard.vue';
import LoginComponentVue from '@/components/LoginComponent.vue';
import DoctorView from '@/views/DoctorView.vue';
import CallingTest from '@/components/doctor/CallingTest.vue';
import CounselorsView from '@/views/CounselorsView.vue';
import EventsManagement from '@/views/admin/EventsManagement.vue';
import UsersManagement from '@/views/admin/UsersManagement.vue';
import Forbidden from '@/views/ForbiddenView.vue';
// import NotFound from '@/pages/NotFound.vue'

const routes = [
	{	
		path: '/login', 
		name: 'Login', 
		component: LoginComponentVue 
	},
	{	
		path: '/', 
		alias: '/dashboard',
		name: 'Dashboard', 
		component: TheDashboardVue,
    meta: {
      requiresAuth: true,
    }
	},
	{	
		path: '/medici', 
		name: 'Doctor', 
		component: DoctorView,
    meta: {
      requiresAuth: true,
			requiresDoctor: true
    }
	},
	{	
		path: '/doctor/test', 
		name: 'CallingTest', 
		component: CallingTest,
    meta: {
      requiresAuth: true,
			requiresDoctor: true
    }
	},
	{
		path: '/counselors',
		name: 'Counselors',
		component: CounselorsView,
    meta: {
      requiresAuth: true,
			requiresCounselor: true
    }
	},
	{
		path: '/events',
		name: 'Events',
		component: EventsManagement,
    meta: {
      requiresAuth: true,
			requiresAdmin: true
    }
	},
	{
		path: '/users',
		name: 'Users',
		component: UsersManagement,
    meta: {
      requiresAuth: true,
			requiresAdmin: true
    }
	},
	{
		path: '/forbidden',
		name: 'Forbidden',
		component: Forbidden,
    meta: {
      requiresAuth: true
    }
	},
	// { path: '/:pathMatch(.*)*', name: '404', component: NotFound },
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
	const requiresDoctor = to.matched.some(record => record.meta.requiresDoctor);
	const requiresCounselor = to.matched.some(record => record.meta.requiresCounselor);
	const requiresReceptionist = to.matched.some(record => record.meta.requiresReceptionist);
  if( requiresAuth && !store.getters.isUserLogged && to.name !== 'Login' ) {
    next({ name: "Login" });
  } else if( store.getters.isUserLogged && to.name === 'Login' ) {
    next({ name: "Dashboard" });
  } else if ( 
		(requiresAdmin && !store.getters.isUserAdmin) ||
		(requiresDoctor && !store.getters.isUserDoctor) ||
		(requiresCounselor && !store.getters.isUserCounselor) ||
		(requiresReceptionist && !store.getters.isUserReceptionist)
	) {
		next({ name: "Forbidden" });
	} else {
    next();
  }
})

export default router;