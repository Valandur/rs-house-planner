<script lang="ts">
	import { fade } from 'svelte/transition';

	export let tabs: string[];
	export let inverted = false;

	let current = tabs[0];
</script>

<div class="container" class:inverted>
	<div class="navigation">
		{#each tabs as tab}
			<button class:active={current === tab} on:click={() => (current = tab)}>
				{tab}
			</button>
		{/each}
	</div>
	<div class="content">
		{#key current}
			<div class="tab" transition:fade|local>
				<slot tab={current} />
			</div>
		{/key}
	</div>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}

	.active {
		background-color: #ebe6e6;
		border: 1px solid black;
		color: black;
	}

	.content {
		flex: 1;
		box-sizing: border-box;
		background-color: black;
		border: 1px solid #ebe6e6;
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;
	}

	.inverted {
		button {
			background-color: #ebe6e6;
			border: 1px solid black;
			color: black;
		}

		.active {
			background-color: black;
			border: 1px solid #ebe6e6;
			color: #ebe6e6;
		}

		.content {
			background-color: #ebe6e6;
			border: 1px solid black;
		}
	}

	.tab {
		grid-row: 1;
		grid-column: 1;
		padding: 16px;
	}
</style>
