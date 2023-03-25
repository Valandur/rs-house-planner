<script lang="ts">
	import { fade } from 'svelte/transition';

	import { Direction, rotateClockwise } from '$lib/models/Direction';
	import { SIZE_X, SIZE_Y, type Floor } from '$lib/models/Floor';
	import { getRotatedDoors, type Room } from '$lib/models/Room';

	import Cell from './cell.svelte';
	import Popover from './popover.svelte';

	export let floor: Floor;
	export let below: Floor | null;
	export let above: Floor | null;

	let selX: number | null = null;
	let selY: number | null = null;
	$: selRoom = selX !== null && selY !== null ? floor.rooms[selY][selX] : null;

	const setSelected = (x: number, y: number) => {
		selX = x;
		selY = y;
	};

	const getConnections = (x: number, y: number, room: Room | null): Direction[] => {
		if (!room) {
			return [];
		}

		const neighbours: { [dir in Direction]: Room | null } = {
			[Direction.North]: y === 0 ? null : floor.rooms[y - 1][x],
			[Direction.East]: x >= SIZE_X - 1 ? null : floor.rooms[y][x + 1],
			[Direction.South]: y >= SIZE_Y - 1 ? null : floor.rooms[y + 1][x],
			[Direction.West]: x === 0 ? null : floor.rooms[y][x - 1]
		};

		const doors: Direction[] = [];
		for (const door of getRotatedDoors(room)) {
			const neighbour = neighbours[door];
			if (!neighbour) {
				continue;
			}

			for (const neighbourDoor of getRotatedDoors(neighbour)) {
				// Rotate the neighbour's door +2 to get the opposite ones (our southern neighbour needs a door facing north)
				if (door === rotateClockwise(neighbourDoor, 2)) {
					doors.push(door);
					break;
				}
			}
		}

		return doors;
	};
</script>

<div class="grid" transition:fade>
	{#each floor.rooms as row, y}
		<div class="row">
			{#each row as room, x}
				<Cell
					{room}
					below={below?.rooms[y][x] || null}
					selected={x === selX && y === selY}
					connections={getConnections(x, y, room)}
					on:selected={() => setSelected(x, y)}
				/>
			{/each}
		</div>
	{/each}

	{#if selX !== null && selY !== null}
		<Popover
			{floor}
			x={selX}
			y={selY}
			room={selRoom}
			below={below?.rooms[selY][selX] || null}
			above={above?.rooms[selY][selX] || null}
			on:changeRoomType
			on:rotateRoom
			on:changeFurniture
		/>
	{/if}
</div>

<style lang="scss">
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
</style>
