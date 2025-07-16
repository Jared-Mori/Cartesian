import React from 'react';
import styles from './ItemTooltip.module.css';

const QUALITY_COLORS = {
  'POOR': '#9d9d9d',
  'COMMON': '#ffffff',
  'UNCOMMON': '#1eff00',
  'RARE': '#0070dd',
  'EPIC': '#a335ee',
  'LEGENDARY': '#ff8000',
  'ARTIFACT': '#e6cc80',
  'HEIRLOOM': '#00ccff',
  // Fallback numeric mapping
  0: '#9d9d9d',
  1: '#ffffff',
  2: '#1eff00',
  3: '#0070dd',
  4: '#a335ee',
  5: '#ff8000',
  6: '#e6cc80',
  7: '#00ccff',
};

const SLOT_NAMES = {
  'HEAD': 'Head',
  'NECK': 'Neck',
  'SHOULDER': 'Shoulder',
  'BACK': 'Back',
  'CHEST': 'Chest',
  'WRIST': 'Wrist',
  'HANDS': 'Hands',
  'WAIST': 'Waist',
  'LEGS': 'Legs',
  'FEET': 'Feet',
  'FINGER_1': 'Ring',
  'FINGER_2': 'Ring',
  'TRINKET_1': 'Trinket',
  'TRINKET_2': 'Trinket',
  'MAIN_HAND': 'Main Hand',
  'OFF_HAND': 'Off Hand',
  'RANGED': 'Ranged',
  'WEAPON': 'One-Hand'
};

const STAT_DISPLAY_NAMES = {
  'STRENGTH': 'Strength',
  'AGILITY': 'Agility',
  'STAMINA': 'Stamina',
  'INTELLECT': 'Intellect',
  'SPIRIT': 'Spirit',
  'ARMOR': 'Armor',
  'DODGE': 'Dodge',
  'PARRY': 'Parry',
  'BLOCK': 'Block',
  'CRIT_RATING': 'Critical Strike',
  'HASTE_RATING': 'Haste',
  'VERSATILITY': 'Versatility',
  'MASTERY_RATING': 'Mastery',
  'LEECH': 'Leech',
  'SPEED': 'Speed',
  'ATTACK_POWER': 'Attack Power',
  'SPELL_POWER': 'Spell Power',
  'MANA': 'Mana',
  'RESILIENCE_RATING': 'PvP Resilience',
  'HIT_RATING': 'Hit',
  'EXPERTISE_RATING': 'Expertise',
};

