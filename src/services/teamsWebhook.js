// Power Automate Webhook Service
// Add your Power Automate webhook URL to environment variables

const sendTeamsNotification = async (clientData) => {
  try {
    console.log('🔔 Sending Teams notification for:', clientData);
    
    // Use the hardcoded webhook URL
    const webhookUrl = 'https://default615878b3a96f4a16bf757f30b157ce.5a.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/4eba1566011241f3affa750bf6407657/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7PrTXGMC7pvRgZU34ALou31pEklvPnrlHteE5HHx0Wk';
    
    console.log('🔗 Webhook URL:', webhookUrl);

    // Validate webhook URL format
    try {
      new URL(webhookUrl);
    } catch (urlError) {
      console.error('❌ Invalid Teams webhook URL format:', webhookUrl);
      console.error('   Please check your REACT_APP_TEAMS_WEBHOOK_URL environment variable.');
      return Promise.resolve();
    }

    // Validate client data
    if (!clientData || !clientData.name || !clientData.phone || !clientData.type) {
      console.error('❌ Invalid client data provided to Teams service:', clientData);
      return Promise.resolve();
    }

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
            ],
            "actions": [
              {
                "type": "Action.OpenUrl",
                "title": "View Admin Dashboard",
                "url": "https://checks-pickup.vercel.app/admin"
              },
              {
                "type": "Action.OpenUrl",
                "title": "Open Check-in Page",
                "url": "https://checks-pickup.vercel.app/check-in"
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
    console.log('📡 Webhook response status text:', response.statusText);
    
    if (response.ok) {
      console.log('✅ Teams notification sent successfully');
      return Promise.resolve();
    } else {
      const errorText = await response.text().catch(() => 'Unable to read error response');
      console.error('❌ Failed to send Teams notification:', response.status, response.statusText);
      console.error('   Error details:', errorText);
      console.error('   This could be due to an invalid webhook URL or Power Automate configuration.');
      return Promise.resolve(); // Return resolved promise to prevent unhandled rejection
    }
  } catch (error) {
    console.error('❌ Error sending Teams notification:', error.message);
    console.error('   This could be due to network issues or invalid webhook configuration.');
    return Promise.resolve(); // Return resolved promise to prevent unhandled rejection
  }
};

export default sendTeamsNotification;
