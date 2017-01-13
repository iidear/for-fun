import Vue from 'vue';
import VueRouter from 'vue-router';
import chat from './chat.vue';
import login from './login.vue';



Vue.use(VueRouter);

const router = new VueRouter({
	routes: [{
		path: '/',
		name: 'chat',
		component: chat
	},{
		path: '/login',
		name: 'login',
		component: login
	}]
});

new Vue({
	el: '#app',
	router
});