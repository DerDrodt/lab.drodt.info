import type { Logic } from '$lib/types';
import { nor, scheffer } from './create';
import { children } from './util';

export enum Allowed {
	NOR = 1,
	Scheffer = 1 << 1,
	Neg = 1 << 2,
	Or = 1 << 3,
	And = 1 << 4,
	Impl = 1 << 5,
	Equiv = 1 << 6,

	NoAnd = Neg | Or,
	NoOr = Neg | And,
	NoImpl = NoOr | Or,
	NoEquiv = NoImpl | Impl,
	All = NoEquiv | Equiv,
}

export const getAllowed = (s: string): Allowed => {
	switch (s) {
		case 'all':
			return Allowed.All;
		case 'no-equiv':
			return Allowed.NoEquiv;
		case 'no-impl':
			return Allowed.NoImpl;
		case 'no-or':
			return Allowed.NoOr;
		case 'no-and':
			return Allowed.NoAnd;
		case 'nor':
			return Allowed.NOR;
		case 'scheffer':
			return Allowed.Scheffer;
	}
};

export const restrictOperators = (n: Logic.Node, allowed: Allowed): Logic.Node => {
	if (allowed === Allowed.All) return n;

	switch (n.kind) {
		case 'equiv': {
			if (allowed & Allowed.Equiv) {
				return restrictOperators(n.left, allowed).equiv(restrictOperators(n.right, allowed));
			}
			return restrictOperators(n.left.impl(n.right).and(n.right.impl(n.left)), allowed);
		}
		case 'impl': {
			if (allowed & Allowed.Impl) {
				return restrictOperators(n.left, allowed).impl(restrictOperators(n.right, allowed));
			}
			return restrictOperators(n.left.neg().or(n.right), allowed);
		}
		case 'and': {
			if (allowed & Allowed.And) {
				return restrictOperators(n.left, allowed).and(restrictOperators(n.right, allowed));
			}
			return restrictOperators(n.left.neg().or(n.right.neg()).neg(), allowed);
		}
		case 'or': {
			if (allowed & Allowed.Or) {
				return restrictOperators(n.left, allowed).or(restrictOperators(n.right, allowed));
			}
			return restrictOperators(n.left.neg().and(n.right.neg()).neg(), allowed);
		}
		case 'neg': {
			if (allowed & Allowed.Neg) {
				return restrictOperators(n.child, allowed).neg();
			}
			if (allowed === Allowed.Scheffer) {
				if (n.child.kind === 'and') {
					return restrictOperators(scheffer(n.child.left, n.child.right), allowed);
				}
				return restrictOperators(scheffer(n.child, n.child), allowed);
			}
			if (allowed === Allowed.NOR) {
				if (n.child.kind === 'or') {
					return restrictOperators(nor(n.child.left, n.child.right), allowed);
				}
				return restrictOperators(nor(n.child), allowed);
			}
			return n;
		}
		case 'nor': {
			if (allowed !== Allowed.NOR) {
				let stub = n.children[0];
				for (let i = 1; i < n.children.length; i++) {
					stub = stub.or(n.children[i]);
				}
				return restrictOperators(stub.neg(), allowed);
			}
			return nor(...n.children.map((c) => restrictOperators(c, allowed)));
		}
		case 'scheffer': {
			if (allowed !== Allowed.Scheffer) {
				return restrictOperators(n.left.and(n.right).neg(), allowed);
			}
			return scheffer(restrictOperators(n.left, allowed), restrictOperators(n.right, allowed));
		}
		case 'atom': {
			return n;
		}
	}
};

const simplifyNOR = (n: Logic.Node): Logic.Node => {
	if (n.kind === 'nor')
		if (
			n.children.length === 1 &&
			n.children[0].kind === 'nor' &&
			n.children[0].children.length === 1
		) {
			return simplifyNOR(n.children[0].children[0]);
		}
};
