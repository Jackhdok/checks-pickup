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

      // Send Teams notification with Adaptive Card
      try {
        const webhookUrl = process.env.REACT_APP_TEAMS_WEBHOOK_URL || 'https://default615878b3a96f4a16bf757f30b157ce.5a.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/4eba1566011241f3affa750bf6407657/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7PrTXGMC7pvRgZU34ALou31pEklvPnrlHteE5HHx0Wk';
        
        if (webhookUrl) {
          const adaptiveCard = {
            "type": "message",
            "attachments": [
              {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "contentUrl": null,
                "content": {
                  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                  "type": "AdaptiveCard",
                  "version": "1.3",
                  "body": [
                    {
                      "type": "TextBlock",
                      "text": "🔔 New Check-in Request",
                      "weight": "Bolder",
                      "size": "Medium",
                      "color": "Accent"
                    },
                    {
                      "type": "TextBlock",
                      "text": `**Name:** ${name}`,
                      "wrap": true
                    },
                    {
                      "type": "TextBlock",
                      "text": `**Phone:** ${phone}`,
                      "wrap": true
                    },
                    {
                      "type": "TextBlock",
                      "text": `**Type:** ${type === 'vendor' ? 'Vendor' : 'Subcontractor'}`,
                      "wrap": true
                    },
                    {
                      "type": "TextBlock",
                      "text": `**Manager:** ${manager || 'Unknown Manager'}`,
                      "wrap": true
                    },
                    {
                      "type": "TextBlock",
                      "text": `**Purpose:** Pickup Check`,
                      "wrap": true
                    },
                    {
                      "type": "TextBlock",
                      "text": `**Check-in Time:** ${new Date().toLocaleString()}`,
                      "wrap": true
                    },
                    {
                      "type": "TextBlock",
                      "text": `Hi Loan, ${name} has come to pick up checks. Please prepare!`,
                      "wrap": true,
                      "weight": "Bolder",
                      "color": "Good"
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
            body: JSON.stringify(adaptiveCard)
          });

          console.log('Teams adaptive card response:', response.status);
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Teams webhook error details:', errorText);
          }
        }
      } catch (webhookError) {
        console.error('Teams webhook error:', webhookError);
        // Continue even if webhook fails
      }

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
