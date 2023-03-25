<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { getFurnitureTypeByKey, type FurnitureType } from '$lib/models/FurnitureType';
	import { getRoomTypeByKey, ROOM_TYPES, type RoomType } from '$lib/models/RoomType';
	import { SIZE_X, SIZE_Y, type Floor } from '$lib/models/Floor';
	import type { Room } from '$lib/models/Room';

	import Tabs from './tabs.svelte';

	const halfX = SIZE_X / 2;
	const halfY = SIZE_Y / 2;
	const xRatio = 100 / SIZE_X;
	const yRatio = 100 / SIZE_Y;

	export let floor: Floor;
	export let x: number;
	export let y: number;
	export let room: Room | null;
	export let below: Room | null;
	export let above: Room | null;

	const dispatch = createEventDispatcher<{
		rotateRoom: { x: number; y: number };
		changeRoomType: { x: number; y: number; type: RoomType | null };
		changeFurniture: { x: number; y: number; hotspotIndex: number; type: FurnitureType | null };
	}>();

	$: rotateRoom = () => {
		dispatch('rotateRoom', { x, y });
	};
	$: changeRomType = (typeKey: string | null) => {
		dispatch('changeRoomType', { x, y, type: typeKey ? getRoomTypeByKey(typeKey) : null });
	};
	$: changeFurniture = (hotspotIndex: number, furnitureKey: string) => {
		dispatch('changeFurniture', {
			x,
			y,
			hotspotIndex,
			type: furnitureKey ? getFurnitureTypeByKey(furnitureKey) : null
		});
	};

	$: types = [...ROOM_TYPES].sort((a, b) => a.name.localeCompare(b.name));
	$: hotspots = room?.type.hotspots || [];

	$: isTop = y < halfY;
	$: isLeft = x < halfX;
	$: top = isTop ? `${yRatio * (y + 1)}%` : '';
	$: bottom = !isTop ? `${yRatio * (SIZE_Y - y)}%` : '';
	$: left = isLeft ? `${xRatio * x}%` : '';
	$: right = !isLeft ? `${xRatio * (SIZE_X - x - 1)}%` : '';
	$: maxHeight = `calc(${(isTop ? SIZE_Y - y - 1 : y) * yRatio}% - 4px)`;
	$: maxWidth = `calc(${(isLeft ? SIZE_X - x - 1 : x) * xRatio}% - 4px)`;
</script>

<div
	class="popup"
	style:top
	style:bottom
	style:left
	style:right
	style:max-height={maxHeight}
	style:maxWidth
>
	<div class="content">
		{#if floor.num > 0 && (!below || below.type?.open)}
			<p>There is no supporting room below!</p>
		{:else}
			<div>
				<select
					value={room?.type.key || ''}
					on:change={(e) => changeRomType(e.currentTarget.value)}
				>
					<option value="" disabled selected>Pick a room...</option>
					{#each types as type}
						{@const disabled = type.floors && !type.floors.includes(floor.num)}
						<option {disabled} value={type.key}>
							{type.name}{disabled ? ` (floors: ${type.floors?.join(', ')})` : ''}
						</option>
					{/each}
				</select>

				{#if room}
					<button class="rotate" on:click|stopPropagation={rotateRoom}>
						<i class="icofont-ui-rotation" />
					</button>
					<button
						class="remove"
						disabled={!!above}
						on:click|stopPropagation={() => changeRomType(null)}
					>
						<i class="icofont-ui-delete" />
					</button>
				{/if}
			</div>

			{#if floor.num >= 0 && above}
				<div>
					<i class="icofont-info" />
					<p>This room is supportting the one above it!</p>
				</div>
			{/if}

			{#if room}
				<Tabs tabs={['Details', 'Furniture']} inverted>
					<svelte:fragment let:tab>
						{#if tab === 'Details'}
							<table>
								<tbody>
									<tr>
										<td>Name</td>
										<td>{room.type.name}</td>
									</tr>
									<tr>
										<td>Cost</td>
										<td>{room.type.cost}</td>
									</tr>
									<tr>
										<td>Min. Level</td>
										<td>{room.type.minLvl}</td>
									</tr>
								</tbody>
							</table>
						{:else if tab === 'Furniture'}
							<table>
								<tbody>
									{#each hotspots as hotspot, i}
										<tr>
											<td>{hotspot.name}</td>
											<td>
												<select
													value={room.hotspots[i]?.key || ''}
													on:change={(e) => changeFurniture(i, e.currentTarget.value)}
												>
													<option value="">None</option>
													{#each hotspot.options.map( (o) => getFurnitureTypeByKey(o) ) as furnitureType}
														<option value={furnitureType.key}>{furnitureType.name}</option>
													{/each}
												</select>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						{/if}
					</svelte:fragment>
				</Tabs>
			{/if}
		{/if}
	</div>
</div>

<style lang="scss">
	.popup {
		position: absolute;
		z-index: 100;
		background-color: #ebe6e6;
		display: flex;
		flex-direction: column;
		color: black;
		overflow: auto;

		.content {
			padding: 8px;

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
		}

		p {
			margin: 4px;
		}

		:global(td) {
			color: black;
		}
	}
</style>
