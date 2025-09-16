// Twilio SMS Service for sending messages to visitors
// Uses Twilio API directly with your token

const sendSMSNotification = async (clientData) => {
  const twilioToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
  const twilioAccountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
  const twilioPhoneNumber = process.env.REACT_APP_TWILIO_PHONE_NUMBER;
  const messagingServiceSid = process.env.REACT_APP_TWILIO_MESSAGING_SERVICE_SID;
  
  if (!twilioToken || !twilioAccountSid) {
    console.warn('Twilio configuration not complete. Skipping SMS notification.');
    return;
  }

  // Clean phone number (remove spaces, dashes, etc.)
  const cleanPhone = clientData.phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('1') ? `+${cleanPhone}` : `+1${cleanPhone}`;

  const message = `Hi ${clientData.name}, your checks are ready for pickup! Please come to the Accounting Room. Thank you!`;

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;

  // Prepare the message data
  const messageData = {
    'To': formattedPhone,
    'Body': message
  };

  // Use Messaging Service if available, otherwise use phone number
  if (messagingServiceSid) {
    messageData['MessagingServiceSid'] = messagingServiceSid;
  } else if (twilioPhoneNumber) {
    messageData['From'] = twilioPhoneNumber;
  } else {
    console.warn('No phone number or messaging service configured');
    return;
  }

  try {
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioToken}`)}`
      },
      body: new URLSearchParams(messageData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('SMS notification sent successfully to', formattedPhone, 'Message SID:', result.sid);
    } else {
      const errorData = await response.text();
      console.error('Failed to send SMS notification:', response.statusText, errorData);
    }
  } catch (error) {
    console.error('Error sending SMS notification:', error);
  }
};

export default sendSMSNotification;
