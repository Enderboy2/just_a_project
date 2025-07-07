import { db } from '$lib/server/db';
import { subjects } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.session?.user;
	console.log('[LOAD] User:', user);

	if (!user) {
		console.warn('[LOAD] No user session found. Redirecting to /login.');
		throw redirect(303, '/login');
	}

	try {
		const subjectList = await db
			.select()
			.from(subjects)
			.where(eq(subjects.userId, user.id));

		console.log('[LOAD] Subjects found:', subjectList);

		return { subjects: subjectList, userId: user.id };
	} catch (err) {
		console.error('[LOAD ERROR]', err);
		throw new Error('Failed to load subjects');
	}
};

export const actions: Actions = {
add: async ({ request, locals }) => {
	const user = locals.session?.user;
	if (!user) throw redirect(303, '/login');

	const form = await request.formData();
	let name = form.get('name')?.toString()?.trim();
	if (!name) name = 'New Subject';
  console.log('[ADD ACTION] Inserting subject:', name, 'for user:', user.id);

	await db.insert(subjects).values({
		name,
		userId: user.id,
		fileCount: 0
	});
  console.log('[ADD ACTION] Inserted');

	return { success: true };
},

	delete: async ({ request, locals }) => {
		console.log('[DELETE ACTION] Called');
		const user = locals.session?.user;
		console.log('[DELETE ACTION] User:', user);

		if (!user) {
			console.warn('[DELETE ACTION] No user session. Redirecting.');
			throw redirect(303, '/login');
		}

		try {
			const form = await request.formData();
			const id = form.get('id')?.toString();

			console.log('[DELETE ACTION] Form ID:', id);

			if (!id) {
				console.warn('[DELETE ACTION] No ID provided');
				return fail(400);
			}

			// Extra check: only delete if the subject belongs to the user
			const result = await db
				.delete(subjects)
				.where(and(eq(subjects.id, id), eq(subjects.userId, user.id)));

			console.log('[DELETE ACTION] Delete result:', result);

			return { success: true };
		} catch (err) {
			console.error('[DELETE ACTION ERROR]', err);
			throw new Error('Failed to delete subject');
		}
  },
  rename: async ({ request, locals }) => {
	const user = locals.session?.user;
	if (!user) throw redirect(303, '/login');

	const form = await request.formData();
	const id = form.get('id')?.toString();
	let name = form.get('name')?.toString()?.trim();

	if (!id) return fail(400, { error: 'Invalid rename' });

	if (!name) name = 'New Subject';

	await db
		.update(subjects)
		.set({ name })
		.where(and(eq(subjects.id, id), eq(subjects.userId, user.id)));

	return { success: true };
},

};
