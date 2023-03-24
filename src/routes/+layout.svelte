<script lang="ts">
	import './style.scss';
</script>

<div class="container">
	<slot />
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-wrap: wrap;
		overflow: auto;
	}

	@media (orientation: portrait) {
		.container {
			flex-direction: column;
		}
	}

	@media (orientation: landscape) {
		.container {
			flex-direction: row;
			align-items: flex-start;
		}
	}
</style>
