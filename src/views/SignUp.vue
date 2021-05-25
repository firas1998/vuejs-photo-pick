/* eslint-disable */
<template>
	<div class="signup">
		<Header />
		<div class="loginForm">
			<b-field
				:type="usernameType"
				:message="usernameErrorMessage"
				label="Username"
			>
				<b-input v-model="username"></b-input>
			</b-field>
			<b-field :type="emailType" :message="emailErrorMessage" label="Email">
				<b-input v-model="email"></b-input>
			</b-field>
			<b-field
				:type="passwordType"
				:message="passwordErrorMessage"
				label="Password"
			>
				<b-input type="password" v-model="password" password-reveal> </b-input>
			</b-field>
			<div class="buttons">
				<b-button type="is-primary" v-on:click="signUp" expanded
					>Sign up</b-button
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import { SignupData } from "@/http/DTOs/signupData";
import { signup } from "@/http/requests";
import { Component, Vue } from "vue-property-decorator";

@Component({
	components: {
		Header,
	},
})
export default class SignUp extends Vue {
	username = "";
	email = "";
	password = "";
	usernameType = "";
	emailType = "";
	passwordType = "";
	usernameErrorMessage = "";
	emailErrorMessage = "";
	passwordErrorMessage = "";

	beforeMount(): void {
		if (this.$store.state.authenticated) {
			this.$router.push({ name: "Photos" });
		}
	}

	async signUp(): Promise<void> {
		const signUpData = {
			username: this.username,
			email: this.email,
			password: this.password,
		} as SignupData;

		try {
			await signup(signUpData);
			this.$router.push({
				name: "Login",
				params: {
					success: "true",
					successMessage:
						"Your account was created successfully, please login !",
				},
			});
		} catch (error) {
			this.setErrors(error.response.data.errors);
		}
	}

	setErrors(data: any): void {
		this.clearErrors();
		Object.keys(data).forEach((key) => {
			switch (key) {
				case "username":
					this.usernameType = "is-danger";
					data["username"].forEach((errorMessage: string) => {
						this.usernameErrorMessage += errorMessage + "\n";
					});
					break;
				case "email":
					this.emailType = "is-danger";
					data["email"].forEach((errorMessage: string) => {
						this.emailErrorMessage += errorMessage + "\n";
					});
					break;

				case "password":
					this.passwordType = "is-danger";
					data["password"].forEach((errorMessage: string) => {
						this.passwordErrorMessage += errorMessage + "\n";
					});
					break;
			}
		});
	}

	clearErrors(): void {
		this.usernameType = "";
		this.emailType = "";
		this.passwordType = "";
		this.usernameErrorMessage = "";
		this.emailErrorMessage = "";
		this.passwordErrorMessage = "";
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
