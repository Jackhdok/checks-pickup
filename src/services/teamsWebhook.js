// Power Automate Webhook Service
// Add your Power Automate webhook URL to environment variables

const sendTeamsNotification = async (clientData) => {
  try {
    // Validate webhook URL configuration
    const webhookUrl = process.env.REACT_APP_TEAMS_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('⚠️  Teams webhook URL not configured. Missing environment variable:');
      console.warn('   - REACT_APP_TEAMS_WEBHOOK_URL');
      console.warn('   Add this to your .env file to enable Teams notifications. Service will continue without Teams notifications.');
      return Promise.resolve(); // Return resolved promise to prevent unhandled rejection
    }

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
                    "value": clientData.type === 'vendor' ? 'Vendor' : 'Subvendor'
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
                "url": window.location.origin
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
