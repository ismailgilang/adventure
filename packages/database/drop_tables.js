const { neon } = require('@neondatabase/serverless');

const connectionString = "postgresql://neondb_owner:npg_z3EFfln8uJgQ@ep-fragrant-bread-aohjazjq.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(connectionString);

async function main() {
  console.log("⚠️ Starting database rollback (dropping all tables)...");
  try {
    const tables = [
      'articles',
      'users',
      'tour_packages',
      'bookings',
      'landing_hero',
      'landing_about',
      'landing_team',
      'landing_testimonials',
      'landing_features',
      'landing_cta',
      'seo_meta'
    ];

    for (const table of tables) {
      await sql.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
      console.log(`🗑️ Dropped table: ${table}`);
    }

    console.log("\n✅ Rollback completed successfully!");
  } catch (error) {
    console.error("❌ Error during rollback:", error);
  }
}

main();
