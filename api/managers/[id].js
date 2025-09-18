// API route for individual manager operations (GET, PUT, DELETE)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

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
      // Get specific manager with clients
      const manager = await prisma.manager.findUnique({
        where: { id },
        include: {
          clients: {
            orderBy: {
              checkInTime: 'asc'
            }
          }
        }
      });

      if (!manager) {
        return res.status(404).json({ error: 'Manager not found' });
      }

      res.status(200).json(manager);
    } else if (req.method === 'PUT') {
      // Update manager
      const { name, email, phone, department, isActive } = req.body;
      
      // Check if email is unique if provided and different from current
      if (email) {
        const existingManager = await prisma.manager.findFirst({
          where: {
            email,
            id: { not: id }
          }
        });

        if (existingManager) {
          return res.status(400).json({ error: 'Email already exists' });
        }
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (department !== undefined) updateData.department = department;
      if (isActive !== undefined) updateData.isActive = isActive;

      const manager = await prisma.manager.update({
        where: { id },
        data: updateData,
        include: {
          clients: {
            orderBy: {
              checkInTime: 'asc'
            }
          }
        }
      });

      res.status(200).json(manager);
    } else if (req.method === 'DELETE') {
      // Check if manager has clients
      const clientsCount = await prisma.client.count({
        where: { managerId: id }
      });

      if (clientsCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete manager with existing clients. Please reassign or delete clients first.' 
        });
      }

      // Delete manager
      await prisma.manager.delete({
        where: { id }
      });

      res.status(204).end();
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Manager not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  } finally {
    await prisma.$disconnect();
  }
}
