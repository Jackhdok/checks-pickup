// Health check API endpoint
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
    res.status(200).json({
      success: true,
      message: 'API is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
