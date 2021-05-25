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
					<div class="content">Favorited {{ timesFavorited }} times</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ImageModal extends Vue {
	@Prop() private photoURL!: string;
	@Prop() private photoId!: number;
	@Prop() private photoTitle!: string;
	@Prop() private timesFavorited!: number;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
