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
      // Get all clients
      const clients = await prisma.client.findMany({
        orderBy: {
          checkInTime: 'asc'
        }
      });
      
      res.status(200).json(clients);
    } else if (req.method === 'POST') {
      // Create new client
      const { name, phone, type, manager } = req.body;
      
      if (!name || !phone || !type || !manager) {
        return res.status(400).json({ error: 'Missing required fields: name, phone, type, manager' });
      }

      const client = await prisma.client.create({
        data: {
          name,
          phone,
          type: type.toUpperCase(),
          manager,
          status: 'WAITING'
        }
      });

      res.status(201).json(client);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
