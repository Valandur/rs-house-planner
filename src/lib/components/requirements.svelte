<script lang="ts">
	import type { LevelRequirement } from '$lib/models/Stats';

	export let requirements: LevelRequirement[];

	$: minLvl = requirements[0]?.level;
</script>

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

<style lang="scss">
	table {
		width: 100%;
	}
</style>
