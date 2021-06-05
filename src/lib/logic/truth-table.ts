import type { Logic } from '$lib/types';
import { collectAtoms } from './util';

const stringify = (b: boolean) => (b ? 'T' : 'F');

export const computeTruthTable = (n: Logic.Node) => {
	const atoms = [...collectAtoms(n)].sort();
	const rows: { world: string[]; result: string[] }[] = [];
	for (const i of getAllInterpretations(atoms)) {
		const world: string[] = [];
		for (const a of atoms) {
			world.push(stringify(i[a]));
		}
		rows.push({ world, result: [stringify(n.evaluate(i))] });
	}
	return { head: [...atoms, n.toBasicString()], rows };
};

const getAllInterpretations = (atoms: string[]): Logic.Interpretation[] => {
	const width = atoms.length;

	if (width === 0) throw new Error('No atoms');

	if (width === 1) return [{ [atoms[0]]: false }, { [atoms[0]]: true }];

	const ips: Logic.Interpretation[] = [];

	const [, ...rest] = atoms;

	const restI = getAllInterpretations(rest);

	for (const i of restI) {
		ips.push({ ...i, [atoms[0]]: false });
	}
	for (const i of restI) {
		ips.push({ ...i, [atoms[0]]: true });
	}

	return ips;
};
