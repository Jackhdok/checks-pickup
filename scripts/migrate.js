const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log('Starting database migration...');
    
    // Check if clients table exists
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'clients';
    `;
    
    if (tables.length === 0) {
      console.log('Creating clients table...');
      await prisma.$executeRaw`
        CREATE TABLE clients (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          manager VARCHAR(255) NOT NULL DEFAULT 'Anh Le',
          purpose VARCHAR(50) DEFAULT 'pickup',
          status VARCHAR(50) NOT NULL DEFAULT 'WAITING',
          "checkInTime" TIMESTAMP NOT NULL DEFAULT NOW(),
          "calledTime" TIMESTAMP,
          "completedTime" TIMESTAMP,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;
      console.log('Clients table created successfully');
    } else {
      console.log('Clients table already exists');
      
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
      
      // Check if purpose column exists
      const purposeColumns = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'purpose';
      `;
      
      if (purposeColumns.length === 0) {
        console.log('Adding purpose column to clients table...');
        await prisma.$executeRaw`
          ALTER TABLE clients 
          ADD COLUMN purpose VARCHAR(50) DEFAULT 'pickup';
        `;
        console.log('Purpose column added successfully');
      } else {
        console.log('Purpose column already exists');
      }
    }
    
    // Update existing records to have a default manager if they don't have one
    await prisma.$executeRaw`
      UPDATE clients 
      SET manager = 'Anh Le' 
      WHERE manager IS NULL OR manager = '';
    `;
    
    // Skip enum updates for now - let Prisma handle the schema
    console.log('Skipping enum updates - Prisma will handle schema changes');
    
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
