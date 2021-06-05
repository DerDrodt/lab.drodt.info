import type { Logic } from '$lib/types';

export const collectAtoms = (n: Logic.Node): Set<string> => {
	switch (n.kind) {
		case 'atom':
			return new Set(n.name);
		case 'neg':
			return collectAtoms(n.child);
		case 'and':
		case 'or':
		case 'impl':
		case 'equiv':
		case 'scheffer':
			return new Set([...collectAtoms(n.left), ...collectAtoms(n.right)]);
		case 'nor': {
			const s = new Set<string>();
			for (const c of n.children) {
				for (const a of collectAtoms(c)) {
					s.add(a);
				}
			}
			return s;
		}
	}
};

export const children = (n: Logic.Node): Logic.Node[] => {
	switch (n.kind) {
		case 'atom':
			return [];
		case 'neg':
			return [n.child];
		case 'and':
		case 'or':
		case 'impl':
		case 'equiv':
		case 'scheffer':
			return [n.left, n.right];
		case 'nor': {
			return n.children;
		}
	}
};

export const transformRecursively = () => {};
