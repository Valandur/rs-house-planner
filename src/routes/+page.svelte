<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { calculateStats } from '$lib/models/Stats';
	import { createEmptyHouse, MAX_FLOOR, MIN_FLOOR, type House } from '$lib/models/House';
	import { createRoom } from '$lib/models/Room';
	import { rotateClockwise } from '$lib/models/Direction';
	import { getRoomTypeByKey, type RoomType } from '$lib/models/RoomType';
	import { SIZE_X, SIZE_Y } from '$lib/models/Floor';
	import type { FurnitureType } from '$lib/models/FurnitureType';

	import { serializeHouse, parseHouse } from '$lib/utils';

	import Errors from '$lib/components/errors.svelte';
	import General from '$lib/components/general.svelte';
	import Requirements from '$lib/components/requirements.svelte';
	import Rooms from '$lib/components/rooms.svelte';
	import Tabs from '$lib/components/tabs.svelte';
	import Floor from '$lib/components/floor.svelte';

	let house = createEmptyHouse();
	let floorIndex = Math.abs(MIN_FLOOR);
	$: floor = house.floors[floorIndex];
	$: stats = calculateStats(house);

	onMount(() => {
		if ($page.url.search) {
			house = parseHouse($page.url.searchParams);
		} else {
			house.floors[1].rooms[4][4] = createRoom(house.floors[1], 4, 4, getRoomTypeByKey('garden'));
		}
	});

	const open = (e: CustomEvent<{ house: House }>) => {
		house = e.detail.house;
		goto(`?${serializeHouse(house)}`, { replaceState: true });
	};
	const save = (e: CustomEvent<{ house: House }>) => {
		goto(`?${serializeHouse(house)}`, { replaceState: true });
	};
	const changeRoom = (e: CustomEvent<{ x: number; y: number; type: RoomType | null }>) => {
		if (e.detail.type === null) {
			house.floors[floorIndex].rooms[e.detail.y][e.detail.x] = null;
		} else {
			house.floors[floorIndex].rooms[e.detail.y][e.detail.x] = createRoom(
				house.floors[floorIndex],
				e.detail.x,
				e.detail.y,
				e.detail.type
			);
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
		for (let y = 0; y < SIZE_Y; y++) {
			for (let x = 0; x < SIZE_X; x++) {
				// Only delete rooms that aren't supporting anything
				if (house.floors[floorIndex].num < 0 || !house.floors[floorIndex + 1]?.rooms[y][x]) {
					house.floors[floorIndex].rooms[y][x] = null;
				}
			}
		}
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

	<Tabs tabs={['General', 'Errors', 'Requirements', 'Rooms']}>
		<svelte:fragment let:tab>
			{#if tab === 'General'}
				<General {house} on:open={open} on:save={save} />
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
