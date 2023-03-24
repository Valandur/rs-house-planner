<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { FLOORS, MAX_FLOOR, MIN_FLOOR } from '$lib/models/Floor';

	export let floor: number;
	export let price: number;
	export let minLvl: number;
	export let extent: [number, number];

	const dispatch = createEventDispatcher<{
		change: { floor: number };
		reset: {};
	}>();

	$: setFloor = (floor: number) => {
		dispatch('change', { floor });
	};
	$: reset = () => {
		dispatch('reset');
	};
</script>

<div class="floor-controls">
	<button disabled={floor >= MAX_FLOOR} on:click|stopPropagation={() => setFloor(floor + 1)}>
		<i class="icofont-arrow-up" />
	</button>
	<select bind:value={floor} on:change={(e) => setFloor(Number(e.currentTarget.value))}>
		{#each FLOORS as fl}
			<option value={fl} selected={fl === floor}>Floor {fl}</option>
		{/each}
	</select>
	<button disabled={floor <= MIN_FLOOR} on:click|stopPropagation={() => setFloor(floor - 1)}>
		<i class="icofont-arrow-down" />
	</button>
	<button on:click={reset}>
		<i class="icofont-ui-delete" />
	</button>

	<div style:flex="1" />

	<div><i class="icofont-money-bag" /> {price}</div>
	<div>•</div>
	<div><i class="icofont-bars" /> {minLvl}</div>
	<div>•</div>
	<div><i class="icofont-drag" /> {extent[0]}x{extent[1]}</div>
</div>

<style lang="scss">
	.floor-controls {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 16px;

		> *:not(:last-child) {
			margin-right: 8px;
		}
	}
</style>
