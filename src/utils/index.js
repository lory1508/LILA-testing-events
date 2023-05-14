import store from '@/store/store.js'

export function isUserLogged() {
	return true
	// const user = store.getters.user;
	// if( user && user.id ) return true;
  // return false;
};

export function isUserCounselor() {
	return true
	// const user = store.getters.user;
	// if( user.role == 'counselor' ) return true;
	// return false;
};

export function isUserDoctor() {
	return true
	// const user = store.getters.user;
	// if( user.role == 'doctor' ) return true;
	// return false;
};

export function isUserReceptionist() {
	return true
	// const user = store.getters.user;
	// if( user.role == 'receptionist' ) return true;
	// return false;
};

export function isUserAdmin() {
	return true
	// const user = store.getters.user;
	// if( user.role == 'admin' ) return true;
	// return false;
};