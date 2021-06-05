import type { Logic } from '$lib/types';
import { atom, neg } from './create';
import { Token, tokenize, TokenKind } from './token';

interface Parser {
	toks: Token[];
}

export const parse = (f: string): Logic.Node => {
	const p: Parser = {
		toks: tokenize(f).reverse(),
	};
	const node = parseEquivImpl(p);
	if (p.toks.length) {
		throw new Error(`Expected eond of input, got ${current(p).spelling}`);
	}
	return node;
};

const parseEquivImpl = (p: Parser): Logic.Node => {
	let stub = parseAndOr(p);

	while (nextIs(p, TokenKind.Equiv) || nextIs(p, TokenKind.Impl)) {
		const isEquiv = current(p).kind === TokenKind.Equiv;
		bump(p);
		const right = parseAndOr(p);
		stub = isEquiv ? stub.equiv(right) : stub.impl(right);
	}

	return stub;
};

const parseAndOr = (p: Parser): Logic.Node => {
	let stub = parseNeg(p);

	while (nextIs(p, TokenKind.And) || nextIs(p, TokenKind.Or)) {
		const isAnd = current(p).kind === TokenKind.And;
		bump(p);
		const right = parseNeg(p);
		stub = isAnd ? stub.and(right) : stub.or(right);
	}

	return stub;
};

const parseNeg = (p: Parser): Logic.Node => {
	if (nextIs(p, TokenKind.Not)) {
		bump(p);
		return neg(parseParen(p));
	} else {
		return parseParen(p);
	}
};

const parseParen = (p: Parser): Logic.Node => {
	if (nextIs(p, TokenKind.LParen)) {
		bump(p);
		const expr = parseEquivImpl(p);
		eat(p, TokenKind.RParen);
		return expr;
	} else {
		return parseAtom(p);
	}
};

const parseAtom = (p: Parser): Logic.Wrapped<Logic.Atom> => {
	if (!nextIs(p, TokenKind.Ident)) {
		throw new Error(`Expected identifier, got ${current(p).spelling}`);
	}
	const a = atom(current(p).spelling);
	bump(p);
	return a;
};

const nextIs = (p: Parser, expected: TokenKind): boolean => {
	return p.toks.length && p.toks[p.toks.length - 1].kind === expected;
};

const bump = (p: Parser) => {
	if (p.toks.length) p.toks.pop();
	else throw new Error(`Expected token, got EOI`);
};

const eat = (p: Parser, expected: TokenKind) => {
	if (nextIs(p, expected)) bump(p);
	else throw new Error(`Expected ${expected}, got ${current(p).spelling}`);
};

const current = (p: Parser): Token => {
	if (p.toks.length) {
		return p.toks[p.toks.length - 1];
	} else {
		throw new Error(`Expected token, got EOI`);
	}
};
