<template>
	<div class="hello">
		<div class="modal-card">
			<div class="card">
				<div class="card-image">
					<figure class="image is-4by3">
						<img :src="photoURL" alt="Image" />
					</figure>
				</div>
				<div class="card-content">
                    <div class="media">
						<div class="media-content">
							<p class="title is-4">{{ photoTitle }}</p>
						</div>
					</div>
					<div class="content">
						<div class="buttons is-centered">
							<b-button v-if="!favorited" @click="favoritePhoto" type="is-primary is-outlined">
								Favorite
							</b-button>
							<b-button v-if="favorited" @click="unFavoritePhoto" type="is-primary is-outlined">
								Unfavorite
							</b-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { favorite, isFavorited, unfavorite } from "@/http/requests";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ImageModal extends Vue {
	@Prop() private photoURL!: string;
	@Prop() private photoId!: number;
	@Prop() private photoTitle!: string;
    favorited = false;

	async beforeMount(): Promise<void> {
		this.favorited = await isFavorited({photo_id: this.photoId});
	}

	async favoritePhoto(): Promise<void> {
		try {
			await favorite({ photo_id: this.photoId });
			this.favorited = true;
		} catch (error) {
			console.log(error);
		}
	}

    async unFavoritePhoto(): Promise<void> {
		try {
			await unfavorite({ photo_id: this.photoId });
			this.favorited = false;
		} catch (error) {
			console.log(error);
		}
	}

    async action(): Promise<void> {
        if (this.favorited) {
            await this.unFavoritePhoto();
            return;
        }
        await this.favoritePhoto();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
