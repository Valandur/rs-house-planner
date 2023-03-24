<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { FURNITURE_TYPES } from '$lib/models/FurnitureType';
	import { ROOM_TYPES, ROOM_TYPES_LIST } from '$lib/models/RoomType';
	import { SIZE_X, SIZE_Y } from '$lib/models/Plot';
	import type { Room } from '$lib/models/Room';

	import Tabs from './tabs.svelte';

	const halfX = SIZE_X / 2;
	const halfY = SIZE_Y / 2;
	const xRatio = 100 / SIZE_X;
	const yRatio = 100 / SIZE_Y;

	export let x: number;
	export let y: number;
	export let floor: number;
	export let room: Room | null;
	export let below: Room | null;
	export let above: Room | null;

	const dispatch = createEventDispatcher<{
		change: { x: number; y: number; typeKey: string | null };
		rotate: { x: number; y: number };
		furniture: { x: number; y: number; hotspotKey: string; furnitureKey: string };
	}>();

	$: change = (typeKey: string | null) => {
		dispatch('change', { x, y, typeKey });
	};
	$: rotate = () => {
		dispatch('rotate', { x, y });
	};
	$: changeFurniture = (hotspotKey: string, furnitureKey: string) => {
		dispatch('furniture', { x, y, hotspotKey, furnitureKey });
	};

	$: type = room ? ROOM_TYPES[room.typeKey] : null;
	$: belowType = below ? ROOM_TYPES[below.typeKey] : null;
	$: hotspots = type ? Object.entries(type.furnitureHotspots) : [];

	$: isTop = y < halfY;
	$: isLeft = x < halfX;
	$: top = isTop ? `${yRatio * (y + 1)}%` : '';
	$: bottom = !isTop ? `${yRatio * (SIZE_Y - y)}%` : '';
	$: left = isLeft ? `${xRatio * x}%` : '';
	$: right = !isLeft ? `${xRatio * (SIZE_X - x - 1)}%` : '';
	$: maxHeight = `calc(${(isTop ? SIZE_Y - y - 1 : y) * yRatio}% - 4px)`;
	$: maxWidth = `calc(${(isLeft ? SIZE_X - x - 1 : x) * xRatio}% - 4px)`;

	const getFurnitureOptions = (keys: string[]) => {
		return keys.map((key) => [key, FURNITURE_TYPES[key]] as const);
	};
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
		{#if floor > 0 && (!below || belowType?.open)}
			<p>There is no supporting room below!</p>
		{:else}
			<div>
				<select value={room?.typeKey || ''} on:change={(e) => change(e.currentTarget.value)}>
					<option value="" disabled selected>Pick a room...</option>
					{#each ROOM_TYPES_LIST as [key, type]}
						{@const disabled = type.floors && !type.floors.includes(floor)}
						<option {disabled} value={key}>
							{type.name}{disabled ? ` (floors: ${type.floors?.join(', ')})` : ''}
						</option>
					{/each}
				</select>

				{#if room}
					<button class="rotate" on:click|stopPropagation={rotate}>
						<i class="icofont-ui-rotation" />
					</button>
					<button class="remove" disabled={!!above} on:click|stopPropagation={() => change(null)}>
						<i class="icofont-ui-delete" />
					</button>
				{/if}
			</div>

			{#if floor >= 0 && above}
				<div>
					<i class="icofont-info" />
					<p>This room is supportting the one above it!</p>
				</div>
			{/if}

			{#if room && type}
				<Tabs tabs={['Details', 'Furniture']} inverted>
					<svelte:fragment let:tab>
						{#if tab === 'Details'}
							<table>
								<tbody>
									<tr>
										<td>Name</td>
										<td>{type.name}</td>
									</tr>
									<tr>
										<td>Cost</td>
										<td>{type.cost}</td>
									</tr>
									<tr>
										<td>Min. Level</td>
										<td>{type.minLvl}</td>
									</tr>
								</tbody>
							</table>
						{:else if tab === 'Furniture'}
							<table>
								<tbody>
									{#each hotspots as [hotspotKey, hotspot]}
										<tr>
											<td>{hotspot.name}</td>
											<td>
												<select
													value={room.furnitureKeys[hotspotKey] || ''}
													on:change={(e) => changeFurniture(hotspotKey, e.currentTarget.value)}
												>
													<option value="">None</option>
													{#each getFurnitureOptions(hotspot.optionKeys) as [furnitureKey, furnitureType]}
														<option value={furnitureKey}>{furnitureType.name}</option>
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
