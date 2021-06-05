<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = ({ page }) => {
		if (page.query.has('formula')) {
			return {
				props: {
					formula: page.query.get('formula'),
				},
			};
		}
		return {};
	};
</script>

<script lang="ts">
	import { parse } from '$lib/logic/parse';
	import { computeTruthTable } from '$lib/logic/truth-table';
	import Tree from '$lib/tree/Tree.svelte';
	import { restrictOperators, getAllowed } from '$lib/logic/transform';

	export let formula: string | undefined;

	const node = formula ? parse(formula) : undefined;
	const truthTable = formula ? computeTruthTable(node) : undefined;

	let input = '';

	let allowedOps: string = 'all';
	let restricted: string;
	$: restricted = restrictOperators(node, getAllowed(allowedOps))?.toBasicString();
</script>

{#if !formula}
	<form>
		<input bind:value={input} />
		<a href={`/logik?formula=${encodeURIComponent(input)}`}>Ok</a>
	</form>
{/if}

{#if formula && node}
	<p>{node?.toBasicString()}</p>

	<h3>Syntaxbaum</h3>

	<Tree {node} />

	<h3>Wahrheitstabelle</h3>

	<table class="truth">
		<tr>
			{#each truthTable.head as h}
				<th>{h}</th>
			{/each}
		</tr>
		{#each truthTable.rows as r}
			<tr>
				{#each r.world as c}
					<td>{c}</td>
				{/each}
				{#each r.result as c}
					<td>{c}</td>
				{/each}
			</tr>
		{/each}
	</table>

	<h3>Eingeschränkte Konnektive</h3>

	<form>
		<div>
			<input type="radio" id="k-all" bind:group={allowedOps} value="all" checked />
			<label for="k-all">¬, ∧, ∨, →, ↔</label>
		</div>
		<div>
			<input type="radio" id="k-no-equiv" bind:group={allowedOps} value="no-equiv" />
			<label for="k-no-equiv">¬, ∧, ∨, →</label>
		</div>
		<div>
			<input type="radio" id="k-no-impl" bind:group={allowedOps} value="no-impl" />
			<label for="k-no-impl">¬, ∧, ∨</label>
		</div>
		<div>
			<input type="radio" id="k-no-or" bind:group={allowedOps} value="no-or" />
			<label for="k-no-or">¬, ∧</label>
		</div>
		<div>
			<input type="radio" id="k-no-and" bind:group={allowedOps} value="no-and" />
			<label for="k-no-and">¬, ∨</label>
		</div>
		<div>
			<input type="radio" id="k-scheffer" bind:group={allowedOps} value="scheffer" />
			<label for="k-scheffer">|</label>
		</div>
		<div>
			<input type="radio" id="k-nor" bind:group={allowedOps} value="nor" />
			<label for="k-nor">N</label>
		</div>
	</form>

	{restricted}
{/if}

<svg id="kbar-svg" />

<style lang="scss">
	.truth {
		width: 100%;
		border-collapse: collapse;

		th {
			border-bottom: 1px solid #333;
			font-weight: 400;
		}

		tr:nth-of-type(even) {
			background-color: #eee;
		}

		td {
			text-align: center;
		}
	}
</style>
