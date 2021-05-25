<template>
	<div class="activeUsersContainer">
		<Header />
		<b-field class="activeUsers" ref="activeUsersDiv">
			<b-notification v-if="isLoading" class="loadingContainer" :closable="false">
				<b-loading
					:is-full-page="false"
					v-model="isLoading"
					:can-cancel="false"
				></b-loading>
			</b-notification>
			<b-table v-if="!isLoading" :data="activeUsers" :columns="columns"></b-table>
		</b-field>
	</div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import { activeUsers } from "@/http/requests";
import { Component, Vue } from "vue-property-decorator";
import { ActiveUsersDTO } from "@/http/DTOs/activeUsers";

@Component({
	components: {
		Header,
	},
})
export default class ActiveUsers extends Vue {
	isLoading = true;
	activeUsers = [] as ActiveUsersDTO[];
	columns = [
		{
			field: "id",
			label: "ID",
			width: "40",
			numeric: true,
		},
		{
			field: "username",
			label: "Username",
		},
		{
			field: "email",
			label: "Email",
		},
		{
			field: "photos_favorited",
			label: "Photos favorited",
		},

		{
			field: "created_at",
			label: "created_at",
		},

		{
			field: "updated_at",
			label: "updated_at",
		},
	];

	async beforeMount(): Promise<void> {
		await this.getActiveUsers();
	}

	async getActiveUsers(): Promise<void> {
		try {
			this.activeUsers = await activeUsers();
			this.isLoading = false;
		} catch (error) {
			console.log(error);
		}
	}
}
</script>
<style>
.activeUsers {
	width: 80%;
	margin-left: auto;
	margin-right: auto;
	margin-top: 5em;
}

.loadingContainer {
    height: 25em;
}
</style>
