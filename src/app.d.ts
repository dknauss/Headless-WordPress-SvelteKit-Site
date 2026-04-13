// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			sessionId: string;
			csrfToken: string;
			clientIp: string;
		}
	}
}

export {};
