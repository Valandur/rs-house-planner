<script lang="ts">
	import type { Room } from '$lib/models/Room';
	import { ROOM_TYPES_LIST } from '$lib/models/RoomType';

	export let rooms: (Room | null)[];

	$: groupedRooms = ROOM_TYPES_LIST.map(([key, type]) => ({
		type,
		rooms: rooms.filter((room) => room?.typeKey === key)
	})).sort((a, b) => b.rooms.length - a.rooms.length);
</script>

<table>
	<thead>
		<tr>
			<th>Type</th>
			<th class="right">Level</th>
			<th class="right">Cost</th>
			<th class="right">Amount</th>
			<th class="right">Total</th>
		</tr>
	</thead>
	<tbody>
		{#each groupedRooms as { type, rooms }}
			<tr>
				<td>{type.name}</td>
				<td class="right">{type.minLvl}</td>
				<td class="right">{type.cost}</td>
				<td class="right">{rooms.length || '-'}</td>
				<td class="right">{rooms.length > 0 ? rooms.length * type.cost : '-'}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	table {
		width: 100%;
	}
</style>
