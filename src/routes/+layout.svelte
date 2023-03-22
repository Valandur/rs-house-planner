<slot />

<style lang="scss">
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: black;
		color: white;
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: row;
		align-items: stretch;
		font-size: 16px;
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

	:global(select) {
		color: white;
		background-color: black;
		border: 1px solid white;
		margin: 0;
		padding: 4px 8px;
		font-size: 1rem;
	}
</style>
