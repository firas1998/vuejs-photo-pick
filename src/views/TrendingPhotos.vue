/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
	<div class="photos">
		<Header />
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
		</div>
	</div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import TrendingImageModal from "@/components/TrendingImageModal.vue";
import { TrendingPhotoModel } from "@/models/TrendingPhotoModel";
import { TrendingPhotoDTO } from "@/http/DTOs/trendingPhotoDTO";
import { getPhotoById, trendingPhotos } from "@/http/requests";
import { Component, Vue } from "vue-property-decorator";

@Component<TrendingPhotos>({
	components: {
		Header,
	},
})
export default class TrendingPhotos extends Vue {
	isLoading = true;
	photos: TrendingPhotoDTO[] = [];
	photosGrid: TrendingPhotoModel[][] = [];

	async beforeMount(): Promise<void> {
		if (this.isTodayWeekend()) {
			this.$router.push({
				name: "Photos",
				params: {
					warning: "true",
					warningMessage:
						"Trending photos can only be seen on Saturday and Sunday",
				},
			});
		}
		await this.getTrendingPhotos();
	}

	isTodayWeekend(): boolean {
		const day = new Date().getDay();
		if (day === 0 || day === 6) {
			return true;
		}
		return false;
	}

	async getTrendingPhotos(): Promise<void> {
		try {
			this.photosGrid = [];
			this.photos = await trendingPhotos();
			this.arrangePhotosForDisplay();
			this.isLoading = false;
		} catch (error) {
			console.log(error);
		}
	}

	openPhoto(photo: TrendingPhotoModel): void {
		this.$buefy.modal.open({
			parent: this,
			component: TrendingImageModal,
			hasModalCard: true,
			trapFocus: true,
			customClass: "custom-class custom-class-2",
			props: {
				timesFavorited: photo.timesFavorited,
				photoId: photo.id,
				photoURL: photo.url,
				photoTitle: photo.title,
			},
		});
	}

	arrangePhotosForDisplay(): void {
		let photoGridPart: TrendingPhotoModel[] = [];
		let i = 1;

		this.photos.forEach(async (trendingPhoto: TrendingPhotoDTO) => {
			const photo = await getPhotoById(Number(trendingPhoto.photo_id));
			const trendingPhotoModel = {
				id: photo.id,
				title: photo.title,
				url: photo.url,
				timesFavorited: trendingPhoto.times_favorited,
				albumId: photo.albumId,
				thumbnailUrl: photo.thumbnailUrl,
			} as TrendingPhotoModel;
			photoGridPart.push(trendingPhotoModel);
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
