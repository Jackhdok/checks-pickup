const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Teams webhook function
const sendTeamsNotification = async (clientData) => {
  try {
    console.log('🔔 Sending Teams notification for:', clientData);
    
    const webhookUrl = 'https://default615878b3a96f4a16bf757f30b157ce.5a.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/4eba1566011241f3affa750bf6407657/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7PrTXGMC7pvRgZU34ALou31pEklvPnrlHteE5HHx0Wk';
    
    const message = {
      "type": "object",
      "attachments": [
        {
          "contentType": "application/vnd.microsoft.teams.card.adaptive",
          "contentUrl": null,
          "content": {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.2",
            "body": [
              {
                "type": "TextBlock",
                "text": "Hi Loan,",
                "weight": "Bolder",
                "size": "Large",
                "color": "Accent"
              },
              {
                "type": "TextBlock",
                "text": `You have **${clientData.name}** come to pick up the checks. Please prepare!`,
                "weight": "Bold",
                "size": "Medium",
                "wrap": true
              },
              {
                "type": "TextBlock",
                "text": "Here are the details:",
                "weight": "Bold",
                "size": "Small",
                "spacing": "Medium"
              },
              {
                "type": "FactSet",
                "facts": [
                  {
                    "title": "Visitor Name",
                    "value": clientData.name
                  },
                  {
                    "title": "Phone Number",
                    "value": clientData.phone
                  },
                  {
                    "title": "Type",
                    "value": clientData.type === 'vendor' ? 'Vendor' : 'Subcontractor'
                  },
                  {
                    "title": "Manager",
                    "value": clientData.manager || 'Unknown Manager'
                  },
                  {
                    "title": "Purpose",
                    "value": "Pickup Check"
                  },
                  {
                    "title": "Check-in Time",
                    "value": new Date().toLocaleString()
                  }
                ]
              }
            ]
          }
        }
      ]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    });

    console.log('📡 Webhook response status:', response.status);
    
    if (response.ok) {
      console.log('✅ Teams notification sent successfully');
    } else {
      console.error('❌ Failed to send Teams notification:', response.status);
    }
  } catch (error) {
    console.error('❌ Error sending Teams notification:', error.message);
  }
};

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

    // Send Teams notification
    try {
      await sendTeamsNotification({ name, phone, type, manager, purpose });
    } catch (webhookError) {
      console.error('Teams webhook error:', webhookError);
      // Continue even if webhook fails
    }

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

// Serve React app for all other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/check-in', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});
