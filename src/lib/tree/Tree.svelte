<script lang="ts">
	import { onMount } from 'svelte';
	import type { Logic, Tree } from '$lib/types';
	import Subtree from './Subtree.svelte';
	import { atom } from '$lib/logic/create';
	import { tree } from './layout';

	let logicTreeLayout = (node: Logic.Node): Tree.TreeLayout<Logic.IdNode> => {
		return {
			width: 0,
			height: 0,
			links: [],
			root: tree(0, 0, 0, { node: atom('root'), id: 0 }, []),
		};
	};

	onMount(async () => {
		const m = await import('$lib/tree/logic-tree');
		logicTreeLayout = m.logicTreeLayout;
		layout = logicTreeLayout(node);
	});

	export let node: Logic.Node;
	$: layout = logicTreeLayout(node);
	$: treeHeight = Math.max(layout.height, 200);
</script>

<svg
	width="100%"
	height="calc(100vh - 192px)"
	style="min-height: 60vh"
	viewBox={`0 -16 ${layout.width} ${treeHeight}`}
	preserveAspectRatio="xMidYMid meet"
>
	<Subtree node={layout.root} />
</svg>
