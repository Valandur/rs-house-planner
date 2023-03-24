<script lang="ts">
	export let errors: string[];
</script>

{#if errors.length > 0}
	{#each errors as error}
		<div class="alert error">{error}</div>
	{/each}
{:else}
	<div class="alert success">Your house looks good to go!</div>
{/if}

<style lang="scss">
	.alert {
		box-sizing: border-box;
		border: 1px solid #ebe6e6;
		background-color: gray;
		padding: 8px;

		&.error {
			background-color: darkred;
		}

		&.success {
			background-color: #034a03;
		}

		&:not(:last-child) {
			margin-bottom: 8px;
		}
	}
</style>
