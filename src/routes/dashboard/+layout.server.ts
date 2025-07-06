/**
 * This file is necessary to ensure protection of all routes in the `private`
 * directory. It makes the routes in this directory _dynamic_ routes, which
 * send a server request, and thus trigger `hooks.server.ts`.
 **/
import { db } from '$lib/server/db';
import { subjects } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async ({ locals }) => {
  const user = locals.session?.user;
  if (!user) throw redirect(303, '/login');

  const subjectList = await db
    .select()
    .from(subjects)
    .where(eq(subjects.userId, user.id));

  return {
    subjects: subjectList,
  };
};

