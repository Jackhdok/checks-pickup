// Power Automate Webhook Service
// Add your Power Automate webhook URL to environment variables

const sendTeamsNotification = async (clientData) => {
  const webhookUrl = process.env.REACT_APP_TEAMS_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('Power Automate webhook URL not configured. Please add REACT_APP_TEAMS_WEBHOOK_URL to your .env file. Skipping notification.');
    return Promise.resolve(); // Return resolved promise to prevent unhandled rejection
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

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    });

    if (response.ok) {
      console.log('Teams notification sent successfully');
    } else {
      console.error('Failed to send Teams notification:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending Teams notification:', error);
  }
};

export default sendTeamsNotification;
