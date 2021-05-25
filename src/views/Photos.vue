/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
	<div class="photos">
		<Header />
		<b-message
			v-if="warning"
			title="Warning"
			type="is-warning"
			aria-close-label="Close message"
		>
			{{ warningMessage }}
		</b-message>
		<b-notification v-if="isLoading" class="loadingContainer" :closable="false">
			<b-loading
				:is-full-page="false"
				v-model="isLoading"
				:can-cancel="false"
			></b-loading>
		</b-notification>
		<div v-if="!isLoading" class="photosContainer">
			<div class="photosOnly">
				<div v-for="photos in photosGrid" :key="photos" class="columns">
					<div
						@click="openPhoto(photo)"
						v-for="photo in photos"
						:key="photo.id"
						class="column image is-one-third"
					>
						<b-image
							:src="photo.url"
							:alt="photo.thumbnailUrl"
							ratio="1by1"
						></b-image>
					</div>
				</div>
			</div>
			<hr />
			<b-pagination
				:total="250"
				v-model="currentPage"
				:per-page="limit"
				:range-before="3"
				:range-after="4"
			>
				<template #default="props">
					<b-pagination-button
						:page="props.page"
						:id="`page${props.page.number}`"
						tag="router-link"
						:to="`/photos?page=${props.page.number}&limit=20`"
					>
						{{ props.page.number }}
					</b-pagination-button>
				</template>

				<template #previous="props">
					<b-pagination-button
						:page="props.page"
						tag="router-link"
						:to="`/photos?page=${props.page.number}&limit=20`"
					>
						Previous
					</b-pagination-button>
				</template>

				<template #next="props">
					<b-pagination-button
						:page="props.page"
						tag="router-link"
						:to="`/photos?page=${props.page.number}&limit=20`"
					>
						Next
					</b-pagination-button>
				</template>
			</b-pagination>
		</div>
	</div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import ImageModal from "@/components/ImageModal.vue";
import { PhotoDTO } from "@/http/DTOs/photoDTO";
import { getAllPhotos } from "@/http/requests";
import store from "@/store";
import { Component, Vue } from "vue-property-decorator";

@Component<Photos>({
	components: {
		Header,
	},
	props: {
		page: Number,
		limit: Number,
	},
	computed: {
		auth() {
			return this.$store.state.authenticated;
		}
	},
	watch: {
		async $route() {
			await this.updatedPage();
		},
		async auth() {
			await this.beforeMount();
		}
	},
})
export default class Photos extends Vue {
	isLoading = true;
	photos: PhotoDTO[] = [];
	photosGrid: PhotoDTO[][] = [];
	currentPage = Number(this.$route.query.page) || 1;
	photoLimit = Number(this.$route.query.limit) || 18;
	warning = false;
	warningMessage = "";

	async beforeMount(): Promise<void> {
		if (!store.state.authenticated) {
			this.$router.push({
				name: "Login",
				params: {
					warning: "true",
					warningMessage: "You need to login to access the photos page",
				},
			});
		}
		this.warning = this.$route.params.warning === "true";
		this.warningMessage = this.$route.params.warningMessage;
		await this.getAllPhotos();
	}

	async getAllPhotos(): Promise<void> {
		try {
			this.photosGrid = [];
			this.photos = await getAllPhotos(this.currentPage, this.photoLimit);
			this.arrangePhotosForDisplay();
			this.isLoading = false;
		} catch (error) {
			console.log(error);
		}
	}

	async updatedPage(): Promise<void> {
		this.currentPage = Number(this.$route.query.page) || 1;
		this.photoLimit = Number(this.$route.query.limit) || 18;
		await this.getAllPhotos();
	}

	openPhoto(photo: PhotoDTO): void {
		this.$buefy.modal.open({
			parent: this,
			component: ImageModal,
			hasModalCard: true,
			trapFocus: true,
			customClass: "custom-class custom-class-2",
			props: {
				photoURL: photo.url,
				photoId: photo.id,
				photoTitle: photo.title,
			},
		});
	}

	arrangePhotosForDisplay(): void {
		let photoGridPart: PhotoDTO[] = [];
		let i = 1;

		this.photos.forEach((photo: PhotoDTO) => {
			photoGridPart.push(photo);
			if (i % 3 === 0) {
				this.photosGrid.push(photoGridPart);
				photoGridPart = [];
			}
			i++;
		});
		this.photosGrid.push(photoGridPart);
	}
}
</script>
<style>
.photosContainer {
	width: 80%;
	margin-left: auto;
	margin-right: auto;
	margin-top: 5em;
}
.photosOnly {
	overflow-y: scroll;
	height: 45em;
	margin-left: auto;
	margin-right: auto;
}
</style>
