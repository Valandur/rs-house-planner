<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	import type { House } from '$lib/models/House';
	import { parseHouse, serializeHouse } from '$lib/utils';

	export let house: House;

	let houseNames: string[] = [];

	const dispatch = createEventDispatcher<{
		open: { house: House };
		save: { house: House };
	}>();

	onMount(() => {
		const houseNamesStr = localStorage.getItem('houses');
		if (houseNamesStr) {
			houseNames = JSON.parse(houseNamesStr);
		}
	});

	const save = (house: House) => {
		houseNames = houseNames.includes(house.name) ? houseNames : [...houseNames, house.name];
		const str = serializeHouse(house).toString();
		localStorage.setItem(`house-${house.name}`, str);
		localStorage.setItem('houses', JSON.stringify(houseNames));
		dispatch('save', { house });
	};
	const open = (houseName: string) => {
		const houseStr = localStorage.getItem(`house-${houseName}`);
		if (houseStr) {
			const house = parseHouse(new URLSearchParams(houseStr));
			dispatch('open', { house });
		}
	};
	const del = (houseName: string) => {
		houseNames = houseNames.filter((name) => name !== houseName);
		localStorage.removeItem(`house-${houseName}`);
		localStorage.setItem('houses', JSON.stringify(houseNames));
	};
</script>

<h2>Getting started</h2>
<ul>
	<li>Click a cell to the left to place a new room</li>
</ul>

<h2>Saved houses</h2>
<div class="houses-list">
	<div>
		<div class="name">
			<input type="text" bind:value={house.name} />
		</div>
		<div>
			<button on:click={() => save(house)}>
				<i class="icofont-save" />
			</button>
		</div>
	</div>
	{#each houseNames as name}
		<div class:current={name === house.name}>
			<div class="name">
				{name}
			</div>
			<div>
				<button disabled={name === house.name} on:click={() => open(name)}>
					<i class="icofont-folder-open" />
				</button>
			</div>
			<div>
				<button on:click={() => del(name)}>
					<i class="icofont-ui-delete" />
				</button>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	ul {
		margin: 0;
		margin-left: 1rem;
		padding: 0;
	}

	.houses-list {
		display: flex;
		flex-direction: column;

		& > div {
			display: flex;
			flex-direction: row;
			align-items: center;

			& > div {
				padding: 4px;
			}
		}
	}

	.name {
		flex: 1;
	}

	.current {
		color: black;
		background-color: #ebe6e6;
	}

	h2 {
		margin-bottom: 8px;
	}
	h2:not(:first-child) {
		margin-top: 16px;
	}
</style>
