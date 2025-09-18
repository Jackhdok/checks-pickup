// Test database connection API endpoint
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('Testing database connection...');
    
    // Test managers table
    const managers = await prisma.manager.findMany();
    console.log('Managers found:', managers.length);
    
    // Test clients table
    const clients = await prisma.client.findMany({
      include: {
        manager: true
      }
    });
    console.log('Clients found:', clients.length);
    
    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      data: {
        managers: managers.length,
        clients: clients.length,
        sampleClient: clients[0] || null
      }
    });
    
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Database connection failed'
    });
  } finally {
    await prisma.$disconnect();
  }
}
