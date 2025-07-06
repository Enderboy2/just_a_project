// src/routes/actions/subjects.ts
import { db } from '$lib/server/db';
import { subjects } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export async function addSubject({ locals, request }) {
	const user = locals.session?.user;
	if (!user) return fail(401);

	const form = await request.formData();
	const name = form.get('name')?.toString().trim();

	if (!name) return fail(400, { error: 'Name is required' });

	await db.insert(subjects).values({ name, userId: user.id });

	return { success: true };
}

export async function deleteSubject({ locals, request }) {
	const user = locals.session?.user;
	if (!user) return fail(401);

	const form = await request.formData();
	const id = form.get('id')?.toString();

	if (!id) return fail(400);

	await db.delete(subjects).where(eq(subjects.id, id));

	return { success: true };
}

export async function renameSubject({ locals, request }) {
	const user = locals.session?.user;
	if (!user) return fail(401);

	const form = await request.formData();
	const id = form.get('id')?.toString();
	const name = form.get('name')?.toString();

	if (!id || !name) return fail(400);

	await db
		.update(subjects)
		.set({ name })
		.where(eq(subjects.id, id));

	return { success: true };
}
