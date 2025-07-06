// src/routes/dashboard/+page.server.ts
import { db } from '$lib/server/db';
import { subjects } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  add: async ({ locals, request }) => {
    const user = locals.session?.user;
    if (!user) throw redirect(303, '/login');

    const form = await request.formData();
    const name = form.get('name')?.toString().trim();

    if (!name) return fail(400, { error: 'Name is required' });

    await db.insert(subjects).values({ name, userId: user.id });
    return { success: true };
  },

  delete: async ({ locals, request }) => {
    const user = locals.session?.user;
    if (!user) throw redirect(303, '/login');

    const form = await request.formData();
    const id = form.get('id')?.toString();
    if (!id) return fail(400);

    await db.delete(subjects).where(eq(subjects.id, id));
    return { success: true };
  },

  rename: async ({ locals, request }) => {
    const user = locals.session?.user;
    if (!user) throw redirect(303, '/login');

    const form = await request.formData();
    const id = form.get('id')?.toString();
    const name = form.get('name')?.toString();

    if (!id || !name) return fail(400);

    await db.update(subjects).set({ name }).where(eq(subjects.id, id));
    return { success: true };
  }
};
