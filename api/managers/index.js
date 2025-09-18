// API route for manager operations (GET, POST)
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
      // Get all managers
      const managers = await prisma.manager.findMany({
        include: {
          clients: {
            orderBy: {
              checkInTime: 'asc'
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      res.status(200).json(managers);
    } else if (req.method === 'POST') {
      // Create new manager
      const { name, email, phone, department } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      // Check if email is unique if provided
      if (email) {
        const existingManager = await prisma.manager.findUnique({
          where: { email }
        });

        if (existingManager) {
          return res.status(400).json({ error: 'Email already exists' });
        }
      }

      const manager = await prisma.manager.create({
        data: {
          name,
          email: email || null,
          phone: phone || null,
          department: department || null,
          isActive: true
        }
      });

      res.status(201).json(manager);
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
