<template>
	<div>
		<b-navbar>
			<template #brand>
				<b-navbar-item tag="router-link" :to="{ path: '/' }">
					<img
						src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
						alt="Lightweight UI components for Vue.js based on Bulma"
					/>
				</b-navbar-item>
			</template>
			<template #start>
				<b-navbar-item
					v-if="authenticated"
					tag="router-link"
					:to="{ name: 'Photos' }"
				>
					Photos
				</b-navbar-item>
				<b-navbar-item
					v-if="isWeekend"
					tag="router-link"
					:to="{ name: 'Trending' }"
				>
					Trending
				</b-navbar-item>
				<b-navbar-item tag="router-link" :to="{ name: 'ActiveUsers' }">
					Active users
				</b-navbar-item>
			</template>

			<template v-if="!authenticated" #end>
				<b-navbar-item tag="div">
					<div class="buttons">
						<router-link
							tag="a"
							:to="{ name: 'Signup' }"
							class="button is-primary"
						>
							<strong>Sign up</strong>
						</router-link>
						<router-link
							tag="a"
							:to="{ name: 'Login' }"
							class="button is-light"
						>
							Log in
						</router-link>
					</div>
				</b-navbar-item>
			</template>
			<template v-else #end>
				<div class="buttons">
					<a class="button is-primary">
						<strong>{{ username }}</strong>
					</a>
					<a @click="logout" class="button is-light"> Log out </a>
				</div>
			</template>
		</b-navbar>
	</div>
</template>

<script lang="ts">
import store from "@/store";
import { logout, me } from "@/http/requests";
import { User } from "@/http/DTOs/userDTO";
import { Component, Vue } from "vue-property-decorator";
import router from "@/router";

@Component<Header>({
	computed: {
		auth() {
			return this.$store.state.authenticated;
		}
	},
	watch: {
		async auth() {
			await this.beforeMount();
		}
	},
})
export default class Header extends Vue {
	username = "";
	authenticated = false;
	isWeekend = false;

	async beforeMount(): Promise<void> {
		await this.isAuthenticated();
		this.isTodayWeekend();
	}

	isTodayWeekend(): void {
		const day = new Date().getDay();
		if (day === 0 || day === 6) {
			this.isWeekend = true;
			return;
		}
		this.isWeekend = false;
	}

	async isAuthenticated(): Promise<void> {
		let user: User;
		if (store.state.authenticated) {
			try {
				user = await me();
				this.username = user.username ? user.username : "";
				this.authenticated = true;
			} catch (error) {
				store.commit("setAuthenticatedFalse");
				this.authenticated = false;
				console.log(error.response.data);
			}
		}
	}

	async logout(): Promise<void> {
		try {
			await logout();
			router.push({name: 'Trending'});
		} catch (error) {
			console.log(error.response.data);
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
