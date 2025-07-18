// Vercel serverless function to fetch character data from Blizzard API
export default async function handler(req, res) {
  // Extract parameters from the dynamic route: /api/character/[realm]/[character]/[endpoint]
  const { params } = req.query;
  const [realm, character, endpoint] = params || [];

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

  if (!realm || !character) {
    return res.status(400).json({ error: 'Realm and character are required' });
  }

  // Valid endpoints
  const validEndpoints = ['profile', 'equipment', 'specializations', 'media'];
  const targetEndpoint = endpoint || 'profile';

  if (!validEndpoints.includes(targetEndpoint)) {
    return res.status(400).json({ 
      error: 'Invalid endpoint', 
      validEndpoints 
    });
  }

  try {
    // Get access token
    const token = await getAccessToken();
    
    let apiUrl;
    if (targetEndpoint === 'profile') {
      apiUrl = `https://us.api.blizzard.com/data/wow/character/${realm}/${character}?namespace=profile-classic-us&locale=en_US`;
    } else {
      apiUrl = `https://us.api.blizzard.com/data/wow/character/${realm}/${character}/${targetEndpoint}?namespace=profile-classic-us&locale=en_US`;
    }
    
    // Fetch character data from Blizzard API
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Blizzard API error: ${response.status}`);
    }

    const characterData = await response.json();
    
    // Cache for 5 minutes (character data changes more frequently)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    
    res.status(200).json(characterData);
  } catch (error) {
    console.error('Error fetching character data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch character data',
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
