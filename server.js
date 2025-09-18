const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// API Routes
// Get all clients
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        checkInTime: 'asc'
      }
    });
    res.json(clients);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      type: error.constructor.name
    });
  }
});

// Create new client
app.post('/api/clients', async (req, res) => {
  try {
    const { name, phone, type, manager, purpose = 'pickup' } = req.body;
    
    if (!name || !phone || !type || !manager) {
      return res.status(400).json({ error: 'Missing required fields: name, phone, type, manager' });
    }

    const client = await prisma.client.create({
      data: {
        name,
        phone,
        type: type.toLowerCase() === 'subcontractor' ? 'SUBCONTRACTOR' : 'VENDOR',
        manager,
        purpose,
        status: 'WAITING'
      }
    });

    res.status(201).json(client);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      type: error.constructor.name
    });
  }
});

// Update client status
app.put('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
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

    const client = await prisma.client.update({
      where: { id },
      data: updateData
    });

    res.json(client);
  } catch (error) {
    console.error('Database error:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Client not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Delete client
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.client.delete({
      where: { id }
    });

    res.status(204).end();
  } catch (error) {
    console.error('Database error:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Client not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});
