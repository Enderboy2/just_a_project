// src/lib/server/db/schema.ts
import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';

export const subjects = pgTable('subjects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  fileCount: integer('file_count').default(0),
  userId: uuid('user_id').notNull(), // will match Supabase user ID
});
