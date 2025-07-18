// Test to verify the actual Blizzard API URL construction
function constructBlizzardApiUrl(realm, guild, endpoint) {
  const guildEncoded = encodeURIComponent(guild.toLowerCase());
  
  if (endpoint === 'roster') {
    const namespace = 'profile-classic1x-us'; // or 'profile-classic-us'
    return `https://us.api.blizzard.com/data/wow/guild/${realm}/${guildEncoded}/roster?namespace=${namespace}&locale=en_US`;
  } else if (endpoint === 'activity') {
    return `https://us.api.blizzard.com/data/wow/guild/${realm}/${guildEncoded}/activity?namespace=profile-classic-us&locale=en_US`;
  }
  
  return null;
}

console.log('🔗 Expected Blizzard API URLs:\n');

// Test with your actual guild data
const testCases = [
  { realm: 'benediction', guild: 'cartesian', endpoint: 'roster' },
  { realm: 'benediction', guild: 'Cartesian', endpoint: 'roster' },
  { realm: 'benediction', guild: 'cartesian', endpoint: 'activity' }
];

testCases.forEach(({ realm, guild, endpoint }) => {
  const url = constructBlizzardApiUrl(realm, guild, endpoint);
  console.log(`📍 ${realm}/${guild}/${endpoint}:`);
  console.log(`   ${url}\n`);
});

// Show what the encoding does
console.log('🔧 Encoding examples:');
console.log('cartesian ->', encodeURIComponent('cartesian'.toLowerCase()));
console.log('Cartesian ->', encodeURIComponent('Cartesian'.toLowerCase()));
console.log('test guild ->', encodeURIComponent('test guild'.toLowerCase()));
