// API route for individual client operations (PUT, DELETE)
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
    if (req.method === 'PUT') {
      // Update client status
      const { status } = req.body;
      
      console.log('API: Updating client status:', { id, status });
      
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const updateData = { status };
      
      // Add timestamp based on status
      if (status === 'CALLED') {
        updateData.calledTime = new Date();
      } else if (status === 'COMPLETED') {
        updateData.completedTime = new Date();
      }

      console.log('API: Update data:', updateData);

      const client = await prisma.client.update({
        where: { id },
        data: updateData
      });

      console.log('API: Updated client:', client);
      res.status(200).json(client);
    } else if (req.method === 'DELETE') {
      // Delete client
      await prisma.client.delete({
        where: { id }
      });

      res.status(204).end();
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Client not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  } finally {
    await prisma.$disconnect();
  }
}
