import { isUserAdmin } from "@/utils";
import { createStore } from "vuex";

const store = createStore({
	state: {
		user: JSON.parse(localStorage.getItem('user')) || {},
		event: JSON.parse(localStorage.getItem('event')) || {},
		roomId: localStorage.getItem('roomId') || '',
	},
	getters: {
		roomId: (state) => state.roomId,
    user: (state) => {
			return state.user;
		},
    event: (state) => state.event,
		isUserLogged: (state) => {
			if(Object.keys(state.user).length){
				return true;
			}
			else return false;
		},
		isUserAdmin: (state) => {
			if(Object.keys(state.user).includes('role')){
				// const u = JSON.parse(state.user);
				return state.user.role == 'admin';
			}
			else return false;
		},
		isUserCounselor: (state) => {
			if(Object.keys(state.user).includes('role')){
				// const u = JSON.parse(state.user);
				return state.user.role == 'counselor';
			}
			else return false;
		},
		isUserDoctor: (state) => {
			if(Object.keys(state.user).includes('role')){
				// const u = JSON.parse(state.user);
				return state.user.role == 'doctor';
			}
			else return false;
		},
		isUserReceptionist: (state) => {
			if(Object.keys(state.user).includes('role')){
				// const u = JSON.parse(state.user);
				return state.user.role == 'receptionist';
			}
			else return false;
		}
	},
	mutations: {
		setRoomId(state, roomId) {
			state.roomId = roomId;
			localStorage.setItem('roomId', roomId);
		},
		setUser(state, user) {
			state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
		},
		clearUser(state) {
			state.user = {};
      localStorage.removeItem('user');
		},
		setEvent(state, event) {
			state.event = event;
			localStorage.setItem('event', JSON.stringify(event));
		},
		clearEvent(state) {
			state.event = {};
      localStorage.removeItem('event');
		},
	}
});

export default store;