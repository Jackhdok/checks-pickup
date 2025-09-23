// API route for cycling client status via adaptive card button
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
    if (req.method === 'POST') {
      const { clientId, currentStatus } = req.body;
      
      if (!clientId || !currentStatus) {
        return res.status(400).json({ error: 'Missing required fields: clientId, currentStatus' });
      }

      // Determine next status and button text
      let nextStatus, buttonText, cardMessage;
      
      switch (currentStatus) {
        case 'WAITING':
          nextStatus = 'CALLED';
          buttonText = 'Mark as In Progress';
          cardMessage = '✅ Client has been called!';
          break;
        case 'CALLED':
          nextStatus = 'IN_PROGRESS';
          buttonText = 'Mark as Completed';
          cardMessage = '🔄 Client is now in progress!';
          break;
        case 'IN_PROGRESS':
          nextStatus = 'COMPLETED';
          buttonText = 'Remove from List';
          cardMessage = '✅ Service completed!';
          break;
        case 'COMPLETED':
          // Delete the client
          await prisma.client.delete({
            where: { id: clientId }
          });
          return res.status(200).json({ 
            success: true, 
            action: 'deleted',
            message: '🗑️ Client removed from list!'
          });
        default:
          return res.status(400).json({ error: 'Invalid current status' });
      }

      // Update client status
      const updateData = { status: nextStatus };
      
      // Add timestamp based on status
      if (nextStatus === 'CALLED') {
        updateData.calledTime = new Date();
      } else if (nextStatus === 'COMPLETED') {
        updateData.completedTime = new Date();
      }

      const client = await prisma.client.update({
        where: { id: clientId },
        data: updateData
      });

      // Return updated adaptive card
      const updatedCard = {
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
                  "text": "🔔 Check-in Status Updated",
                  "weight": "Bolder",
                  "size": "Medium",
                  "color": "Accent"
                },
                {
                  "type": "TextBlock",
                  "text": cardMessage,
                  "weight": "Bolder",
                  "color": "Good",
                  "wrap": true
                },
                {
                  "type": "TextBlock",
                  "text": `**Name:** ${client.name}`,
                  "wrap": true
                },
                {
                  "type": "TextBlock",
                  "text": `**Phone:** ${client.phone}`,
                  "wrap": true
                },
                {
                  "type": "TextBlock",
                  "text": `**Type:** ${client.type === 'VENDOR' ? 'Vendor' : 'Subcontractor'}`,
                  "wrap": true
                },
                {
                  "type": "TextBlock",
                  "text": `**Manager:** ${client.manager}`,
                  "wrap": true
                },
                {
                  "type": "TextBlock",
                  "text": `**Status:** ${nextStatus.replace('_', ' ')}`,
                  "wrap": true,
                  "weight": "Bolder"
                }
              ],
              "actions": nextStatus !== 'COMPLETED' ? [
                {
                  "type": "Action.Submit",
                  "title": buttonText,
                  "data": {
                    "action": "cycle_status",
                    "clientId": clientId,
                    "currentStatus": nextStatus
                  }
                }
              ] : []
            }
          }
        ]
      };

      res.status(200).json(updatedCard);
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Status update error:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Client not found' });
    } else {
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}
