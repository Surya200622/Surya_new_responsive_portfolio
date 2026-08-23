import { db } from './src/db';
import { siteSettings } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  await db.delete(siteSettings).where(eq(siteSettings.key, 'calculator_data'));
  console.log("Deleted old calculator_data from DB!");
}

main().catch(console.error);
