// Test script to verify webhook functionality
const sendTeamsNotification = require('./src/services/teamsWebhook.js').default;

// Set environment variable for testing
process.env.REACT_APP_TEAMS_WEBHOOK_URL = 'https://default615878b3a96f4a16bf757f30b157ce.5a.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/4eba1566011241f3affa750bf6407657/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7PrTXGMC7pvRgZU34ALou31pEklvPnrlHteE5HHx0Wk';

// Test data
const testClientData = {
  name: 'Test User',
  phone: '123-456-7890',
  type: 'vendor',
  manager: 'Anh Le',
  purpose: 'pickup'
};

console.log('Testing Teams webhook...');
console.log('Webhook URL:', process.env.REACT_APP_TEAMS_WEBHOOK_URL);
console.log('Test data:', testClientData);

sendTeamsNotification(testClientData)
  .then(() => {
    console.log('✅ Webhook test completed successfully');
  })
  .catch((error) => {
    console.error('❌ Webhook test failed:', error);
  });
