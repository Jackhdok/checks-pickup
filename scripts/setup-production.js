const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

async function setupProduction() {
  console.log('🚀 Setting up production database...');
  
  try {
    // Generate Prisma client
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Push schema to database
    console.log('🗄️ Pushing schema to database...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('✅ Production database setup complete!');
    console.log('📝 Next steps:');
    console.log('1. Set DATABASE_URL in your Vercel environment variables');
    console.log('2. Set REACT_APP_TEAMS_WEBHOOK_URL in your Vercel environment variables');
    console.log('3. Redeploy your application');
    
  } catch (error) {
    console.error('❌ Error setting up production database:', error.message);
    console.log('💡 Make sure you have set DATABASE_URL environment variable');
    process.exit(1);
  }
}

setupProduction();