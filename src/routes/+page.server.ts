// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const {
		data: { session }
	} = await locals.supabase.auth.getSession();
	if (!locals.supabase) {
	throw new Error('Supabase client not found in locals');
}

	return {
		isLoggedIn: !!session
	};
};
