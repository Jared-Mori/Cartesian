export const CONSUMABLE_SETS = {
  flasks: {
    strength: [76088],
    agility: [76084],
    intellect: [76085],
    stamina: [76087],
    armor: [76085],
    crit: [76086],
  },
  
  potions: {
    strength: [76095],
    agility: [76089],
    intellect: [76093],
    mana: [76092],
    haste: [86125],
    armor: [76090],
  },
  
  food: {
    strength: [74646],
    agility: [74648],
    intellect: [74650],
    stamina: [74656],
    hit: [86073],
    mastery: [101745],
    expertise: [86074],
    generic: [101618],
  }
};

export const CONSUMABLES_DATA = {
  'warrior-fury': {
    flasks: [CONSUMABLE_SETS.flasks.strength],
    food: [CONSUMABLE_SETS.food.strength, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.strength]
  },

  'warrior-protection': {
    flasks: [CONSUMABLE_SETS.flasks.strength, CONSUMABLE_SETS.flasks.stamina],
    food: [CONSUMABLE_SETS.food.hit, CONSUMABLE_SETS.food.expertise, CONSUMABLE_SETS.food.mastery, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.strength]
  },

  'warrior-arms': {
    flasks: [CONSUMABLE_SETS.flasks.strength],
    food: [CONSUMABLE_SETS.food.strength, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.strength]
  },

  'paladin-holy': {
    flasks: [CONSUMABLE_SETS.flasks.intellect],
    food: [CONSUMABLE_SETS.food.intellect, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.mana]
  },

  'paladin-protection': {
    flasks: [CONSUMABLE_SETS.flasks.stamina, CONSUMABLE_SETS.flasks.strength],
    food: [CONSUMABLE_SETS.food.hit, CONSUMABLE_SETS.food.expertise, CONSUMABLE_SETS.food.mastery, CONSUMABLE_SETS.food.stamina],
    potions: [CONSUMABLE_SETS.potions.armor, CONSUMABLE_SETS.potions.strength]
  },

  'paladin-retribution': {
    flasks: [CONSUMABLE_SETS.flasks.strength, CONSUMABLE_SETS.flasks.stamina],
    food: [CONSUMABLE_SETS.food.hit, CONSUMABLE_SETS.food.expertise, CONSUMABLE_SETS.food.mastery, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.strength]
  },

  'hunter-beast': {
    flasks: [CONSUMABLE_SETS.flasks.agility],
    food: [CONSUMABLE_SETS.food.agility, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.agility]
  },

  'hunter-marksmanship': {
    flasks: [CONSUMABLE_SETS.flasks.agility],
    food: [CONSUMABLE_SETS.food.agility, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.agility]
  },

  'hunter-survival': {
    flasks: [CONSUMABLE_SETS.flasks.agility],
    food: [CONSUMABLE_SETS.food.agility, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.agility]
  },

  'rogue-assassination': {
    flasks: [CONSUMABLE_SETS.flasks.agility],
    food: [CONSUMABLE_SETS.food.agility, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.agility]
  },

  'rogue-combat': {
    flasks: [CONSUMABLE_SETS.flasks.agility],
    food: [CONSUMABLE_SETS.food.agility, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.agility]
  },

  'rogue-subtlety': {
    flasks: [CONSUMABLE_SETS.flasks.agility],
    food: [CONSUMABLE_SETS.food.agility, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.agility]
  },

  'priest-holy': {
    flasks: [CONSUMABLE_SETS.flasks.intellect],
    food: [CONSUMABLE_SETS.food.intellect, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.mana, CONSUMABLE_SETS.potions.intellect]
  },

  'priest-discipline': {
    flasks: [CONSUMABLE_SETS.flasks.intellect],
    food: [CONSUMABLE_SETS.food.intellect, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.mana, CONSUMABLE_SETS.potions.intellect]
  },

  'priest-shadow': {
    flasks: [CONSUMABLE_SETS.flasks.intellect],
    food: [CONSUMABLE_SETS.food.intellect, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.intellect]
  },

  'shaman-elemental': {
    flasks: [CONSUMABLE_SETS.flasks.intellect],
    food: [CONSUMABLE_SETS.food.intellect, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.intellect]
  },

  'shaman-enhancement': {
    flasks: [CONSUMABLE_SETS.flasks.agility],
    food: [CONSUMABLE_SETS.food.agility, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.agility]
  },

  'shaman-restoration': {
    flasks: [CONSUMABLE_SETS.flasks.intellect],
    food: [CONSUMABLE_SETS.food.intellect, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.mana, CONSUMABLE_SETS.potions.intellect]
  },

  'mage-arcane': {
    flasks: [CONSUMABLE_SETS.flasks.intellect],
    food: [CONSUMABLE_SETS.food.intellect, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.intellect]
  },

  'mage-fire': {
    flasks: [CONSUMABLE_SETS.flasks.intellect],
    food: [CONSUMABLE_SETS.food.intellect, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.intellect]
  },

  'mage-frost': {
    flasks: [CONSUMABLE_SETS.flasks.intellect],
    food: [CONSUMABLE_SETS.food.intellect, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.intellect]
  },

  'warlock-affliction': {
    flasks: [CONSUMABLE_SETS.flasks.intellect],
    food: [CONSUMABLE_SETS.food.intellect, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.intellect]
  },

  'warlock-demonology': {
    flasks: [CONSUMABLE_SETS.flasks.intellect],
    food: [CONSUMABLE_SETS.food.intellect, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.intellect]
  },

  'warlock-destruction': {
    flasks: [CONSUMABLE_SETS.flasks.intellect],
    food: [CONSUMABLE_SETS.food.intellect, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.intellect]
  },

  'druid-balance': {
    flasks: [CONSUMABLE_SETS.flasks.intellect],
    food: [CONSUMABLE_SETS.food.intellect, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.intellect]
  },

  'druid-feral': {
    flasks: [CONSUMABLE_SETS.flasks.agility],
    food: [CONSUMABLE_SETS.food.agility, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.agility]
  },

  'druid-guardian': {
    flasks: [CONSUMABLE_SETS.flasks.armor, CONSUMABLE_SETS.flasks.crit],
    food: [CONSUMABLE_SETS.food.stamina, CONSUMABLE_SETS.food.agility, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.agility]
  },

  'druid-restoration': {
    flasks: [CONSUMABLE_SETS.flasks.intellect],
    food: [CONSUMABLE_SETS.food.intellect, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.mana, CONSUMABLE_SETS.potions.intellect]
  },

  'deathknight-blood': {
    flasks: [CONSUMABLE_SETS.flasks.strength, CONSUMABLE_SETS.flasks.stamina],
    food: [CONSUMABLE_SETS.food.hit, CONSUMABLE_SETS.food.expertise, CONSUMABLE_SETS.food.mastery, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.strength, CONSUMABLE_SETS.potions.haste]
  },

  'deathknight-frost': {
    flasks: [CONSUMABLE_SETS.flasks.strength, CONSUMABLE_SETS.flasks.stamina],
    food: [CONSUMABLE_SETS.food.hit, CONSUMABLE_SETS.food.expertise, CONSUMABLE_SETS.food.mastery, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.strength]
  },

  'deathknight-unholy': {
    flasks: [CONSUMABLE_SETS.flasks.strength, CONSUMABLE_SETS.flasks.stamina],
    food: [CONSUMABLE_SETS.food.hit, CONSUMABLE_SETS.food.expertise, CONSUMABLE_SETS.food.mastery, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.strength]
  },

  'monk-brewmaster': {
    flasks: [CONSUMABLE_SETS.flasks.agility],
    food: [CONSUMABLE_SETS.food.agility, CONSUMABLE_SETS.food.hit, CONSUMABLE_SETS.food.expertise],
    potions: [CONSUMABLE_SETS.potions.agility]
  },

  'monk-mistweaver': {
    flasks: [CONSUMABLE_SETS.flasks.intellect],
    food: [CONSUMABLE_SETS.food.intellect, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.mana, CONSUMABLE_SETS.potions.intellect]
  },

  'monk-windwalker': {
    flasks: [CONSUMABLE_SETS.flasks.agility],
    food: [CONSUMABLE_SETS.food.agility, CONSUMABLE_SETS.food.generic],
    potions: [CONSUMABLE_SETS.potions.agility]
  }
};

