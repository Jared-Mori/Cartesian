// Client-side API utilities that call our serverless functions
// This replaces direct calls to Blizzard API with calls to our own API endpoints

// Development fallback - use direct Blizzard API calls when serverless functions aren't available
const isDevelopment = import.meta.env.DEV;

// Fallback functions for development
async function getAccessTokenDev() {
  const clientId = import.meta.env.VITE_BLIZZARD_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_BLIZZARD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Blizzard API credentials in environment variables');
  }

  const body = new URLSearchParams({ grant_type: 'client_credentials' });

  const response = await fetch('https://oauth.battle.net/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
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

async function callAPI(url, useServerless = true) {
  if (!isDevelopment || useServerless) {
    // Production or when explicitly requesting serverless
    return fetch(url);
  } else {
    // Development fallback - call Blizzard API directly
    const token = await getAccessTokenDev();
    return fetch(url.replace('/api/', 'https://us.api.blizzard.com/data/wow/'), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
}

/**
 * Fetch item data using our serverless function
 * @param {number|string} itemId - The item ID
 * @returns {Promise<Object>} Item data
 */
export async function fetchItemData(itemId) {
  try {
    let response;
    if (isDevelopment) {
      // Development: call Blizzard API directly
      const token = await getAccessTokenDev();
      response = await fetch(`https://us.api.blizzard.com/data/wow/item/${itemId}?namespace=static-classic-us&locale=en_US`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Production: use serverless function
      response = await fetch(`/api/items/${itemId}`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch item ${itemId}: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching item data:', error);
    throw error;
  }
}

/**
 * Fetch item media using our serverless function
 * @param {string} mediaUrl - The media URL from item data
 * @returns {Promise<Object>} Media data with icon assets
 */
export async function fetchItemMedia(mediaUrl) {
  try {
    let response;
    if (isDevelopment) {
      // Development: call Blizzard API directly
      const token = await getAccessTokenDev();
      response = await fetch(mediaUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Production: use serverless function
      const encodedUrl = encodeURIComponent(mediaUrl);
      response = await fetch(`/api/media?url=${encodedUrl}`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching media data:', error);
    throw error;
  }
}

/**
 * Fetch guild roster using our serverless function
 * @param {string} realmSlug - The realm slug (e.g., "benediction")
 * @param {string} guildName - The guild name
 * @returns {Promise<Object>} Guild roster data
 */
export async function fetchGuildRoster(realmSlug, guildName) {
  try {
    let response;
    if (isDevelopment) {
      // Development: call Blizzard API directly
      const token = await getAccessTokenDev();
      response = await fetch(`https://us.api.blizzard.com/data/wow/guild/${realmSlug}/${encodeURIComponent(guildName)}/roster?namespace=profile-classic-us&locale=en_US`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Production: use serverless function
      response = await fetch(`/api/guild/${realmSlug}/${guildName}/roster`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch guild roster: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching guild roster:', error);
    throw error;
  }
}

/**
 * Fetch guild activity using our serverless function
 * @param {string} realmSlug - The realm slug (e.g., "benediction")
 * @param {string} guildName - The guild name
 * @returns {Promise<Object>} Guild activity data
 */
export async function fetchGuildActivity(realmSlug, guildName) {
  try {
    let response;
    if (isDevelopment) {
      // Development: call Blizzard API directly
      const token = await getAccessTokenDev();
      response = await fetch(`https://us.api.blizzard.com/data/wow/guild/${realmSlug}/${encodeURIComponent(guildName)}/activity?namespace=profile-classic-us&locale=en_US`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Production: use serverless function
      response = await fetch(`/api/guild/${realmSlug}/${guildName}/activity`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch guild activity: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching guild activity:', error);
    throw error;
  }
}

/**
 * Fetch guild achievements using our serverless function
 * @param {string} realmSlug - The realm slug (e.g., "benediction")
 * @param {string} guildName - The guild name
 * @returns {Promise<Object>} Guild achievements data
 */
export async function fetchGuildAchievements(realmSlug, guildName) {
  try {
    let response;
    if (isDevelopment) {
      // Development: call Blizzard API directly
      const token = await getAccessTokenDev();
      response = await fetch(`https://us.api.blizzard.com/data/wow/guild/${realmSlug}/${encodeURIComponent(guildName)}/achievements?namespace=profile-classic-us&locale=en_US`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Production: use serverless function
      response = await fetch(`/api/guild/${realmSlug}/${guildName}/achievements`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch guild achievements: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching guild achievements:', error);
    throw error;
  }
}

/**
 * Convenience functions for Cartesian guild
 */
export async function fetchCartesianGuildRoster() {
  return fetchGuildRoster('benediction', 'cartesian');
}

export async function fetchCartesianGuildActivity() {
  return fetchGuildActivity('benediction', 'cartesian');
}

export async function fetchCartesianGuildAchievements() {
  return fetchGuildAchievements('benediction', 'cartesian');
}

/**
 * Character API functions
 */

/**
 * Fetch character profile using our serverless function
 * @param {string} realmSlug - The realm slug (e.g., "benediction")
 * @param {string} characterName - The character name
 * @returns {Promise<Object>} Character profile data
 */
export async function fetchCharacterProfile(realmSlug, characterName) {
  try {
    let response;
    if (isDevelopment) {
      // Development: call Blizzard API directly
      const token = await getAccessTokenDev();
      response = await fetch(`https://us.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName}?namespace=profile-classic-us&locale=en_US`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Production: use serverless function
      response = await fetch(`/api/character/${realmSlug}/${characterName}/profile`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch character profile: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching character profile:', error);
    throw error;
  }
}

/**
 * Fetch character equipment using our serverless function
 * @param {string} realmSlug - The realm slug (e.g., "benediction")
 * @param {string} characterName - The character name
 * @returns {Promise<Object>} Character equipment data
 */
export async function fetchCharacterEquipment(realmSlug, characterName) {
  try {
    let response;
    if (isDevelopment) {
      // Development: call Blizzard API directly
      const token = await getAccessTokenDev();
      response = await fetch(`https://us.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName}/equipment?namespace=profile-classic-us&locale=en_US`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Production: use serverless function
      response = await fetch(`/api/character/${realmSlug}/${characterName}/equipment`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch character equipment: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching character equipment:', error);
    throw error;
  }
}

/**
 * Fetch character media using our serverless function
 * @param {string} mediaUrl - The media URL from character profile
 * @returns {Promise<Object>} Character media data
 */
export async function fetchCharacterMedia(mediaUrl) {
  try {
    let response;
    if (isDevelopment) {
      // Development: call Blizzard API directly
      const token = await getAccessTokenDev();
      response = await fetch(mediaUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Production: use serverless function
      const encodedUrl = encodeURIComponent(mediaUrl);
      response = await fetch(`/api/media?url=${encodedUrl}`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch character media: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching character media:', error);
    throw error;
  }
}

/**
 * Fetch character specializations using our serverless function
 * @param {string} realmSlug - The realm slug (e.g., "benediction")
 * @param {string} characterName - The character name
 * @returns {Promise<Object>} Character specialization data
 */
export async function fetchCharacterSpecialization(realmSlug, characterName) {
  try {
    let response;
    if (isDevelopment) {
      // Development: call Blizzard API directly
      const token = await getAccessTokenDev();
      response = await fetch(`https://us.api.blizzard.com/data/wow/character/${realmSlug}/${characterName}/specializations?namespace=profile-classic-us&locale=en_US`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Production: use serverless function
      response = await fetch(`/api/character/${realmSlug}/${characterName}/specializations`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch character specializations: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching character specializations:', error);
    throw error;
  }
}

/**
 * Get the default API configuration (kept for compatibility)
 * @returns {Object} API configuration object
 */
export function getGuildApiConfig() {
  return {
    apiBase: '/api', // Now points to our serverless functions
    locale: 'en_US',
    namespace: 'profile-classic-us',
    staticNamespace: 'static-classic-us',
    dynamicNamespace: 'dynamic-classic-us',
    region: 'us',
    version: 'classic'
  };
}
