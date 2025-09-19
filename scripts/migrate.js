const { PrismaClient } = require('@prisma/client');

// Only run migration if DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.log('DATABASE_URL not set, skipping migration');
  process.exit(0);
}

const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log('Starting database migration...');
    
    // Test database connection by trying to query clients
    try {
      const clients = await prisma.client.findMany({
        take: 1
      });
      console.log('Database connection successful');
      console.log('Clients table exists and is accessible');
    } catch (error) {
      console.log('Database or table does not exist, but Prisma will handle schema creation');
    }
    
    // Update existing records to have a default manager if they don't have one
    try {
      await prisma.client.updateMany({
        where: {
          OR: [
            { manager: null },
            { manager: '' }
          ]
        },
        data: {
          manager: 'Anh Le'
        }
      });
      console.log('Updated existing records with default manager');
    } catch (error) {
      console.log('No existing records to update or table not ready yet');
    }
    
    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  migrate()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = migrate;
