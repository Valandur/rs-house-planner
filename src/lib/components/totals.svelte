<script lang="ts">
	export let price: number;
	export let extentX: number;
	export let extentY: number;
	export let minLvl: number;
</script>

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
