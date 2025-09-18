const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log('Starting database migration...');
    
    // Check if manager column exists
    const columns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'clients' AND column_name = 'manager';
    `;
    
    if (columns.length === 0) {
      console.log('Adding manager column to clients table...');
      await prisma.$executeRaw`
        ALTER TABLE clients 
        ADD COLUMN manager VARCHAR(255) DEFAULT 'Anh Le';
      `;
      console.log('Manager column added successfully');
    } else {
      console.log('Manager column already exists');
    }
    
    // Update existing records to have a default manager if they don't have one
    await prisma.$executeRaw`
      UPDATE clients 
      SET manager = 'Anh Le' 
      WHERE manager IS NULL OR manager = '';
    `;
    
    // Update SUBVENDOR to SUBCONTRACTOR in existing records
    await prisma.$executeRaw`
      UPDATE clients 
      SET type = 'SUBCONTRACTOR' 
      WHERE type = 'SUBVENDOR';
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
