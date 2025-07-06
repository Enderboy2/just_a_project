// src/routes/dashboard/+page.server.ts
import { db } from '$lib/server/db/client';
import { subjects } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  // Use locals.session directly instead of calling getSession()
  const session = locals.session;

  if (!session?.user) {
    throw redirect(303, '/');
  }

  const userSubjects = await db
    .select()
    .from(subjects)
    .where(eq(subjects.userId, session.user.id));

  return {
    subjects: userSubjects
  };
};




export const actions = {
	addSubject: async ({ locals, request }) => {
		const user = locals.session?.user;
		if (!user) return fail(401);

		const form = await request.formData();
		const name = form.get('name')?.toString().trim();

		if (!name) return fail(400, { message: 'Name is required' });

		await db.insert(subjects).values({
			name,
			userId: user.id
		});

		throw redirect(303, '/dashboard');
	},

	deleteSubject: async ({ locals, request }) => {
		const user = locals.session?.user;
		if (!user) return fail(401);

		const form = await request.formData();
		const id = form.get('id')?.toString();

		await db.delete(subjects).where(eq(subjects.id, id));
		throw redirect(303, '/dashboard');
	},

	renameSubject: async ({ locals, request }) => {
		const user = locals.session?.user;
		if (!user) return fail(401);

		const form = await request.formData();
		const id = form.get('id')?.toString();
		const name = form.get('name')?.toString().trim();

		if (!name) return fail(400);

		await db
			.update(subjects)
			.set({ name })
			.where(eq(subjects.id, id));

		throw redirect(303, '/dashboard');
	}
};
