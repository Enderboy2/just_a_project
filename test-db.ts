// test-db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config'; // this must be at the top


const client = postgres(process.env.DATABASE_URL!, { ssl: 'require' });
const db = drizzle(client);

async function main() {
  const result = await db.execute(`SELECT now()`);
  console.log(result);
}

main();
