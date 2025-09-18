const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log('Starting database migration...');
    
    // Add manager column if it doesn't exist
    await prisma.$executeRaw`
      ALTER TABLE clients 
      ADD COLUMN IF NOT EXISTS manager VARCHAR(255);
    `;
    
    // Update existing records to have a default manager
    await prisma.$executeRaw`
      UPDATE clients 
      SET manager = 'Anh Le' 
      WHERE manager IS NULL;
    `;
    
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
