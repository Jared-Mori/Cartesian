// Vercel serverless function to fetch item media from Blizzard API
export default async function handler(req, res) {
  const { url } = req.query;

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!url) {
    return res.status(400).json({ error: 'Media URL is required' });
  }

  try {
    // Get access token
    const token = await getAccessToken();
    
    // Fetch media data from Blizzard API
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Blizzard API error: ${response.status}`);
    }

    const mediaData = await response.json();
    
    // Cache for 24 hours (media rarely changes)
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    
    res.status(200).json(mediaData);
  } catch (error) {
    console.error('Error fetching media data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch media data',
      details: error.message 
    });
  }
}

// Helper function to get OAuth token
async function getAccessToken() {
  const clientId = process.env.BLIZZARD_CLIENT_ID;
  const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Blizzard API credentials');
  }

  const body = new URLSearchParams({ grant_type: 'client_credentials' });

  const response = await fetch('https://oauth.battle.net/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data.access_token;
}
