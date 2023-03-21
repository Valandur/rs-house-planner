<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { createEmptyPlot, getExtendedPlots } from '$lib/models/Plot';
	import { Direction, rotateClockwise } from '$lib/models/Direction';
	import { ROOM_TYPES_LIST } from '$lib/models/RoomType';
	import { FLOORS } from '$lib/models/Floor';

	import { getUrl, parseUrl } from '$lib/utils';

	let floor = 1;
	let plots = parseUrl($page.url.searchParams);
	$: extendedPlots = getExtendedPlots(plots);

	$: rooms = extendedPlots
		.flat(2)
		.filter((room) => !!room)
		.map((room) => room);
	$: groupedRooms = ROOM_TYPES_LIST.map(
		([key, type]) => [type, rooms.filter((room) => room?.type === key)] as const
	).sort(([, a], [, b]) => b.length - a.length);
	$: totalPrice = rooms.reduce((acc, curr) => acc + (curr?.cost || 0), 0);
	$: minLevel = rooms.reduce((acc, curr) => Math.max(acc, curr?.minLvl || 0), 0);

	$: setRoom = (x: number, y: number, type: string | null) => {
		if (type === null) {
			plots[floor][y][x] = null;
		} else {
			plots[floor][y][x] = { type, orientation: Direction.North };
		}

		goto(`?${getUrl(plots)}`, { replaceState: true });
	};
	$: rotateRoom = (x: number, y: number) => {
		const room = plots[floor][y][x];
		if (room) {
			plots[floor][y][x] = { ...room, orientation: rotateClockwise(room.orientation) };
			goto(`?${getUrl(plots)}`, { replaceState: true });
		}
	};
	$: reset = () => (plots[floor] = createEmptyPlot());

	let selX: number | null = null;
	let selY: number | null = null;
	$: setSelected = (x: number | null, y: number | null) => {
		selX = x;
		selY = y;
	};
</script>

<div class="container">
	<div class="map">
		<div class="grid">
			{#each extendedPlots[floor] as row, y}
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
								{@const below = extendedPlots[floor - 1]?.[y][x]}
								{#if below}
									<div class="content below" class:supported={!below.open}>
										<div class="title">{below.name}</div>
									</div>
								{/if}
							{/if}
						</div>
					{/each}
				</div>
			{/each}

			{#if selX !== null && selY !== null}
				{@const x = selX}
				{@const y = selY}
				{@const plot = extendedPlots[floor]}
				{@const below = extendedPlots[floor - 1]?.[y][x]}
				<div
					class="popup"
					style:top="{(100 / plot.length) * (y + 1)}%"
					style:left="{(100 / plot[y].length) * x}%"
				>
					{#if FLOORS[floor] > 0 && (!below || below.open)}
						<p>There is no supporting room below!</p>
					{:else}
						<select
							value={plot[y][x]?.type || ''}
							on:change={(e) => setRoom(x, y, e.currentTarget.value)}
						>
							<option value="" disabled selected>Pick a room...</option>
							{#each ROOM_TYPES_LIST as [key, type]}
								<option value={key}>{type.name}</option>
							{/each}
						</select>
					{/if}

					{#if plot[y][x]}
						<button class="rotate" on:click|stopPropagation={() => rotateRoom(x, y)}>⟳</button>
						<button class="remove" on:click|stopPropagation={() => setRoom(x, y, null)}>x</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<div
	class="stats"
	on:click={() => setSelected(null, null)}
	on:keypress={() => setSelected(null, null)}
>
	<h2>Floor</h2>
	<select bind:value={floor}>
		{#each FLOORS as label, floor}
			<option value={floor}>Floor {label}</option>
		{/each}
	</select>

	<h2>Info</h2>
	<div>Cost: {totalPrice}</div>
	<div>Level: {minLevel}</div>

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
			{#each groupedRooms as [type, rooms]}
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

	<h2>Controls</h2>
	<button on:click={() => reset()}>Reset</button>
</div>

<style lang="scss">
	$marker-offset: 12px; // distance from the cell border
	$door-thickness: 6px;
	$door-size: 30%; // percentage of the cell size (width/height)

	.container {
		flex: 2;
		display: flex;
		padding: 8px;
		flex-direction: column;
		align-items: flex-end;
	}

	.map {
		width: calc(min(99vh, 100%) - 8px);
		padding-bottom: calc(min(99vh, 100%) - 8px);
		position: relative;
	}

	.grid {
		width: 100%;
		height: 100%;
		align-self: center;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		border: 1px solid white;
		position: absolute;
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
		flex: 1;
		position: relative;
		box-sizing: border-box;
		border: 1px solid white;
		overflow: hidden;

		&.selected {
			border: 1px solid blue;
			background-color: blue;
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
		background-color: rgba(0, 0, 0, 0.6);

		&.connected {
			background-color: rgb(222, 184, 135);
		}

		&.north {
			top: 0;
			height: $door-thickness;
			left: (100% - $door-size) / 2;
			width: $door-size;
			border-top: none;
		}

		&.east {
			right: 0;
			width: $door-thickness;
			top: (100% - $door-size) / 2;
			height: $door-size;
			border-right: none;
		}

		&.south {
			bottom: 0;
			height: $door-thickness;
			left: (100% - $door-size) / 2;
			width: $door-size;
			border-bottom: none;
		}

		&.west {
			left: 0;
			width: $door-thickness;
			top: (100% - $door-size) / 2;
			height: $door-size;
			border-left: none;
		}
	}

	.content {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		&.supported {
			background-color: rgb(50, 50, 50);
		}

		.title {
			margin: 8px;
			text-align: center;
		}

		&.below > .title {
			opacity: 0.5;
		}
	}

	.stats {
		flex: 1;
		padding: 8px;

		h2:first-child {
			margin-top: 0;
		}

		table {
			border-collapse: collapse;
			border-spacing: 0;
		}

		th,
		td {
			padding: 2px 16px;
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

		td {
			border-bottom: 1px dashed gray;

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
	}
</style>