export default function ItemTooltip({ item, position, onClose }) {
  if (!item) return null;

  const getQualityColor = (item) => {
    const qualityType = item?.quality?.type || item?.item?.quality?.type || item?.preview_item?.quality?.type;
    return QUALITY_COLORS[qualityType] || QUALITY_COLORS['COMMON'];
  };

  const getItemLevel = (item) => {
    return item?.item_level || item?.level || item?.item?.item_level || '';
  };

  const getSlotType = (item) => {
    const inventoryType = item?.inventory_type?.type || item?.inventory_type?.name || 
                         item?.preview_item?.inventory_type?.type || item?.preview_item?.inventory_type?.name ||
                         item?.slot?.type || '';
    return SLOT_NAMES[inventoryType] || inventoryType;
  };

  const getItemSubclass = (item) => {
    return item?.item_subclass?.name || item?.preview_item?.item_subclass?.name || '';
  };

  const getItemStats = (item) => {
    const stats = item?.stats || item?.preview_item?.stats || [];
    return stats.map(stat => ({
      type: stat.type?.type || stat.type,
      typeName: stat.type?.name || stat.type,
      value: stat.value,
      display: stat.display?.display_string || `+${stat.value} ${stat.type?.name || stat.type}`,
      color: stat.display?.color
    }));
  };

  const getBindingInfo = (item) => {
    return item?.binding?.name || item?.preview_item?.binding?.name || '';
  };

  const getWeaponInfo = (item) => {
    return item?.weapon || item?.preview_item?.weapon || null;
  };

  const getSpellInfo = (item) => {
    return item?.spells || item?.preview_item?.spells || [];
  };

  const getRequirements = (item) => {
    return item?.requirements || item?.preview_item?.requirements || {};
  };

  const getDurability = (item) => {
    return item?.durability || item?.preview_item?.durability || null;
  };

  const getSellPrice = (item) => {
    const sellPrice = item?.sell_price || item?.preview_item?.sell_price;
    if (!sellPrice) return null;
    
    if (sellPrice.display_strings) {
      return `${sellPrice.display_strings.gold}g ${sellPrice.display_strings.silver}s ${sellPrice.display_strings.copper}c`;
    }
    
    const copper = sellPrice.value || sellPrice;
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const copperRemainder = copper % 100;
    
    let priceString = '';
    let hasHigherDenomination = false;
    
    if (gold > 0) {
      priceString += `${gold}g `;
      hasHigherDenomination = true;
    }
    
    if (silver > 0 || hasHigherDenomination) {
      priceString += `${silver}s `;
      hasHigherDenomination = true;
    }
    
    if (copperRemainder > 0 || hasHigherDenomination) {
      priceString += `${copperRemainder}c`;
    }
    
    return priceString.trim();
  };

  const renderSellPrice = (priceString) => {
    if (!priceString) return null;
    
    // Split the price string and render each part with appropriate colors
    const parts = priceString.split(' ').map((part, index) => {
      if (part.endsWith('g')) {
        const amount = part.slice(0, -1);
        return (
          <span key={index}>
            <span className={styles.colorWhite}>{amount}</span>
            <span className={styles.colorYellow}>g</span>
          </span>
        );
      } else if (part.endsWith('s')) {
        const amount = part.slice(0, -1);
        return (
          <span key={index}>
            <span className={styles.colorWhite}>{amount}</span>
            <span className={styles.colorGrey}>s</span>
          </span>
        );
      } else if (part.endsWith('c')) {
        const amount = part.slice(0, -1);
        return (
          <span key={index}>
            <span className={styles.colorWhite}>{amount}</span>
            <span style={{ color: '#cd7f32' }}>c</span>
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
    
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 ? ' ' : ''}
      </span>
    ));
  };

  const formatStatColor = (color) => {
    if (!color) return '#ffffff';
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  };

  const qualityColor = getQualityColor(item);
  const itemLevel = getItemLevel(item);
  const slotType = getSlotType(item);
  const itemSubclass = getItemSubclass(item);
  const itemStats = getItemStats(item);
  const binding = getBindingInfo(item);
  const weapon = getWeaponInfo(item);
  const spells = getSpellInfo(item);
  const requirements = getRequirements(item);
  const durability = getDurability(item);
  const sellPrice = getSellPrice(item);
  const uniqueEquipped = item?.unique_equipped || item?.preview_item?.unique_equipped;

  return (
    <div 
      className={styles.tooltip}
      style={{
        left: position.x,
        top: position.y
      }}
    >
      {/* Item Name */}
      <div 
        className={`${styles.fontTitle} ${styles.marginTitle}`}
        style={{ color: qualityColor }}
      >
        {item.name}
      </div>
      
      {/* Item Level */}
      {itemLevel && (
        <div className={`${styles.fontItemLevel} ${styles.colorYellow}`}>
          Item Level {itemLevel}
        </div>
      )}

      {/* Transmog */}
      {item.transmog && (
        <div className={`${styles.fontItemLevel} ${styles.colorPink}`}>
          {(item.transmog.display_string || item.transmog.item?.name || 'Transmogrified')
            .split('\n')
            .map((line, index) => (
              <div key={index}>{line}</div>
            ))
          }
        </div>
      )}
      
      {/* Binding */}
      {binding && (
        <div>
          {binding}
        </div>
      )}
      
      {/* Item Type */}
      <div className={`${styles.flexSpaceBetween}`}>
        <span>{slotType}</span>
        {!item.is_subclass_hidden && itemSubclass && (
          <span>{itemSubclass}</span>
        )}
      </div>
      
      {/* Weapon Damage */}
      {weapon && (
        <div>
          {weapon.damage && weapon.attack_speed && (
            <div className={`${styles.flexSpaceBetween}`}>
              <span>{weapon.damage.display_string}</span>
              <span>{weapon.attack_speed.display_string}</span>
            </div>
          )}
          {weapon.damage && !weapon.attack_speed && (
            <div>
              {weapon.damage.display_string}
            </div>
          )}
          {!weapon.damage && weapon.attack_speed && (
            <div>
              {weapon.attack_speed.display_string}
            </div>
          )}
          {weapon.dps && (
            <div>
              {weapon.dps.display_string}
            </div>
          )}
          {weapon.additional_damage && weapon.additional_damage.map((damage, index) => (
            <div key={index} className={`${styles.colorGreen}`}>
              {damage.display_string}
            </div>
          ))}
        </div>
      )}
      
      {/* Armor */}
      {item.armor && (
        <div className={`${styles.fontItemLevel}`}>
          {item.armor.display?.display_string || `${item.armor.value} Armor`}
        </div>
      )}
      
      {/* Stats */}
      {itemStats.length > 0 && (
        <div>
          {itemStats.map((stat, index) => (
            <div 
              key={index} 
              style={{ color: formatStatColor(stat.color) }}
            >
              +{stat.value} {STAT_DISPLAY_NAMES[stat.type] || stat.typeName || stat.type}
            </div>
          ))}
        </div>
      )}

      {/* Enchantments */}
      {item.enchantments && item.enchantments.length > 0 && (
        <div className={`${styles.colorPink} ${styles.italic} ${styles.marginMedium}`}>
          Enchanted: {item.enchantments[0].display_string || 'Enchanted'}
        </div>
      )}

      {/* Gems */}
      {item.gems && item.gems.length > 0 && (
        <div className={styles.marginLarge}>
          {item.gems.map((gem, index) => (
            <div key={index} className={`${styles.colorLightGreen}`}>
              {gem.item?.name || gem.name || 'Gem'}
            </div>
          ))}
        </div>
      )}

      {/* Durability */}
      {durability && (
        <div className={`${styles.colorWhite}`}>
          {durability.display_string}
        </div>
      )}

      {/* Playable Classes Requirement */}
      {requirements.playable_classes && (
        <div className={`${styles.fontItemLevel} ${styles.colorWhite}`}>
          Classes: {requirements.playable_classes.display_string || requirements.playable_classes.map(cls => cls.name).join(', ')}
        </div>
      )}

      {/* Level Requirement */}
      {requirements.level && (
        <div className={`${styles.fontItemLevel}`}>
          {requirements.level.display_string}
        </div>
      )}

      {/* Special Effects/Spells */}
      {spells.length > 0 && (
        <div className={styles.marginLarge}>
          {spells.map((spell, index) => (
            <div key={index} className={styles.marginMedium}>
              <div className={`${styles.colorGreen} ${styles.lineHeight14}`}>
                {spell.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unique Equipped */}
      {uniqueEquipped && (
        <div className={`${styles.colorYellow}`}>
          {uniqueEquipped}
        </div>
      )}

      {/* Sell Price */}
      {sellPrice && (
        <div className={`${styles.sellPriceSection}`}>
          <span className={styles.colorDarkGrey}>Sell Price: </span>
          {renderSellPrice(sellPrice)}
        </div>
      )}
    </div>
  );
}