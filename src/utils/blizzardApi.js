import * as config from './config.js';

let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Get the default API configuration for Cartesian guild
 * @returns {Object} API configuration object
 */
export function getGuildApiConfig() {
  return {
    apiBase: config.BLIZZARD_API_BASE,
    locale: config.GUILD_CONFIG.locale,
    namespace: config.GUILD_CONFIG.namespace,
    staticNamespace: config.GUILD_CONFIG.staticNamespace,
    dynamicNamespace: config.GUILD_CONFIG.dynamicNamespace,
    region: config.GUILD_CONFIG.region,
    version: config.GUILD_CONFIG.version
  };
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getGuildApiConfig() instead
 */
export function getApiConfig() {
  return getGuildApiConfig();
}

/**
 * Get an OAuth token with the client‑credentials grant.
 * Caches the token in memory until ~1 minute before expiry.
 */
export async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const body = new URLSearchParams({ grant_type: 'client_credentials' });

  const res = await fetch(config.BLIZZARD_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(`${config.clientId}:${config.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token request failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  cachedToken   = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;

  return cachedToken;
}

 /**
  * ===== Guild profile functions =====
  */

/**
 * Fetch the roster for Cartesian guild
 * @returns {Promise<Array>}  Array of roster member objects
 */
export async function fetchCartesianGuildRoster() {
  return fetchGuildRoster(config.GUILD_CONFIG.realm, config.GUILD_CONFIG.name.toLowerCase());
}

/**
 * Fetch the activity for Cartesian guild
 * @returns {Promise<Object>}  Guild activity object
 */
export async function fetchCartesianGuildActivity() {
  return fetchGuildActivity(config.GUILD_CONFIG.realm, config.GUILD_CONFIG.name.toLowerCase());
}

/**
 * Fetch the achievements for Cartesian guild
 * @returns {Promise<Object>}  Guild achievements object
 */
export async function fetchCartesianGuildAchievements() {
  return fetchGuildAchievements(config.GUILD_CONFIG.realm, config.GUILD_CONFIG.name.toLowerCase());
}

/**
 * Fetch the roster for a guild
 * @param {string} realmSlug  e.g. "benediction"
 * @param {string} guildName  Case‑sensitive guild name
 * @param {Object} apiConfig Optional configuration object (defaults to guild config)
 * @returns {Promise<Array>}  Array of roster member objects
 */
export async function fetchGuildRoster(realmSlug, guildName, apiConfig = null) {
  const token = await getAccessToken();

  // Use provided config or fall back to guild defaults
  const config_to_use = apiConfig || getGuildApiConfig();
  const apiBase = config_to_use.apiBase;
  const locale = config_to_use.locale;
  const namespace = config_to_use.namespace;

  const url =
    `${apiBase}/data/wow/guild/${realmSlug}/` +
    `${encodeURIComponent(guildName)}/roster` +
    `?namespace=${namespace}&locale=${locale}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Roster fetch failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.members;            // → array of { character, rank }
}

/**
 * Fetch the guild activity for a guild
 * @param {string} realmSlug  e.g. "benediction"
 * @param {string} guildName  Case‑sensitive guild name
 * @param {Object} apiConfig Optional configuration object (defaults to guild config)
 * @returns {Promise<Object>}  Guild activity object
 */
export async function fetchGuildActivity(realmSlug, guildName, apiConfig = null) {
  const token = await getAccessToken();

  // Use provided config or fall back to guild defaults
  const config_to_use = apiConfig || getGuildApiConfig();
  const apiBase = config_to_use.apiBase;
  const locale = config_to_use.locale;
  const namespace = config_to_use.namespace;

  const url =
    `${apiBase}/data/wow/guild/${realmSlug}/` +
    `${encodeURIComponent(guildName)}/activity` +
    `?namespace=${namespace}&locale=${locale}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Activity fetch failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data;
}

/**
 * Fetch the guild achievements for a guild
 * @param {string} realmSlug  e.g. "area-52"
 * @param {string} guildName  Case‑sensitive guild name
 * @returns {Promise<Object>}  Guild achievements object
 */
export async function fetchGuildAchievements(realmSlug, guildName) {
  const token = await getAccessToken();

  const url =
    `${config.BLIZZARD_API_BASE}/data/wow/guild/${realmSlug}/` +
    `${encodeURIComponent(guildName)}/achievements` +
    `?namespace=${config.profile_namespace}&locale=${config.locale}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Achievements fetch failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data;
}

 /**
  * ===== Player profile functions =====
  */

/**
 * Fetch the profile for a character
 * @param {string} realmSlug  e.g. "benediction"
 * @param {string} characterName  Case‑sensitive character name
 * @param {Object} apiConfig Optional configuration object (defaults to guild config)
 * @returns {Promise<Object>}  Character profile object
 */
export async function fetchCharacterProfile(realmSlug, characterName, apiConfig = null) {
  const token = await getAccessToken();

  console.log("Fetching character profile for:", characterName);

  // Use provided config or fall back to guild defaults
  const config_to_use = apiConfig || getGuildApiConfig();
  const apiBase = config_to_use.apiBase;
  const locale = config_to_use.locale;
  const namespace = config_to_use.namespace;

  const url =
    `${apiBase}/profile/wow/character/${realmSlug}/` +
    `${encodeURIComponent(characterName)}` +
    `?namespace=${namespace}&locale=${locale}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Character profile fetch failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data;
}

/**
 * Fetch the equipment for a character
 * @param {string} realmSlug  e.g. "area-52"
 * @param {string} characterName  Case‑sensitive character name
 * @param {Object} apiConfig Configuration object with region, locale, version
 * @returns {Promise<Object>}  Character equipment object
 */
export async function fetchCharacterEquipment(realmSlug, characterName, apiConfig = null) {
  const token = await getAccessToken();

  // Use provided config or fall back to defaults
  const apiBase = apiConfig?.apiBase || config.BLIZZARD_API_BASE;
  const locale = apiConfig?.locale || config.locale;
  const namespace = apiConfig?.namespace || config.profile_namespace;

  const url =
    `${apiBase}/profile/wow/character/${realmSlug}/` +
    `${encodeURIComponent(characterName)}/equipment` +
    `?namespace=${namespace}&locale=${locale}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Character equipment fetch failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data;
}

/**
 * Fetch the Specialization data for a character
 * @param {string} realmSlug  e.g. "area-52"
 * @param {string} characterName  Case‑sensitive character name
 * @param {Object} apiConfig Configuration object with region, locale, version
 * @returns {Promise<Object>}  Character specialization object
 */
export async function fetchCharacterSpecialization(realmSlug, characterName, apiConfig = null) {
  const token = await getAccessToken();

  // Use provided config or fall back to defaults
  const apiBase = apiConfig?.apiBase || config.BLIZZARD_API_BASE;
  const locale = apiConfig?.locale || config.locale;
  const namespace = apiConfig?.namespace || config.profile_namespace;

  const url =
    `${apiBase}/profile/wow/character/${realmSlug}/` +
    `${encodeURIComponent(characterName)}/specializations` +
    `?namespace=${namespace}&locale=${locale}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Character specialization fetch failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data;
}

 /**
  * ===== Media functions =====
  */

/**
 * Fetch Item Media for a specific item
 * @param {string} itemUrl  The URL of the item to fetch media for
 * @param {Object} apiConfig Configuration object with region, locale, version
 */
export async function fetchItemMedia(itemUrl, apiConfig = null) {
  const token = await getAccessToken();

  // Use provided config or fall back to defaults
  const locale = apiConfig?.locale || config.locale;

  const url = `${itemUrl}&locale=${locale}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Item media fetch failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data;
}

/**
 * Fetch character Media for a specific character
 * @param {string} characterUrl  The URL of the character to fetch media for
 * @returns {Promise<Array>}  Array of item class objects
 */
export async function fetchCharacterMedia(characterUrl) {
  const token = await getAccessToken();

  const url =
    `${characterUrl}&locale=${config.locale}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Character media fetch failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data;
}
