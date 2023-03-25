<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { calculateStats } from '$lib/models/Stats';
	import { createEmptyFloor } from '$lib/models/Floor';
	import { Direction, rotateClockwise } from '$lib/models/Direction';
	import { FURNITURE_TYPES, type FurnitureType } from '$lib/models/FurnitureType';
	import { createEmptyHouse, MAX_FLOOR, MIN_FLOOR } from '$lib/models/House';
	import { ROOM_TYPES, type RoomType } from '$lib/models/RoomType';

	import { serializeHouse, parseHouse } from '$lib/utils';

	import Errors from '$lib/components/errors.svelte';
	import GettingStarted from '$lib/components/getting-started.svelte';
	import Requirements from '$lib/components/requirements.svelte';
	import Rooms from '$lib/components/rooms.svelte';
	import Tabs from '$lib/components/tabs.svelte';
	import Floor from '$lib/components/floor.svelte';

	let house = createEmptyHouse();
	let floorIndex = Math.abs(MIN_FLOOR);
	$: floor = house.floors[floorIndex];
	$: stats = calculateStats(house);

	onMount(() => {
		house = parseHouse($page.url.searchParams);
	});

	const changeRoom = (e: CustomEvent<{ x: number; y: number; type: RoomType | null }>) => {
		if (e.detail.type === null) {
			house.floors[floorIndex].rooms[e.detail.y][e.detail.x] = null;
		} else {
			house.floors[floorIndex].rooms[e.detail.y][e.detail.x] = {
				floor: house.floors[floorIndex],
				x: e.detail.x,
				y: e.detail.y,
				type: e.detail.type,
				orientation: Direction.North,
				hotspots: new Array(e.detail.type.hotspots.length).map(() => null)
			};
		}
		goto(`?${serializeHouse(house)}`, { replaceState: true });
	};
	const rotateRoom = (e: CustomEvent<{ x: number; y: number }>) => {
		const room = house.floors[floorIndex].rooms[e.detail.y][e.detail.x];
		if (room) {
			room.orientation = rotateClockwise(room.orientation);
			house.floors[floorIndex].rooms[e.detail.y][e.detail.x] = room;
			goto(`?${serializeHouse(house)}`, { replaceState: true });
		}
	};
	const changeFurniture = (
		e: CustomEvent<{ x: number; y: number; hotspotIndex: number; type: FurnitureType | null }>
	) => {
		const room = house.floors[floorIndex].rooms[e.detail.y][e.detail.x];
		if (room) {
			room.hotspots[e.detail.hotspotIndex] = e.detail.type;
			goto(`?${serializeHouse(house)}`, { replaceState: true });
		}
	};
	const reset = () => {
		if (!confirm('Are you sure you want to delete all rooms on this floor?')) {
			return;
		}
		house.floors[floorIndex] = createEmptyFloor(house, floor.num);
		goto(`?${serializeHouse(house)}`, { replaceState: true });
	};

	const random = () => {
		const newFloor = createEmptyFloor(house, floor.num);
		for (let i = 0; i < 33; i++) {
			const y = Math.floor(i / 7) + 1;
			const x = (i % 7) + 1;
			const type = ROOM_TYPES[Math.floor(Math.random() * ROOM_TYPES.length)];
			newFloor.rooms[y][x] = {
				floor: newFloor,
				x,
				y,
				type,
				hotspots: [FURNITURE_TYPES[0], FURNITURE_TYPES[0], FURNITURE_TYPES[0]],
				orientation: Direction.North
			};
		}
		house.floors[floorIndex] = newFloor;
		goto(`?${serializeHouse(house)}`, { replaceState: true });
	};
</script>

<div class="map">
	{#key floorIndex}
		<Floor
			{floor}
			below={house.floors[floorIndex - 1] || null}
			above={house.floors[floorIndex + 1] || null}
			on:changeRoomType={changeRoom}
			on:rotateRoom={rotateRoom}
			on:changeFurniture={changeFurniture}
		/>
	{/key}
</div>

<div class="sidebar">
	<div class="floor-controls">
		<button disabled={floor.num >= MAX_FLOOR} on:click|stopPropagation={() => floorIndex++}>
			<i class="icofont-arrow-up" />
		</button>
		<select bind:value={floorIndex} on:change={(e) => (floorIndex = Number(e.currentTarget.value))}>
			{#each house.floors as floor, index}
				<option value={index}>Floor {floor.num}</option>
			{/each}
		</select>
		<button disabled={floor.num <= MIN_FLOOR} on:click|stopPropagation={() => floorIndex--}>
			<i class="icofont-arrow-down" />
		</button>
		<button on:click={reset}>
			<i class="icofont-ui-delete" />
		</button>

		<div style:flex="1" />

		<div><i class="icofont-money-bag" /> {stats.totalPrice}</div>
		<div>•</div>
		<div><i class="icofont-bars" /> {stats.levelRequirements[0]?.level || 0}</div>
		<div>•</div>
		<div><i class="icofont-drag" /> {stats.extent[0]}x{stats.extent[1]}</div>
	</div>

	<button on:click={random}>Random</button>

	<Tabs tabs={['Getting Started', 'Errors', 'Requirements', 'Rooms']}>
		<svelte:fragment let:tab>
			{#if tab === 'Getting Started'}
				<GettingStarted />
			{:else if tab === 'Errors'}
				<Errors errors={stats.errors} />
			{:else if tab === 'Requirements'}
				<Requirements requirements={stats.levelRequirements} />
			{:else if tab === 'Rooms'}
				<Rooms rooms={house.floors.map((f) => f.rooms).flat(2)} />
			{:else}
				<p>Unknown tab {tab}</p>
			{/if}
		</svelte:fragment>
	</Tabs>
</div>

<style lang="scss">
	.map {
		flex-shrink: 0;
		position: relative;
		width: min(100%, 100vh);
		padding-bottom: min(100%, 100vh);
	}

	.sidebar {
		flex: 1;
		padding: 8px;
	}

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
