import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import SignUp from "../views/SignUp.vue";
import ActiveUsers from "../views/ActiveUsers.vue";
import Photos from "../views/Photos.vue";
import TrendingPhotos from "../views/TrendingPhotos.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/login",
		name: "Login",
		component: Login,
	},
	{
		path: "/signup",
		name: "Signup",
		component: SignUp,
	},
	{
		path: "/active-users",
		name: "ActiveUsers",
		component: ActiveUsers,
	},
	{
		path: "/photos",
		name: "Photos",
		component: Photos,
		props: true,
	},
	{
		path: "/trending",
		name: "Trending",
		component: TrendingPhotos,
		props: true,
	},
	{
		path: "/about",
		name: "About",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () =>
			import(/* webpackChunkName: "about" */ "../views/About.vue"),
	},
];

const router = new VueRouter({
	routes,
});

export default router;
