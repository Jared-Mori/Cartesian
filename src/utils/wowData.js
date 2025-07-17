// WoW class colors and role mappings

export const CLASS_COLORS = {
  'Death Knight': '#C41E3A',
  // 'Demon Hunter': '#A330C9',
  'Druid': '#FF7C0A',
  // 'Evoker': '#33937F',
  'Hunter': '#AAD372',
  'Mage': '#3FC7EB',
  'Monk': '#00FF98',
  'Paladin': '#F48CBA',
  'Priest': '#FFFFFF',
  'Rogue': '#FFF468',
  'Shaman': '#0070DD',
  'Warlock': '#8788EE',
  'Warrior': '#C69B6D'
};

export const SPEC_ROLES = {
  // Death Knight
  'Blood': 'tank',
  'Frost': 'dps',
  'Unholy': 'dps',
  
  // Demon Hunter
  'Havoc': 'dps',
  'Vengeance': 'tank',
  
  // Druid
  'Balance': 'dps',
  'Feral': 'dps',
  'Guardian': 'tank',
  'Restoration': 'healer',
  
  // Evoker
  'Devastation': 'dps',
  'Preservation': 'healer',
  'Augmentation': 'dps',
  
  // Hunter
  'Beast Mastery': 'dps',
  'Marksmanship': 'dps',
  'Survival': 'dps',
  
  // Mage
  'Arcane': 'dps',
  'Fire': 'dps',
  'Frost': 'dps',
  
  // Monk
  'Brewmaster': 'tank',
  'Mistweaver': 'healer',
  'Windwalker': 'dps',
  
  // Paladin
  'Holy': 'healer',
  'Protection': 'tank',
  'Retribution': 'dps',
  
  // Priest
  'Discipline': 'healer',
  'Holy': 'healer',
  'Shadow': 'dps',
  
  // Rogue
  'Assassination': 'dps',
  'Outlaw': 'dps',
  'Subtlety': 'dps',
  
  // Shaman
  'Elemental': 'dps',
  'Enhancement': 'dps',
  'Restoration': 'healer',
  
  // Warlock
  'Affliction': 'dps',
  'Demonology': 'dps',
  'Destruction': 'dps',
  
  // Warrior
  'Arms': 'dps',
  'Fury': 'dps',
  'Protection': 'tank'
};

/**
 * Get the hex color for a WoW class
 * @param {string} className - The WoW class name
 * @returns {string} - Hex color code
 */
export function getClassColor(className) {
  if (!className) return '#666666';
  
  // Try exact match first
  if (CLASS_COLORS[className]) {
    return CLASS_COLORS[className];
  }
  
  // Try case-insensitive match
  const normalizedClassName = className.toLowerCase();
  for (const [key, color] of Object.entries(CLASS_COLORS)) {
    if (key.toLowerCase() === normalizedClassName) {
      return color;
    }
  }
  
  console.warn(`No class color found for: "${className}"`);
  return '#666666'; // Gray fallback instead of white
}

/**
 * Get the role for a WoW specialization
 * @param {string} specName - The WoW specialization name
 * @returns {string} - Role (tank, healer, dps)
 */
export function getSpecRole(specName) {
  return SPEC_ROLES[specName] || 'dps';
}
