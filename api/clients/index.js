// API route for client operations (GET, POST)
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
    if (req.method === 'GET') {
      // Get all clients with manager information
      const clients = await prisma.client.findMany({
        include: {
          manager: true
        },
        orderBy: {
          checkInTime: 'asc'
        }
      });
      
      res.status(200).json(clients);
    } else if (req.method === 'POST') {
      // Create new client
      const { name, phone, type, managerId, purpose = 'pickup' } = req.body;
      
      if (!name || !phone || !type || !managerId) {
        return res.status(400).json({ error: 'Missing required fields: name, phone, type, managerId' });
      }

      // Verify manager exists
      const manager = await prisma.manager.findUnique({
        where: { id: managerId }
      });

      if (!manager) {
        return res.status(400).json({ error: 'Manager not found' });
      }

      const client = await prisma.client.create({
        data: {
          name,
          phone,
          type: type.toUpperCase(),
          managerId,
          purpose,
          status: 'WAITING'
        },
        include: {
          manager: true
        }
      });

      res.status(201).json(client);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      type: error.constructor.name
    });
  } finally {
    await prisma.$disconnect();
  }
}
