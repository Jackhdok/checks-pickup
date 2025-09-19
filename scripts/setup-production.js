const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up production environment...');

// Copy production schema to main schema
const productionSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.production.prisma');
const mainSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

try {
  const productionSchema = fs.readFileSync(productionSchemaPath, 'utf8');
  fs.writeFileSync(mainSchemaPath, productionSchema);
  console.log('✅ Production schema applied');
  
  // Generate Prisma client
  const { execSync } = require('child_process');
  console.log('🔄 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('✅ Production setup complete!');
} catch (error) {
  console.error('❌ Production setup failed:', error.message);
  process.exit(1);
}
