// Individual route: /api/guild/[realm]/[guild]/achievements.js
export default async function handler(req, res) {
  const { realm, guild } = req.query;

  console.log('Guild achievements API called:', {
    method: req.method,
    url: req.url,
    query: req.query,
    realm,
    guild
  });

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

  if (!realm || !guild) {
    return res.status(400).json({ error: 'Realm and guild are required' });
  }

  try {
    // Get access token
    const token = await getAccessToken();
    
    const apiUrl = `https://us.api.blizzard.com/data/wow/guild/${realm}/${encodeURIComponent(guild)}/achievements?namespace=profile-classic-us&locale=en_US`;
    console.log('🎯 Final Blizzard API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Blizzard API error: ${response.status}`);
    }

    const guildData = await response.json();
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    res.status(200).json(guildData);
  } catch (error) {
    console.error('Error fetching guild achievements:', error);
    res.status(500).json({ 
      error: 'Failed to fetch guild achievements',
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
