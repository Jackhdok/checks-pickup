const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up local development environment...');

// Copy local schema to main schema
const localSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.local.prisma');
const mainSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

try {
  const localSchema = fs.readFileSync(localSchemaPath, 'utf8');
  fs.writeFileSync(mainSchemaPath, localSchema);
  console.log('✅ Local schema applied');
  
  // Generate Prisma client
  const { execSync } = require('child_process');
  console.log('🔄 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('🔄 Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('✅ Local development setup complete!');
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
