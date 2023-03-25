<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { Direction, getDirName } from '$lib/models/Direction';
	import { getRotatedDoors, type Room } from '$lib/models/Room';

	export let room: Room | null;
	export let below: Room | null;
	export let connections: Direction[];
	export let selected: boolean;

	const dispatch = createEventDispatcher<{ selected: {} }>();
	const onSelected = () => dispatch('selected');

	$: doors = getRotatedDoors(room);
	$: dir = room ? getDirName(room.orientation) : '';
</script>

<div
	class="cell {dir}"
	on:click|stopPropagation={onSelected}
	on:keypress|stopPropagation={onSelected}
>
	{#if room}
		<div class="marker" style:background-color={room.type.color} />
		<div class="content" style:color={room.type.color} style:background-color={room.type.bg}>
			<div class="title">{room.type.name}</div>
		</div>
		{#each doors as door}
			<div class="door {getDirName(door)}" class:connected={connections.includes(door)} />
		{/each}
	{:else}
		<div class="content" class:below={!!below} class:supported={below && !below.type.open}>
			{#if below}
				<div class="title">{below.type.name}</div>
			{/if}
		</div>
	{/if}
	{#if selected}
		<div class="selected" />
	{/if}
</div>

<style lang="scss">
	$marker-offset: 12px; // distance from the cell border
	$door-thickness: 8px;
	$door-size: 30%; // percentage of the cell size (width/height)

	.cell {
		flex: 1;
		width: 0; // This fixes the cell changing sizes when the border thickness changes
		position: relative;
		overflow: hidden;
		background-color: gray;

		> .selected {
			position: absolute;
			box-sizing: content-box;
			border: 2px solid #ebe6e6;
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
</style>
