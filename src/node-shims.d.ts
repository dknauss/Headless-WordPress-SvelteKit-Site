declare module 'node:fs' {
	const fs: {
		mkdirSync(path: string, options?: { recursive?: boolean }): void;
		mkdtempSync(prefix: string): string;
		rmSync(path: string, options?: { recursive?: boolean; force?: boolean }): void;
	};

	export default fs;
}

declare module 'node:path' {
	const path: {
		join(...parts: string[]): string;
		dirname(path: string): string;
	};

	export default path;
}

declare module 'node:os' {
	const os: {
		tmpdir(): string;
	};

	export default os;
}

declare module 'node:crypto' {
	type Hmac = {
		update(value: string): Hmac;
		digest(encoding: 'hex'): string;
	};

	const crypto: {
		createHmac(algorithm: string, secret: string): Hmac;
		randomUUID(): string;
		timingSafeEqual(a: Buffer, b: Buffer): boolean;
	};

	export default crypto;
}

declare module 'node:sqlite' {
	export class StatementSync {
		get(...params: unknown[]): unknown;
		all(...params: unknown[]): unknown[];
		run(...params: unknown[]): unknown;
	}

	export class DatabaseSync {
		constructor(path: string);
		exec(sql: string): void;
		prepare(sql: string): StatementSync;
	}
}

declare class Buffer extends Uint8Array {
	static from(value: string): Buffer;
}

declare const process: {
	cwd(): string;
};