export const CLASS_SPECS = {
  'warrior-fury': { class: 'Warrior', spec: 'Fury', role: 'DPS' },
  'warrior-protection': { class: 'Warrior', spec: 'Protection', role: 'Tank' },
  'warrior-arms': { class: 'Warrior', spec: 'Arms', role: 'DPS' },
  'paladin-holy': { class: 'Paladin', spec: 'Holy', role: 'Healer' },
  'paladin-protection': { class: 'Paladin', spec: 'Protection', role: 'Tank' },
  'paladin-retribution': { class: 'Paladin', spec: 'Retribution', role: 'DPS' },
  'hunter-beast': { class: 'Hunter', spec: 'Beast Mastery', role: 'DPS' },
  'hunter-marksmanship': { class: 'Hunter', spec: 'Marksmanship', role: 'DPS' },
  'hunter-survival': { class: 'Hunter', spec: 'Survival', role: 'DPS' },
  'rogue-assassination': { class: 'Rogue', spec: 'Assassination', role: 'DPS' },
  'rogue-combat': { class: 'Rogue', spec: 'Outlaw', role: 'DPS' },
  'rogue-subtlety': { class: 'Rogue', spec: 'Subtlety', role: 'DPS' },
  'priest-holy': { class: 'Priest', spec: 'Holy', role: 'Healer' },
  'priest-discipline': { class: 'Priest', spec: 'Discipline', role: 'Healer' },
  'priest-shadow': { class: 'Priest', spec: 'Shadow', role: 'DPS' },
  'shaman-elemental': { class: 'Shaman', spec: 'Elemental', role: 'DPS' },
  'shaman-enhancement': { class: 'Shaman', spec: 'Enhancement', role: 'DPS' },
  'shaman-restoration': { class: 'Shaman', spec: 'Restoration', role: 'Healer' },
  'mage-arcane': { class: 'Mage', spec: 'Arcane', role: 'DPS' },
  'mage-fire': { class: 'Mage', spec: 'Fire', role: 'DPS' },
  'mage-frost': { class: 'Mage', spec: 'Frost', role: 'DPS' },
  'warlock-affliction': { class: 'Warlock', spec: 'Affliction', role: 'DPS' },
  'warlock-demonology': { class: 'Warlock', spec: 'Demonology', role: 'DPS' },
  'warlock-destruction': { class: 'Warlock', spec: 'Destruction', role: 'DPS' },
  'druid-balance': { class: 'Druid', spec: 'Balance', role: 'DPS' },
  'druid-feral': { class: 'Druid', spec: 'Feral', role: 'DPS' },
  'druid-guardian': { class: 'Druid', spec: 'Guardian', role: 'Tank' },
  'druid-restoration': { class: 'Druid', spec: 'Restoration', role: 'Healer' },
  'deathknight-blood': { class: 'Death Knight', spec: 'Blood', role: 'Tank' },
  'deathknight-frost': { class: 'Death Knight', spec: 'Frost', role: 'DPS' },
  'deathknight-unholy': { class: 'Death Knight', spec: 'Unholy', role: 'DPS' },
  // 'demonhunter-havoc': { class: 'Demon Hunter', spec: 'Havoc', role: 'DPS' },
  // 'demonhunter-vengeance': { class: 'Demon Hunter', spec: 'Vengeance', role: 'Tank' },
  'monk-brewmaster': { class: 'Monk', spec: 'Brewmaster', role: 'Tank' },
  'monk-mistweaver': { class: 'Monk', spec: 'Mistweaver', role: 'Healer' },
  'monk-windwalker': { class: 'Monk', spec: 'Windwalker', role: 'DPS' },
  // 'evoker-devastation': { class: 'Evoker', spec: 'Devastation', role: 'DPS' },
  // 'evoker-preservation': { class: 'Evoker', spec: 'Preservation', role: 'Healer' },
  // 'evoker-augmentation': { class: 'Evoker', spec: 'Augmentation', role: 'Support' }
};
