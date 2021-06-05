export enum TokenKind {
	And,
	Or,
	Not,
	Impl,
	Equiv,
	LParen,
	RParen,
	Ident,
	Unknown,
}

export interface Token {
	kind: TokenKind;
	spelling: string;
	srcPos: number;
}

export const tokenize = (f: string) => {
	const toks: Token[] = [];
	let pos = 0;

	while (f.length > 0) {
		const wsMatch = /^\s+/.exec(f);
		if (wsMatch != null && wsMatch.length > 0) {
			const l = wsMatch[0].length;
			pos += l;
			f = f.substring(l);
			continue;
		}
		const [kind, spelling, len] = getToken(f, pos);
		toks.push({ kind, spelling, srcPos: pos });
		f = f.substring(len);
		pos += len;
	}

	return toks;
};

const getToken = (f: string, p: number): [TokenKind, string, number] => {
	switch (f[0]) {
		case '&':
			return [TokenKind.And, '&', 1];
		case '|':
			return [TokenKind.Or, '|', 1];
		case '!':
			return [TokenKind.Not, '!', 1];
		case '(':
			return [TokenKind.LParen, '(', 1];
		case ')':
			return [TokenKind.RParen, ')', 1];
		case '-': {
			if (f.startsWith('->')) {
				return [TokenKind.Impl, '->', 2];
			} else {
				throw new Error(`At ${p}: Expected ->, only got -`);
			}
		}
		case '<': {
			if (f.startsWith('<->')) {
				return [TokenKind.Equiv, '<->', 3];
			} else {
				throw new Error(`At ${p}: Expected <->, only got <`);
			}
		}
		default: {
			const match = /^[a-zA-Z0-9]+/.exec(f);
			if (match == null && match.length === 0) throw new Error(`At ${p}: Expected identifier`);
			const spelling = match[0];
			return [TokenKind.Ident, spelling, spelling.length];
		}
	}
};
