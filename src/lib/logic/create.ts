import type { Logic } from '$lib/types';

export class AtomWrapper implements Logic.Wrapped<Logic.Atom> {
	kind: 'atom';
	name: string;

	constructor(name: string) {
		this.kind = 'atom';
		this.name = name;
	}
	operatorString(): string {
		return this.name;
	}
	evaluate(i: Logic.Interpretation): boolean {
		if (this.name in i) {
			return i[this.name];
		} else {
			throw new Error(`${this.name} is missing in the interpretation`);
		}
	}
	toBasicString(): string {
		return this.name;
	}
	neg() {
		return neg(this);
	}
	and(right: Logic.Node) {
		return and(this, right);
	}
	or(right: Logic.Node) {
		return or(this, right);
	}
	impl(right: Logic.Node) {
		return impl(this, right);
	}
	equiv(right: Logic.Node) {
		return equiv(this, right);
	}
}

export const atom = (name: string): Logic.Wrapped<Logic.Atom> => new AtomWrapper(name);

export class NegWrapper implements Logic.Wrapped<Logic.Neg> {
	kind: 'neg';
	child: Logic.Node;

	constructor(child: Logic.Node) {
		this.kind = 'neg';
		this.child = child;
	}
	operatorString(): string {
		return '¬';
	}
	evaluate(i: Logic.Interpretation): boolean {
		return !this.child.evaluate(i);
	}
	toBasicString(): string {
		return `¬${this.child.toBasicString()}`;
	}
	neg() {
		return neg(this);
	}
	and(right: Logic.Node) {
		return and(this, right);
	}
	or(right: Logic.Node) {
		return or(this, right);
	}
	impl(right: Logic.Node) {
		return impl(this, right);
	}
	equiv(right: Logic.Node) {
		return equiv(this, right);
	}
}

export const neg = (child: Logic.Node): Logic.Wrapped<Logic.Neg> => new NegWrapper(child);

export class AndWrapper implements Logic.Wrapped<Logic.And> {
	kind: 'and';
	left: Logic.Node;
	right: Logic.Node;

	constructor(left: Logic.Node, right: Logic.Node) {
		this.kind = 'and';
		this.left = left;
		this.right = right;
	}
	operatorString(): string {
		return '∧';
	}
	evaluate(i: Logic.Interpretation): boolean {
		return this.left.evaluate(i) && this.right.evaluate(i);
	}
	toBasicString(): string {
		return `(${this.left.toBasicString()} ∧ ${this.right.toBasicString()})`;
	}
	neg() {
		return neg(this);
	}
	and(right: Logic.Node) {
		return and(this, right);
	}
	or(right: Logic.Node) {
		return or(this, right);
	}
	impl(right: Logic.Node) {
		return impl(this, right);
	}
	equiv(right: Logic.Node) {
		return equiv(this, right);
	}
}

export const and = (left: Logic.Node, right: Logic.Node): Logic.Wrapped<Logic.And> =>
	new AndWrapper(left, right);

export class OrWrapper implements Logic.Wrapped<Logic.Or> {
	kind: 'or';
	left: Logic.Node;
	right: Logic.Node;

	constructor(left: Logic.Node, right: Logic.Node) {
		this.kind = 'or';
		this.left = left;
		this.right = right;
	}
	operatorString(): string {
		return '∨';
	}
	evaluate(i: Logic.Interpretation): boolean {
		return this.left.evaluate(i) || this.right.evaluate(i);
	}
	toBasicString(): string {
		return `(${this.left.toBasicString()} ∨ ${this.right.toBasicString()})`;
	}
	neg() {
		return neg(this);
	}
	and(right: Logic.Node) {
		return and(this, right);
	}
	or(right: Logic.Node) {
		return or(this, right);
	}
	impl(right: Logic.Node) {
		return impl(this, right);
	}
	equiv(right: Logic.Node) {
		return equiv(this, right);
	}
}

export const or = (left: Logic.Node, right: Logic.Node): Logic.Wrapped<Logic.Or> =>
	new OrWrapper(left, right);

export class ImplWrapper implements Logic.Wrapped<Logic.Impl> {
	kind: 'impl';
	left: Logic.Node;
	right: Logic.Node;

