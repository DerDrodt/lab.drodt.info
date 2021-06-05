<script lang="ts">
	import type { Logic, Tree } from '$lib/types';

	export let node: Tree.Tree<Logic.IdNode>;
</script>

<g>
	{#each node.children as c}
		<line class="link" x1={node.x} y1={node.y + 6} x2={c.x} y2={c.y - 16} />
		<svelte:self node={c} />
	{/each}
	<text x={node.x} y={node.y} text-anchor="middle">{node.data.node.operatorString()}</text>
</g>

<style lang="scss">
	.link {
		fill: none;
		stroke: #333;
		stroke-width: 2px;
	}
</style>
