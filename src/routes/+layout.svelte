<div class="container">
	<slot />
</div>

<style lang="scss">
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: black;
		color: white;
		font-size: 16px;
	}

	:global(h1),
	:global(h2),
	:global(h3),
	:global(h4) {
		margin: 0;
		padding: 0;
	}

	:global(button) {
		color: white;
		border: 1px solid white;
		background-color: black;
		margin: 0;
		padding: 4px 8px;
		font-size: 1rem;
	}

	:global(button.small) {
		padding: 2px 4px;
		font-size: 0.8rem;
	}

	:global(button:disabled) {
		color: gray;
		border-color: gray;
	}

	:global(select) {
		color: white;
		background-color: black;
		border: 1px solid white;
		margin: 0;
		padding: 4px 8px;
		font-size: 1rem;
	}

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
