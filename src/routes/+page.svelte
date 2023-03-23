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

	$: setRoom = (x: number, y: number, typeKey: string | null) => {
		if (typeKey === null) {
			plots[floorIndex][y][x] = null;
		} else {
			plots[floorIndex][y][x] = { typeKey, orientation: Direction.North, furnitureKeys: {} };
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

	$: setFurniture = (x: number, y: number, hotspot: string, type: string | null) => {
		const plot = plots[floorIndex][y][x];
		if (!plot) {
			return;
		}

		plot.furnitureKeys[hotspot] = type;

		goto(`?${getUrl(plots)}`, { replaceState: true });
	};
</script>

<div class="map">
	<div class="grid">
		{#each extendedPlot as row, y}
			<div class="row">
				{#each row as extendedRoom, x}
					{@const selected = x === selX && y === selY}
					<div
						class="cell {extendedRoom?.orientation || ''}"
						on:click|stopPropagation={() => setSelected(x, y)}
						on:keypress|stopPropagation={() => setSelected(x, y)}
					>
						{#if extendedRoom !== null}
							<div class="marker" style:background-color={extendedRoom.type.color} />
							<div
								class="content"
								style:color={extendedRoom.type.color}
								style:background-color={extendedRoom.type.bg}
							>
								<div class="title">{extendedRoom.type.name}</div>
							</div>
							{#each extendedRoom.doors as { name, connected }}
								<div class="door {name}" class:connected />
							{/each}
						{:else}
							{@const below = extendedPlots[floorIndex - 1]?.[y][x]}
							<div
								class="content"
								class:below={!!below}
								class:supported={below && !below.type.open}
							>
								{#if below}
									<div class="title">{below.type.name}</div>
								{/if}
							</div>
						{/if}
						{#if selected}
							<div class="selected" />
						{/if}
					</div>
				{/each}
			</div>
		{/each}

		{#if selX !== null && selY !== null}
			{@const [x, y] = [selX, selY]}
			{@const yRatio = 100 / extendedPlot.length}
			{@const xRatio = 100 / extendedPlot[y].length}
			{@const below = extendedPlots[floorIndex - 1]?.[y][x]}
			{@const above = extendedPlots[floorIndex + 1]?.[y][x]}
			<div
				class="popup"
				style:top={y < SIZE_Y / 2 ? `${yRatio * (y + 1)}%` : ''}
				style:bottom={y >= SIZE_Y / 2 ? `${yRatio * (SIZE_Y - y)}%` : ''}
				style:left={x < SIZE_X / 2 ? `${xRatio * x}%` : ''}
				style:right={x >= SIZE_X / 2 ? `${xRatio * (SIZE_X - x - 1)}%` : ''}
			>
				{#if floor > 0 && (!below || below.type.open)}
					<p>There is no supporting room below!</p>
				{:else}
					<div>
						<select
							value={extendedPlot[y][x]?.typeKey || ''}
							on:change={(e) => setRoom(x, y, e.currentTarget.value)}
						>
							<option value="" disabled selected>Pick a room...</option>
							{#each ROOM_TYPES_LIST as [key, type]}
								{@const disabled = type.floors && !type.floors.includes(floor)}
								<option {disabled} value={key}>
									{type.name}{disabled ? ` (floors: ${type.floors?.join(', ')})` : ''}
								</option>
							{/each}
						</select>

						{#if extendedPlot[y][x]}
							<button class="rotate" on:click|stopPropagation={() => rotateRoom(x, y)}>
								<i class="icofont-ui-rotation" />
							</button>
							<button
								class="remove"
								disabled={!!above}
								on:click|stopPropagation={() => setRoom(x, y, null)}
							>
								<i class="icofont-ui-delete" />
							</button>
						{/if}
					</div>

					{#if above}
						<p>This room is acting as a support for the one above it!</p>
					{/if}
				{/if}
			</div>
		{/if}
	</div>
</div>

<div class="stats">
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

	<div>
		<h2>Help</h2>
		<ul>
			<li>Click a cell to the left to place a new room</li>
		</ul>
	</div>

	{#if stats.errors.length > 0}
		<div>
			<h2>Errors</h2>

			<div class="alerts">
				{#each stats.errors as error}
					<div class="alert error">{error}</div>
				{/each}
			</div>
		</div>
	{/if}

	<div>
		<h2>Totals</h2>
		<table>
			<tbody>
				<tr>
					<td>Cost</td>
					<td>{stats.totalPrice}</td>
				</tr>
				<tr>
					<td>Extent</td>
					<td>{stats.extent[0]}x{stats.extent[1]}</td>
				</tr>
				<tr>
					<td>Min Level</td>
					<td>{stats.levelRequirements[0]?.level || 0}</td>
				</tr>
			</tbody>
		</table>
	</div>

	{#if selX !== null && selY !== null}
		{@const [x, y, extendedRoom] = [selX, selY, extendedPlot[selY][selX]]}
		{#if extendedRoom}
			<div>
				<h2>Details</h2>
				<table>
					<tbody>
						<tr>
							<td>Name</td>
							<td>{extendedRoom.type.name}</td>
						</tr>
						<tr>
							<td>Cost</td>
							<td>{extendedRoom.type.cost}</td>
						</tr>
						<tr>
							<td>Min. Level</td>
							<td>{extendedRoom.type.minLvl}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div>
				<h3>Furniture</h3>
				<table>
					<tbody>
						{#each extendedRoom.furnitureHotspots as hotspot}
							<tr>
								<td>{hotspot.name}</td>
								<td>
									<select
										value={extendedRoom.furnitureKeys[hotspot.key] || ''}
										on:change={(e) => setFurniture(x, y, hotspot.key, e.currentTarget.value)}
									>
										<option value={''}>None</option>
										{#each hotspot.options as extendedType}
											<option value={extendedType.key}>{extendedType.name}</option>
										{/each}
									</select>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	{/if}
</div>

<div class="stats">
	<div>
		<h2>Requirements</h2>
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

	<div>
		<h2>Rooms</h2>
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

	.stats {
		flex: 1;
		padding: 8px;

		h2,
		h3 {
			margin-bottom: 8px;
		}

		> div {
			margin-bottom: 16px;
		}
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
		background-color: #ebe6e6;
		padding: 8px;
		display: flex;
		flex-direction: column;
		color: black;

		> div {
			display: flex;
			flex-direction: row;
			align-items: center;

			&:not(:last-child) {
				margin-bottom: 8px;
			}

			> *:not(:last-child) {
				margin-right: 8px;
			}
		}

		p {
			margin: 0;
			padding: 0;
			white-space: nowrap;
		}
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

	.cell {
		flex: 1;
		width: 0; // This fixes the cell changing sizes when the border thickness changes
		position: relative;
		overflow: hidden;
		background-color: gray;

		> .selected {
			position: absolute;
			box-sizing: content-box;
			border: 6px solid #ebe6e6;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 1000;
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
		background-color: #ebe6e6;
	}

	.door {
		position: absolute;
		z-index: 10;
		box-sizing: border-box;
		background-color: rgba(0, 0, 0, 0.5);

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

	table {
		border-collapse: collapse;
		border-spacing: 0;
		color: #ebe6e6;
	}

	th,
	td {
		padding: 4px 16px;
		white-space: nowrap;
	}

	th {
		border-bottom: 1px solid #ebe6e6;

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

	.alerts {
		margin-bottom: 16px;

		.alert {
			box-sizing: border-box;
			border: 1px solid #ebe6e6;
			background-color: gray;
			margin-bottom: 8px;
			padding: 8px;

			&.error {
				background-color: darkred;
			}
		}
	}
</style>
