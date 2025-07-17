import React, { useEffect, useState } from 'react';
import { fetchItemMedia } from '../../utils/blizzardApi';
import ItemTooltip from './ItemTooltip';
import styles from './GearDisplay.module.css';

export const QUALITY_COLORS = {
  'POOR': '#9d9d9d',
  'COMMON': '#ffffff',
  'UNCOMMON': '#1eff00',
  'RARE': '#0070dd',
  'EPIC': '#a335ee',
  'LEGENDARY': '#ff8000',
  'ARTIFACT': '#e6cc80',
  'HEIRLOOM': '#00ccff',
};

const LEFT_COLUMN_SLOTS = [
  'HEAD', 'NECK', 'SHOULDER', 'BACK', 'CHEST', 
  'WRIST', 'MAIN_HAND', 'OFF_HAND'
];

const RIGHT_COLUMN_SLOTS = [
  'HANDS', 'WAIST', 'LEGS', 'FEET',
  'FINGER_1', 'FINGER_2', 'TRINKET_1', 'TRINKET_2'
];

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
};

export default function GearDisplay({ equippedItems, characterName, apiConfig }) {
  const [itemIcons, setItemIcons] = useState({});
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getItemId = (item) => item?.item?.id || item?.id;
  const getMediaUrl = (item) => item?.media?.key?.href || item?.item?.media?.key?.href;

  useEffect(() => {
    if (!equippedItems?.length || !apiConfig) return;

    const loadIcons = async () => {
      for (const item of equippedItems) {
        if (item?.isEmpty) continue;
        
        const itemId = getItemId(item);
        const mediaUrl = getMediaUrl(item);
        
        if (!itemId || !mediaUrl || itemIcons[itemId]) continue;

        try {
          const media = await fetchItemMedia(mediaUrl, apiConfig);
          const iconAsset = media.assets.find(asset => asset.key === 'icon');
          
          if (iconAsset) {
            setItemIcons(prev => ({ ...prev, [itemId]: iconAsset.value }));
          }
        } catch (error) {
          console.error('Failed to load icon for item:', itemId, error);
        }
      }
    };

    loadIcons();
  }, [equippedItems, itemIcons, apiConfig]);

  const createEquipmentBySlot = () => {
    const itemsBySlot = {};
    
    equippedItems?.forEach(item => {
      if (item?.isEmpty) return;
      
      const slotType = item?.slot?.type || item?.inventory_type?.type;
      
      if (slotType === 'FINGER') {
        if (!itemsBySlot['FINGER_1']) {
          itemsBySlot['FINGER_1'] = item;
        } else {
          itemsBySlot['FINGER_2'] = item;
        }
      } else if (slotType === 'TRINKET') {
        if (!itemsBySlot['TRINKET_1']) {
          itemsBySlot['TRINKET_1'] = item;
        } else {
          itemsBySlot['TRINKET_2'] = item;
        }
      } else if (slotType) {
        itemsBySlot[slotType] = item;
      }
    });

    return itemsBySlot;
  };

  const createColumnItems = (slots, itemsBySlot) => {
    return slots.map(slotType => {
      return itemsBySlot[slotType] || {
        slot: { type: slotType },
        name: `Empty ${SLOT_NAMES[slotType]}`,
        isEmpty: true
      };
    });
  };

  const handleTooltipShow = (e, item) => {
    if (item.isEmpty) return;
    // here we set the tooltip data to show
    const element = e.currentTarget;
    const slotType = getSlotType(item) || item.slot.type;
    const isRightColumn = RIGHT_COLUMN_SLOTS.includes(slotType);
    
    setTooltipPosition({
      x: isRightColumn 
        ? element.offsetLeft - 320  // Left of element for right column (320 is tooltip width)
        : element.offsetLeft + element.offsetWidth + 10, // Right of element for left column
      y: element.offsetTop
    });
    setTooltipData(getItemId(item));
  };

  const handleTooltipHide = () => {
    setTooltipData(null);
  };

  const getQualityColor = (item) => {
    const qualityType = item?.quality?.type || item?.item?.quality?.type;
    return QUALITY_COLORS[qualityType] || QUALITY_COLORS['COMMON'];
  };

  const getItemLevel = (item) => {
    return item?.item_level || item?.level || item?.item?.item_level || '';
  };

  const getSlotType = (item) => {
    return item?.slot?.type || item?.inventory_type?.type || '';
  };

  const renderGearItem = (item, slotType) => {
    const itemId = getItemId(item);
    const icon = itemIcons[itemId];
    const qualityColor = getQualityColor(item);
    const slotName = SLOT_NAMES[slotType] || slotType;
    const itemLevel = getItemLevel(item);

    return (
      <div 
        key={slotType} 
        className={`${styles.gearSlot} ${item.isEmpty ? styles.emptySlot : ''}`}
        onMouseEnter={(e) => handleTooltipShow(e, item)}
        onMouseLeave={handleTooltipHide}
      >
        <div 
          className={styles.itemIcon}
          style={{ 
            borderColor: item.isEmpty ? '#404040' : qualityColor,
            backgroundColor: item.isEmpty ? '#1a1a1a' : undefined
          }}
        >
          {!item.isEmpty && icon ? (
            <img
              src={icon}
              alt={item.name}
              className={styles.iconImage}
            />
          ) : item.isEmpty ? (
            <div className={styles.emptySlotIcon}>
              <div className={styles.emptySlotText}>{slotName}</div>
            </div>
          ) : null}
          
          {itemLevel && !item.isEmpty && (
            <div className={styles.itemLevel}>
              {itemLevel}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderItemName = (item, slotType) => {
    const qualityColor = getQualityColor(item);
    const slotName = SLOT_NAMES[slotType] || slotType;

    const handleItemClick = () => {
      if (item.isEmpty) return;
      window.open(`https://wowhead.com/item=${getItemId(item)}`, '_blank');
    };

    return (
      <div key={`${slotType}-name`} className={styles.itemInfo}>
        <div className={styles.slotName}>{slotName}</div>
        <div 
          className={`${styles.itemName} ${!item.isEmpty ? styles.clickableItem : ''}`}
          style={{ 
            color: item.isEmpty ? '#666' : qualityColor,
          }}
          onClick={handleItemClick}
        >
          {item.name}
        </div>
      </div>
    );
  };

  const itemsBySlot = createEquipmentBySlot();
  const leftColumnItems = createColumnItems(LEFT_COLUMN_SLOTS, itemsBySlot);
  const rightColumnItems = createColumnItems(RIGHT_COLUMN_SLOTS, itemsBySlot);

  return (
    <div className={styles.characterContainer}>
      
      <div className={styles.gearContainer}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {leftColumnItems.map((item) => {
            const slotType = getSlotType(item) || item.slot.type;
            return renderGearItem(item, slotType);
          })}
        </div>

        {/* Center Column - Names */}
        <div className={styles.centerColumn}>
          {/* Left column item names */}
          <div className={styles.leftColumnNames}>
            {leftColumnItems.map((item) => {
              const slotType = getSlotType(item) || item.slot.type;
              return renderItemName(item, slotType);
            })}
          </div>

          {/* Right column item names */}
          <div className={styles.rightColumnNames}>
            {rightColumnItems.map((item) => {
              const slotType = getSlotType(item) || item.slot.type;
              return renderItemName(item, slotType);
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {rightColumnItems.map((item) => {
            const slotType = getSlotType(item) || item.slot.type;
            return renderGearItem(item, slotType);
          })}
        </div>
      </div>

      <ItemTooltip 
        itemId={tooltipData}
        position={tooltipPosition}
        onClose={handleTooltipHide}
      />
    </div>
  );
}