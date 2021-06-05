/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
	userid: string;
}

export namespace Logic {
	type IdNode = { id: number; node: Node };

	type Node =
		| Wrapped<Atom>
		| Wrapped<Neg>
		| Wrapped<And>
		| Wrapped<Or>
		| Wrapped<Impl>
		| Wrapped<Equiv>
		| Wrapped<Scheffer>
		| Wrapped<NOR>;

	interface Base {
		kind: string;
	}

	interface Atom extends Base {
		kind: 'atom';
		name: string;
	}

	interface Neg extends Base {
		kind: 'neg';
		child: Node;
	}

	interface Binary {
		left: Node;
		right: Node;
	}

	interface And extends Base, Binary {
		kind: 'and';
	}

	interface Or extends Base, Binary {
		kind: 'or';
	}

	interface Impl extends Base, Binary {
		kind: 'impl';
	}

	interface Equiv extends Base, Binary {
		kind: 'equiv';
	}

	interface Scheffer extends Base, Binary {
		kind: 'scheffer';
	}

	interface NOR extends Base {
		kind: 'nor';
		children: Node[];
	}

	interface Wrapper {
		neg(): Node;
		and(right: Node): Node;
		or(right: Node): Node;
		impl(right: Node): Node;
		equiv(right: Node): Node;
		toBasicString(): string;
		evaluate(i: Interpretation): boolean;
		operatorString(): string;
	}

	type Wrapped<T> = T & Wrapper;

	type Interpretation = { [key: string]: boolean };
}

export namespace UI {
	export interface Transform {
		x: number;
		y: number;
		/**
		 * Scale factor.
		 */
		k: number;
	}

	export interface DragTransform {
		x: number;
		y: number;
	}

	export type Point = [number, number];

	export type Extent = [Point, Point];
}

export namespace Layout {
	export interface LayoutItem<T> {
		x: number;
		y: number;
		data: T;
	}

	export interface Layout {
		/**
		 * The width the svg element should have
		 */
		width: number;
		/**
		 * The height the svg element should have
		 */
		height: number;
	}

	export interface ArrayLayout<T> extends Layout {
		/**
		 * The array of items with their coordinates
		 */
		data: LayoutItem<T>[];
	}
}

export namespace Tree {
	export interface Tree<T> {
		width: number;
		height: number;
		x: number;
		y: number;
		prelim: number;
		mod: number;
		shift: number;
		change: number;

		/**
		 * Left thread.
		 */
		tl?: Tree<T>;
		/**
		 * Right thread.
		 */
		tr?: Tree<T>;

		/**
		 * Left extreme node.
		 */
		extremeLeft?: Tree<T>;
		/**
		 * Left extreme node.
		 */
		extremeRight?: Tree<T>;

		/**
		 * Sum of modifiers at the left extreme node
		 */
		modsEl: number;
		/**
		 * Sum of modifiers at the right extreme node
		 */
		modsEr: number;

		children: Tree<T>[];

		treeHeight: number;

		data: T;
	}

	export interface Link {
		srcId: number;
		targetId: number;
		source: UI.Point;
		target: UI.Point;
	}

	/**
	 * A linked list of the indexes of left siblings and their lowest vertical coordinate.
	 */
	export interface LeftSiblingList {
		lowY: number;
		idx: number;
		next?: LeftSiblingList;
	}

	export interface TreeLayout<T> extends Layout.Layout {
		root: Tree<T>;
		links: Link[];
	}
}
