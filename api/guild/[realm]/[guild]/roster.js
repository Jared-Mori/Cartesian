// Individual route: /api/guild/[realm]/[guild]/roster.js
export default async function handler(req, res) {
  const { realm, guild } = req.query;

  console.log('Guild roster API called:', {
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
    
    // Try different namespaces for roster endpoint
    const namespaces = ['profile-classic1x-us', 'profile-classic-us'];
    let lastError;
    
    for (const namespace of namespaces) {
      try {
        const apiUrl = `https://us.api.blizzard.com/data/wow/guild/${realm}/${encodeURIComponent(guild.toLowerCase())}/roster?namespace=${namespace}&locale=en_US`;
        console.log('🎯 Final Blizzard API URL:', apiUrl);
        console.log('🔧 URL components:', {
          realm,
          guild: guild.toLowerCase(),
          encoded: encodeURIComponent(guild.toLowerCase()),
          namespace
        });
        
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          console.log('Success with namespace:', namespace);
          const guildData = await response.json();
          res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
          return res.status(200).json(guildData);
        } else {
          const errorText = await response.text();
          console.log(`Failed with namespace ${namespace}:`, response.status, errorText);
          lastError = new Error(`Failed with ${namespace}: ${response.status}`);
        }
      } catch (err) {
        console.log(`Error with namespace ${namespace}:`, err);
        lastError = err;
      }
    }
    
    throw lastError || new Error('All namespace attempts failed');
  } catch (error) {
    console.error('Error fetching guild roster:', error);
    res.status(500).json({ 
      error: 'Failed to fetch guild roster',
      details: error.message 
    });
  }
}

// Helper function to get OAuth token
async function getAccessToken() {
  const clientId = process.env.BLIZZARD_CLIENT_ID;
  const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;

  console.log('Environment check:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    clientIdLength: clientId ? clientId.length : 0
  });

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
