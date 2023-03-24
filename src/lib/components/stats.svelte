<script lang="ts">
	import { ROOM_TYPES } from '$lib/models/RoomType';
	import { SIZE_X, SIZE_Y, type Plot } from '$lib/models/Plot';
	import type { Room } from '$lib/models/Room';
	import { SIZE_LIMITS } from '$lib/models/SizeLimit';

	interface LevelRequirement {
		name: string;
		value: number | string;
		limit: number | string;
		level: number;
	}

	export let plots: Plot[];

	$: rooms = plots.flat(2).filter((r) => !!r) as Room[];

	let price = 0;
	let extentX = 0;
	let extentY = 0;
	let minLvl = 0;
	let errors: string[] = [];
	let requirements: LevelRequirement[] = [];

	$: {
		let cost = 0;
		let minX = SIZE_X;
		let minY = SIZE_Y;
		let maxX = 0;
		let maxY = 0;
		let maxRoom: Room | null = null;

		const reqs: LevelRequirement[] = [];
		const errs: string[] = [];

		for (const room of rooms) {
			const type = ROOM_TYPES[room.typeKey];
			cost += type.cost;
			maxRoom = maxRoom && type.minLvl <= ROOM_TYPES[maxRoom.typeKey].minLvl ? maxRoom : room;
			minX = Math.min(minX, room.x);
			maxX = Math.max(maxX, room.x);
			minY = Math.min(minY, room.y);
			maxY = Math.max(maxY, room.y);
		}

		if (maxRoom) {
			const type = ROOM_TYPES[maxRoom.typeKey];
			reqs.push({
				name: 'Highest Level Room',
				value: type.name,
				limit: '-',
				level: type.minLvl
			});
		}

		if (rooms.length > 0) {
			const reqNumRooms = SIZE_LIMITS.find((limit) => limit.rooms >= rooms.length);
			if (reqNumRooms) {
				reqs.push({
					name: 'Number of Rooms',
					value: rooms.length,
					limit: reqNumRooms.rooms,
					level: reqNumRooms.level
				});
			} else {
				const limit = SIZE_LIMITS[SIZE_LIMITS.length - 1].rooms;
				errs.push(`You have too many rooms (${rooms.length})! You cannot have more than ${limit}`);
			}
		}

		const diffX = Math.max(0, maxX - minX + 1);
		if (diffX > 0) {
			const reqExtentX = SIZE_LIMITS.find((limit) => limit.extent[0] >= diffX);
			if (reqExtentX) {
				reqs.push({
					name: 'Extent X',
					value: diffX,
					limit: reqExtentX.extent[0],
					level: reqExtentX.level
				});
			} else {
				const limit = SIZE_LIMITS[SIZE_LIMITS.length - 1].extent[0];
				errs.push(`Your house is too wide (${diffX})! It can be at most ${limit} wide`);
			}
		}

		const diffY = Math.max(0, maxY - minY + 1);
		if (diffY > 0) {
			const reqExtentY = SIZE_LIMITS.find((limit) => limit.extent[1] >= diffY);
			if (reqExtentY) {
				reqs.push({
					name: 'Extent Y',
					value: diffY,
					limit: reqExtentY.extent[1],
					level: reqExtentY.level
				});
			} else {
				const limit = SIZE_LIMITS[SIZE_LIMITS.length - 1].extent[1];
				errs.push(`Your house is too tall (${diffY})! It can be at most ${limit} tall`);
			}
		}

		price = cost;
		extentX = diffX;
		extentY = diffY;
		minLvl = requirements[0]?.level;
		requirements = reqs.sort((a, b) => b.level - a.level);
		errors = errs;
	}
</script>

{#if errors.length > 0}
	<div>
		<h2>Errors</h2>

		<div class="alerts">
			{#each errors as error}
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
				<td>{price}</td>
			</tr>
			<tr>
				<td>Extent</td>
				<td>{extentX}x{extentY}</td>
			</tr>
			<tr>
				<td>Min Level</td>
				<td>{minLvl}</td>
			</tr>
		</tbody>
	</table>
</div>

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
			{#each requirements as req}
				<tr class:max={req.level === minLvl}>
					<td>{req.name}</td>
					<td>{req.value}</td>
					<td>{req.limit}</td>
					<td>{req.level}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style lang="scss">
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

	.max td {
		background-color: #de7309;
	}
</style>
