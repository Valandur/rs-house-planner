<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { createEmptyPlot, getExtendedPlots, SIZE_X, SIZE_Y, type Plot } from '$lib/models/Plot';
	import { Direction, rotateClockwise } from '$lib/models/Direction';
	import { ROOM_TYPES_LIST } from '$lib/models/RoomType';
	import { FLOORS, MAX_FLOOR, MIN_FLOOR } from '$lib/models/Floor';
	import { getStats } from '$lib/models/Stats';

	import { getUrl, parseUrl } from '$lib/utils';

	let floorIndex = Math.max(0, FLOORS.indexOf(0));
	$: floor = FLOORS[floorIndex];

	let plots: Plot[] = [];
	$: extendedPlots = getExtendedPlots(plots);
	$: extendedPlot = extendedPlots[floorIndex] || [];
	$: stats = getStats(extendedPlots);

	onMount(() => {
		plots = parseUrl($page.url.searchParams);
	});

	$: setRoom = (x: number, y: number, type: string | null) => {
		if (type === null) {
			plots[floorIndex][y][x] = null;
		} else {
			plots[floorIndex][y][x] = { type, orientation: Direction.North };
		}

		goto(`?${getUrl(plots)}`, { replaceState: true });
	};
	$: rotateRoom = (x: number, y: number) => {
		const room = plots[floorIndex][y][x];
		if (room) {
			plots[floorIndex][y][x] = { ...room, orientation: rotateClockwise(room.orientation) };
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

	let selX: number | null = null;
	let selY: number | null = null;
	$: setSelected = (x: number | null, y: number | null) => {
		selX = x;
		selY = y;
	};
</script>

<div class="map">
	<div class="grid">
		{#each extendedPlot as row, y}
			<div class="row">
				{#each row as room, x}
					{@const selected = x === selX && y === selY}
					<div
						class="cell {room?.orientation || ''}"
						class:selected
						on:click={() => setSelected(x, y)}
						on:keypress={() => setSelected(x, y)}
					>
						{#if room !== null}
							<div class="marker" />
							<div class="content" style:background-color={room.bg}>
								<div class="title">{room.name}</div>
							</div>
							{#each room.doors as { name, connected }}
								<div class="door {name}" class:connected />
							{/each}
						{:else}
							{@const below = extendedPlots[floorIndex - 1]?.[y][x]}
							<div class="content" class:below={!!below} class:supported={below && !below.open}>
								{#if below}
									<div class="title">{below.name}</div>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/each}

		{#if selX !== null && selY !== null}
			{@const y = selY}
			{@const yRatio = 100 / extendedPlot.length}
			{@const x = selX}
			{@const xRatio = 100 / extendedPlot[y].length}
			{@const below = extendedPlots[floorIndex - 1]?.[y][x]}
			<div
				class="popup"
				style:top={y < SIZE_Y - 2 ? `${yRatio * (y + 1)}%` : ''}
				style:bottom={y >= SIZE_Y - 2 ? `${yRatio * (SIZE_Y - y)}%` : ''}
				style:left={x < SIZE_X - 2 ? `${xRatio * x}%` : ''}
				style:right={x >= SIZE_X - 2 ? `${xRatio * (SIZE_X - x - 1)}%` : ''}
			>
				{#if floor > 0 && (!below || below.open)}
					<p>There is no supporting room below!</p>
				{:else}
					<select
						value={extendedPlot[y][x]?.type || ''}
						on:change={(e) => setRoom(x, y, e.currentTarget.value)}
					>
						<option value="" disabled selected>Pick a room...</option>
						{#each ROOM_TYPES_LIST as [key, type]}
							<option value={key}>{type.name}</option>
						{/each}
					</select>
				{/if}

				{#if extendedPlot[y][x]}
					<button class="rotate" on:click|stopPropagation={() => rotateRoom(x, y)}>
						<i class="icofont-ui-rotation" />
					</button>
					<button class="remove" on:click|stopPropagation={() => setRoom(x, y, null)}>
						<i class="icofont-ui-delete" />
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<div
	class="sidebar"
	on:click={() => setSelected(null, null)}
	on:keypress={() => setSelected(null, null)}
>
	<div class="floor-controls">
		<button disabled={floor >= MAX_FLOOR} on:click|stopPropagation={() => floorIndex++}>
			<i class="icofont-arrow-up" />
		</button>
		<select bind:value={floorIndex}>
			{#each FLOORS as label, floor}
				<option value={floor}>Floor {label}</option>
			{/each}
		</select>
		<button disabled={floor <= MIN_FLOOR} on:click|stopPropagation={() => floorIndex--}>
			<i class="icofont-arrow-down" />
		</button>
		<button on:click={() => reset()}>
			<i class="icofont-ui-delete" />
		</button>
	</div>

	<div class="stats">
		{#if stats.errors.length > 0}
			<h2>Errors</h2>

			<div class="row">
				<div class="alerts">
					{#each stats.errors as error}
						<div class="alert error">{error}</div>
					{/each}
				</div>
			</div>
		{/if}

		<h2>Info</h2>

		<div class="row">
			<table>
				<tbody>
					<tr>
						<td>Cost</td>
						<td>{stats.totalPrice}</td>
						<td />
					</tr>
					<tr>
						<td>Extent</td>
						<td>{stats.extent[0]}x{stats.extent[1]}</td>
						<td />
					</tr>
					<tr>
						<td>Min Level</td>
						<td>{stats.levelRequirements[0]?.level}</td>
						<td />
					</tr>
				</tbody>
			</table>
		</div>

		<h2>Requirements</h2>

		<div class="row">
			<table>
				<thead>
					<tr>
						<th>Requirement</th>
						<th>Current</th>
						<th>Limit</th>
						<th>Min. Level</th>
					</tr>
				</thead>
				<tbody>
					{#each stats.levelRequirements as req}
						<tr class:max={req.level === stats.levelRequirements[0].level}>
							<td>{req.name}</td>
							<td>{req.value}</td>
							<td>{req.limit}</td>
							<td>{req.level}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<h2>Rooms</h2>
		<div class="row">
			<table>
				<thead>
					<tr>
						<th>Type</th>
						<th>Level</th>
						<th>Cost</th>
						<th>Amount</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					{#each stats.groupedRooms as { type, rooms }}
						<tr>
							<td>{type.name}</td>
							<td class="number">{type.minLvl}</td>
							<td class="number">{type.cost}</td>
							<td class="number">{rooms.length || '-'}</td>
							<td class="number">{rooms.length > 0 ? rooms.length * type.cost : '-'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<style lang="scss">
	$marker-offset: 12px; // distance from the cell border
	$door-thickness: 6px;
	$door-size: 30%; // percentage of the cell size (width/height)

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
		border: 1px solid white;
		position: absolute;
		top: 8px;
		left: 8px;
		right: 8px;
		bottom: 8px;
	}

	.floor-controls {
		display: flex;
		flex-direction: row;
		margin-bottom: 16px;

		> *:not(:last-child) {
			margin-right: 8px;
		}
	}

	.popup {
		position: absolute;
		z-index: 100;
		background-color: blue;
		box-sizing: border-box;
		padding: 8px;
		display: flex;
		flex-direction: row;

		p {
			margin: 0;
			padding: 0;
			color: white;
			white-space: nowrap;
		}

		> *:not(:last-child) {
			margin-right: 8px;
		}
	}

	.row {
		flex: 1;
		display: flex;
		flex-direction: row;
	}

	.cell {
		/* For some reason making the flex-basis the size of the border fixes 
		 * the cells using different space for different border widths
		 */
		flex: 1;
		width: 0;
		position: relative;
		overflow: hidden;
		background-color: white;

		&.selected {
			background-color: blue;

			.content {
				top: 2px;
				left: 2px;
				right: 2px;
				bottom: 2px;

				.title {
					margin: 7px;
				}
			}
		}

		&.north .marker {
			top: $marker-offset;
			left: calc(50% - 2px);
		}

		&.east .marker {
			right: $marker-offset;
			top: calc(50% - 2px);
		}

		&.south .marker {
			bottom: $marker-offset;
			left: calc(50% - 2px);
		}

		&.west .marker {
			top: calc(50% - 2px);
			left: $marker-offset;
		}
	}

	.marker {
		position: absolute;
		width: 4px;
		height: 4px;
		z-index: 10;
		background-color: white;
	}

	.door {
		position: absolute;
		z-index: 10;
		box-sizing: border-box;
		background-color: black;

		&.connected {
			background-color: rgb(222, 184, 135);
			border: 1px solid black;
		}

		&.north {
			top: 0;
			height: $door-thickness;
			left: calc((100% - $door-size) / 2);
			width: $door-size;
			border-top: none;
		}

		&.east {
			right: 0;
			width: $door-thickness;
			top: calc((100% - $door-size) / 2);
			height: $door-size;
			border-right: none;
		}

		&.south {
			bottom: 0;
			height: $door-thickness;
			left: calc((100% - $door-size) / 2);
			width: $door-size;
			border-bottom: none;
		}

		&.west {
			left: 0;
			width: $door-thickness;
			top: calc((100% - $door-size) / 2);
			height: $door-size;
			border-left: none;
		}
	}

	.content {
		position: absolute;
		top: 1px;
		left: 1px;
		right: 1px;
		bottom: 1px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: black;

		&.supported {
			background-color: rgb(80, 80, 80);
		}

		.title {
			margin: 8px;
			text-align: center;
		}

		&.below > .title {
			opacity: 0.5;
		}
	}

	.sidebar {
		flex-grow: 1;
		padding: 8px;
	}

	.stats {
		display: flex;
		flex-direction: column;

		table {
			border-collapse: collapse;
			border-spacing: 0;
			color: white;
		}

		th,
		td {
			padding: 4px 16px;
			white-space: nowrap;
		}

		th {
			border-bottom: 1px solid white;

			&:first-child {
				padding-left: 4px;
			}
			&:last-child {
				padding-right: 4px;
			}
		}

		tr:not(:last-child) > td {
			border-bottom: 1px dashed gray;
		}

		td {
			&:first-child {
				padding-left: 4px;
			}
			&:last-child {
				padding-right: 4px;
			}

			&.number {
				text-align: right;
			}
		}

		.max td {
			background-color: #de7309;
		}
	}

	.alerts {
		margin-bottom: 12px;

		.alert {
			box-sizing: border-box;
			border: 1px solid white;
			background-color: gray;
			margin: 0;
			padding: 8px;

			&.error {
				background-color: darkred;
			}
		}
	}
</style>
