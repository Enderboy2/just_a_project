// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			session: Session | null;
		getSession: () => Promise<{
			user: { id: string; email: string };
			expires: Date;
		}>;
	}
	}
}

export {};
