<template>
	<div class="login">
		<Header />
		<div class="loginForm">
			<b-field label="Email">
				<b-input v-model="email"></b-input>
			</b-field>
			<b-field label="Password">
				<b-input type="password" v-model="password" password-reveal> </b-input>
			</b-field>
			<div class="buttons">
				<b-button type="is-primary" v-on:click="login" expanded>Login</b-button>
			</div>
			<b-message
				v-if="warning"
				title="Warning"
				type="is-warning"
				aria-close-label="Close message"
			>
				{{ warningMessage }}
			</b-message>
			<b-message
				v-if="success"
				title="Success"
				type="is-success"
				aria-close-label="Close message"
			>
				{{ successMessage }}
			</b-message>
			<b-message
				v-if="error"
				title="Error"
				type="is-danger"
				aria-close-label="Close message"
			>
				{{ errorMessage }}
			</b-message>
		</div>
	</div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import { Credentials } from "@/http/DTOs/credentials";
import { login } from "@/http/requests";
import { Component, Vue } from "vue-property-decorator";

@Component<Login>({
	components: {
		Header,
	},
	computed: {
		auth() {
			return this.$store.state.authenticated;
		},
	},
	watch: {
		async auth() {
			await this.beforeMount();
		},
	},
})
export default class Login extends Vue {
	warning = false;
	warningMessage = "";
	success = false;
	successMessage = "";
	error = false;
	errorMessage = "";
	email = "";
	password = "";

	beforeMount(): void {
		if (this.$store.state.authenticated) {
			this.$router.push({ name: "Photos" });
		}
		this.warning = this.$route.params.warning === "true";
		this.warningMessage = this.$route.params.warningMessage;
		this.success = this.$route.params.success === "true";
		this.successMessage = this.$route.params.successMessage;
		this.error = this.$route.params.error === "true";
		this.errorMessage = this.$route.params.errorMessage;
	}

	async login(): Promise<void> {
		const credentials = {
			email: this.email,
			password: this.password,
		} as Credentials;

		try {
			await login(credentials);
			this.$router.push("photos");
		} catch (error) {
			this.errorMessage = "Incorrect email or password";
			this.error = true;
		}
	}
}
</script>
<style>
.loginForm {
	width: 30%;
	margin-left: auto;
	margin-right: auto;
	margin-top: 5em;
}
</style>
