const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log('Starting database migration...');
    
    // Check if managers table exists
    const managerTables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'managers';
    `;
    
    if (managerTables.length === 0) {
      console.log('Creating managers table...');
      await prisma.$executeRaw`
        CREATE TABLE managers (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE,
          phone VARCHAR(255),
          department VARCHAR(255),
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;
      console.log('Managers table created successfully');
      
      // Create default manager
      console.log('Creating default manager...');
      await prisma.$executeRaw`
        INSERT INTO managers (id, name, email, "isActive", "createdAt", "updatedAt")
        VALUES ('default-manager', 'Anh Le', 'anh.le@example.com', true, NOW(), NOW());
      `;
      console.log('Default manager created successfully');
    } else {
      console.log('Managers table already exists');
    }
    
    // Check if clients table exists
    const clientTables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'clients';
    `;
    
    if (clientTables.length === 0) {
      console.log('Creating clients table...');
      await prisma.$executeRaw`
        CREATE TABLE clients (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          "managerId" VARCHAR(255) NOT NULL,
          purpose VARCHAR(50) DEFAULT 'pickup',
          status VARCHAR(50) NOT NULL DEFAULT 'WAITING',
          "checkInTime" TIMESTAMP NOT NULL DEFAULT NOW(),
          "calledTime" TIMESTAMP,
          "completedTime" TIMESTAMP,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          FOREIGN KEY ("managerId") REFERENCES managers(id)
        );
      `;
      console.log('Clients table created successfully');
    } else {
      console.log('Clients table already exists');
      
      // Check if managerId column exists
      const managerIdColumns = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'managerId';
      `;
      
      if (managerIdColumns.length === 0) {
        console.log('Migrating from manager string to managerId foreign key...');
        
        // First, add the managerId column
        await prisma.$executeRaw`
          ALTER TABLE clients 
          ADD COLUMN "managerId" VARCHAR(255);
        `;
        
        // Update existing records to use default manager
        await prisma.$executeRaw`
          UPDATE clients 
          SET "managerId" = 'default-manager' 
          WHERE "managerId" IS NULL;
        `;
        
        // Make managerId NOT NULL
        await prisma.$executeRaw`
          ALTER TABLE clients 
          ALTER COLUMN "managerId" SET NOT NULL;
        `;
        
        // Add foreign key constraint
        await prisma.$executeRaw`
          ALTER TABLE clients 
          ADD CONSTRAINT fk_clients_manager 
          FOREIGN KEY ("managerId") REFERENCES managers(id);
        `;
        
        // Drop old manager column
        await prisma.$executeRaw`
          ALTER TABLE clients 
          DROP COLUMN IF EXISTS manager;
        `;
        
        console.log('Manager migration completed successfully');
      } else {
        console.log('ManagerId column already exists');
      }
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
