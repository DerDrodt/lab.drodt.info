import type { Logic, Tree } from '$lib/types';
import { estimateSVGTextWidth } from '$lib/util/text-width';
import { children } from '$lib/logic/util';
import { tree, treeLayout } from './layout';

/**
 * @param {TableauxNode[]} nodes - The nodes to work on
 * @returns {TreeLayout<TableauxTreeLayoutNode>} - The tree layout
 */
export const logicTreeLayout = (node: Logic.Node): Tree.TreeLayout<Logic.IdNode> => {
	const nodes: Logic.Node[] = [];
	addNodes(nodes, node);
	return treeLayout(nodes, nodeToTree);
};

const addNodes = (lst: Logic.Node[], n: Logic.Node) => {
	lst.push(n);
	for (const c of children(n)) addNodes(lst, c);
};

/**
 * Converts a list of TableauxNodes to a tree
 * @param {Array<TableauxNode>} nodes - The list of nodes
 * @param {TableauxNode} n - The current node
 * @param {number} i - Current index
 * @param {number} y - Current y position
 * @returns {Tree<TableauxTreeLayoutNode>} - The resulting tree
 */
const nodeToTree = (
	nodes: Logic.Node[],
	n: Logic.Node = nodes[0],
	i: number = 0,
	y: number = 16,
): Tree.Tree<Logic.IdNode> => {
	const width = estimateSVGTextWidth(n.toBasicString()) + 56;
	return tree(
		width,
		72,
		y,
		{ node: n, id: i },
		children(n).map((c) => nodeToTree(nodes, c, nodes.indexOf(c), y + 72)),
	);
};