	constructor(left: Logic.Node, right: Logic.Node) {
		this.kind = 'impl';
		this.left = left;
		this.right = right;
	}
	operatorString(): string {
		return '→';
	}
	evaluate(i: Logic.Interpretation): boolean {
		return !this.left.evaluate(i) || this.right.evaluate(i);
	}
	toBasicString(): string {
		return `(${this.left.toBasicString()} → ${this.right.toBasicString()})`;
	}
	neg() {
		return neg(this);
	}
	and(right: Logic.Node) {
		return and(this, right);
	}
	or(right: Logic.Node) {
		return or(this, right);
	}
	impl(right: Logic.Node) {
		return impl(this, right);
	}
	equiv(right: Logic.Node) {
		return equiv(this, right);
	}
}

export const impl = (left: Logic.Node, right: Logic.Node): Logic.Wrapped<Logic.Impl> =>
	new ImplWrapper(left, right);

export class EquivWrapper implements Logic.Wrapped<Logic.Equiv> {
	kind: 'equiv';
	left: Logic.Node;
	right: Logic.Node;

	constructor(left: Logic.Node, right: Logic.Node) {
		this.kind = 'equiv';
		this.left = left;
		this.right = right;
	}
	operatorString(): string {
		return '↔';
	}
	evaluate(i: Logic.Interpretation): boolean {
		return this.left.evaluate(i) === this.right.evaluate(i);
	}
	toBasicString(): string {
		return `(${this.left.toBasicString()} ↔ ${this.right.toBasicString()})`;
	}
	neg() {
		return neg(this);
	}
	and(right: Logic.Node) {
		return and(this, right);
	}
	or(right: Logic.Node) {
		return or(this, right);
	}
	impl(right: Logic.Node) {
		return impl(this, right);
	}
	equiv(right: Logic.Node) {
		return equiv(this, right);
	}
}

export const equiv = (left: Logic.Node, right: Logic.Node): Logic.Wrapped<Logic.Equiv> =>
	new EquivWrapper(left, right);

export class SchefferWrapper implements Logic.Wrapped<Logic.Scheffer> {
	kind: 'scheffer';
	left: Logic.Node;
	right: Logic.Node;

	constructor(left: Logic.Node, right: Logic.Node) {
		this.kind = 'scheffer';
		this.left = left;
		this.right = right;
	}
	operatorString(): string {
		return '|';
	}
	evaluate(i: Logic.Interpretation): boolean {
		return !(this.left.evaluate(i) && this.right.evaluate(i));
	}
	toBasicString(): string {
		return `(${this.left.toBasicString()} | ${this.right.toBasicString()})`;
	}
	neg() {
		return neg(this);
	}
	and(right: Logic.Node) {
		return and(this, right);
	}
	or(right: Logic.Node) {
		return or(this, right);
	}
	impl(right: Logic.Node) {
		return impl(this, right);
	}
	equiv(right: Logic.Node) {
		return equiv(this, right);
	}
}

export const scheffer = (left: Logic.Node, right: Logic.Node): Logic.Wrapped<Logic.Scheffer> =>
	new SchefferWrapper(left, right);

export class NORWrapper implements Logic.Wrapped<Logic.NOR> {
	kind: 'nor';
	children: Logic.Node[];

	constructor(...children: Logic.Node[]) {
		this.kind = 'nor';
		this.children = children;
	}
	operatorString(): string {
		return 'N';
	}
	evaluate(i: Logic.Interpretation): boolean {
		return true;
	}
	toBasicString(): string {
		return `N(${this.children.map((c) => c.toBasicString()).join(', ')})`;
	}
	neg() {
		return neg(this);
	}
	and(right: Logic.Node) {
		return and(this, right);
	}
	or(right: Logic.Node) {
		return or(this, right);
	}
	impl(right: Logic.Node) {
		return impl(this, right);
	}
	equiv(right: Logic.Node) {
		return equiv(this, right);
	}
}

export const nor = (...children: Logic.Node[]): Logic.Wrapped<Logic.NOR> =>
	new NORWrapper(...children);
