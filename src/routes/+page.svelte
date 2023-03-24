<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { calculateStats } from '$lib/models/Stats';
	import { createEmptyPlot, SIZE_X, SIZE_Y, type Plot } from '$lib/models/Plot';
	import { Direction, rotateClockwise } from '$lib/models/Direction';
	import { FLOORS } from '$lib/models/Floor';
	import { getUrl, parseUrl } from '$lib/utils';

	import Cell from '$lib/components/cell.svelte';
	import Errors from '$lib/components/errors.svelte';
	import FloorControls from '$lib/components/floor-controls.svelte';
	import GettingStarted from '$lib/components/getting-started.svelte';
	import Popover from '$lib/components/popover.svelte';
	import Requirements from '$lib/components/requirements.svelte';
	import Rooms from '$lib/components/rooms.svelte';
	import Tabs from '$lib/components/tabs.svelte';
	import type { Room } from '$lib/models/Room';
	import { ROOM_TYPES } from '$lib/models/RoomType';

	let floorIndex = Math.max(0, FLOORS.indexOf(0));
	$: floor = FLOORS[floorIndex];

	let plots: Plot[] = [];
	$: plot = plots[floorIndex] || [];

	$: stats = calculateStats(plots);

	onMount(() => {
		plots = parseUrl($page.url.searchParams);
	});

	let selX: number | null = null;
	let selY: number | null = null;
	$: selectedRoom = selX !== null && selY !== null ? plot[selY][selX] : null;
	$: setSelected = (e: CustomEvent<{ x: number | null; y: number | null }>) => {
		selX = e.detail.x;
		selY = e.detail.y;
	};
	$: setRoom = (e: CustomEvent<{ x: number; y: number; typeKey: string | null }>) => {
		if (e.detail.typeKey === null) {
			plots[floorIndex][e.detail.y][e.detail.x] = null;
		} else {
			plots[floorIndex][e.detail.y][e.detail.x] = {
				x: e.detail.x,
				y: e.detail.y,
				typeKey: e.detail.typeKey,
				orientation: Direction.North,
				furnitureKeys: {}
			};
		}
		goto(`?${getUrl(plots)}`, { replaceState: true });
	};
	$: rotateRoom = (e: CustomEvent<{ x: number; y: number }>) => {
		const room = plots[floorIndex][e.detail.y][e.detail.x];
		if (room) {
			plots[floorIndex][e.detail.y][e.detail.x] = {
				...room,
				orientation: rotateClockwise(room.orientation)
			};
			goto(`?${getUrl(plots)}`, { replaceState: true });
		}
	};
	$: reset = () => {
		if (!confirm('Are you sure you want to delete all rooms on this floor?')) {
			return;
		}
		plots[floorIndex] = createEmptyPlot();
		goto(`?${getUrl(plots)}`, { replaceState: true });
	};
	$: setFurniture = (
		e: CustomEvent<{ x: number; y: number; hotspotKey: string; furnitureKey: string | null }>
	) => {
		const room = plots[floorIndex][e.detail.y][e.detail.x];
		if (!room) {
			return;
		}

		room.furnitureKeys[e.detail.hotspotKey] = e.detail.furnitureKey;
		goto(`?${getUrl(plots)}`, { replaceState: true });
	};
	$: getConnections = (x: number, y: number, room: Room | null): Direction[] => {
		if (!room) {
			return [];
		}

		const type = ROOM_TYPES[room.typeKey];
		const neighbours: { [dir in Direction]: Room | null } = {
			[Direction.North]: y === 0 ? null : plot[y - 1][x],
			[Direction.East]: x >= SIZE_X - 1 ? null : plot[y][x + 1],
			[Direction.South]: y >= SIZE_Y - 1 ? null : plot[y + 1][x],
			[Direction.West]: x === 0 ? null : plot[y][x - 1]
		};

		const dirs: Direction[] = [];
		for (const door of type.doors) {
			const dir = rotateClockwise(door, room.orientation);
			const neighbour = neighbours[dir];
			if (!neighbour) {
				continue;
			}

			const neighbourType = ROOM_TYPES[neighbour.typeKey];
			for (const neighbourDoor of neighbourType.doors) {
				// Rotate the neighbour's door +2 to get the opposite ones (our southern neighbour needs a door facing north)
				const neighbourDir = rotateClockwise(neighbourDoor, neighbour.orientation + 2);
				if (dir === neighbourDir) {
					dirs.push(dir);
					break;
				}
			}
		}

		return dirs;
	};
</script>

<div class="map">
	{#key floor}
		<div class="grid" transition:fade>
			{#each plot as row, y}
				<div class="row">
					{#each row as room, x}
						<Cell
							{x}
							{y}
							{room}
							selected={x === selX && y === selY}
							below={plots[floorIndex - 1]?.[y][x]}
							connections={getConnections(x, y, room)}
							on:selected={setSelected}
						/>
					{/each}
				</div>
			{/each}

			{#if selX !== null && selY !== null}
				<Popover
					{floor}
					x={selX}
					y={selY}
					room={selectedRoom}
					below={plots[floorIndex - 1]?.[selY][selX]}
					above={plots[floorIndex + 1]?.[selY][selX]}
					on:change={setRoom}
					on:rotate={rotateRoom}
					on:furniture={setFurniture}
				/>
			{/if}
		</div>
	{/key}
</div>

<div class="sidebar">
	<FloorControls
		{floor}
		price={stats.totalPrice}
		minLvl={stats.levelRequirements[0]?.level}
		extent={stats.extent}
		on:change={(e) => (floorIndex = FLOORS.indexOf(e.detail.floor))}
		on:reset={reset}
	/>

	<Tabs tabs={['Getting Started', 'Errors', 'Requirements', 'Rooms']}>
		<svelte:fragment let:tab>
			{#if tab === 'Getting Started'}
				<GettingStarted />
			{:else if tab === 'Errors'}
				<Errors errors={stats.errors} />
			{:else if tab === 'Requirements'}
				<Requirements requirements={stats.levelRequirements} />
			{:else if tab === 'Rooms'}
				<Rooms rooms={plots.flat(2)} />
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

	.grid {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		border: 1px solid gray;
		position: absolute;
		top: 8px;
		left: 8px;
		right: 8px;
		bottom: 8px;
	}

	.row {
		flex: 1;
		display: flex;
		flex-direction: row;
	}

	.sidebar {
		flex: 1;
		padding: 8px;
	}
</style>
