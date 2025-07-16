export const BLIZZARD_TOKEN_URL = 'https://oauth.battle.net/token';
export const BLIZZARD_API_BASE = 'https://us.api.blizzard.com';

export const clientId     = import.meta.env.VITE_BLIZZARD_CLIENT_ID;
export const clientSecret = import.meta.env.VITE_BLIZZARD_CLIENT_SECRET;

// Guild-specific configuration
export const GUILD_CONFIG = {
  name: 'Cartesian',
  realm: 'benediction',
  region: 'us',
  locale: 'en_US',
  version: 'classic',
  namespace: 'profile-classic-us',
  staticNamespace: 'static-classic-us',
  dynamicNamespace: 'dynamic-classic-us'
};

// Legacy exports for backward compatibility
export const locale = GUILD_CONFIG.locale;
export const profile_namespace = GUILD_CONFIG.namespace;
export const static_namespace = GUILD_CONFIG.staticNamespace;
export const REALM_SLUG = GUILD_CONFIG.realm;
export const GUILD_NAME = GUILD_CONFIG.name.toLowerCase();