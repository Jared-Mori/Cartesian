import React, { useEffect, useState } from 'react';
import { fetchItemData, fetchItemMedia, getGuildApiConfig } from '../../utils/blizzardApi';
import ItemTooltip from '../CharacterDisplay/ItemTooltip';
import { QUALITY_COLORS } from '../CharacterDisplay/GearDisplay';
import { CONSUMABLES_DATA, CLASS_SPECS } from '../../data/consumablesData';
import styles from './GuildConsumables.module.css';

export default function GuildConsumables() {
  const [selectedClassSpec, setSelectedClassSpec] = useState('warrior-fury');
  const [itemsData, setItemsData] = useState({});
  const [itemIcons, setItemIcons] = useState({});
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [loadingItems, setLoadingItems] = useState(new Set());
  const [failedItems, setFailedItems] = useState(new Set());
  const apiConfig = getGuildApiConfig();

  useEffect(() => {
    const consumableData = CONSUMABLES_DATA[selectedClassSpec];
    if (!consumableData) return;

    const loadConsumables = async () => {
      const allItems = [
        ...consumableData.flasks,
        ...consumableData.elixirs,
        ...consumableData.food,
        ...consumableData.potions
      ];

      for (const itemId of allItems) {
        // Skip if already loading, loaded, or failed
        if (loadingItems.has(itemId) || itemsData[itemId] || failedItems.has(itemId)) {
          continue;
        }

        setLoadingItems(prev => new Set([...prev, itemId]));

        try {
          // Fetch item data
          const itemData = await fetchItemData(itemId);
          setItemsData(prev => ({ ...prev, [itemId]: itemData }));

          // Fetch item icon
          const mediaUrl = itemData?.media?.key?.href;
          if (mediaUrl && !itemIcons[itemId]) {
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
        } catch (error) {
          console.error('Failed to load item data:', itemId, error);
          setFailedItems(prev => new Set([...prev, itemId]));
        } finally {
          setLoadingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
          });
        }
      }
    };

    loadConsumables();
  }, [selectedClassSpec, apiConfig]); // Removed itemsData and itemIcons from dependencies

  const handleTooltipShow = (e, itemId) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top
    });
    setTooltipData(itemId);
  };

  const handleTooltipHide = () => {
    setTooltipData(null);
  };

  const getQualityColor = (itemData) => {
    const qualityType = itemData?.quality?.type;
    return QUALITY_COLORS[qualityType] || QUALITY_COLORS['COMMON'];
  };

  const renderConsumableIcon = (itemId, index) => {
    const itemData = itemsData[itemId];
    const icon = itemIcons[itemId];
    const qualityColor = getQualityColor(itemData);

    return (
      <div 
        key={`${itemId}-${index}-icon`}
        className={styles.gearSlot}
        onMouseEnter={(e) => handleTooltipShow(e, itemId)}
        onMouseLeave={handleTooltipHide}
      >
        <div 
          className={styles.itemIcon}
          style={{ 
            borderColor: itemData ? qualityColor : '#404040'
          }}
        >
          {icon ? (
            <img
              src={icon}
              alt={itemData?.name || `Item ${itemId}`}
              className={styles.iconImage}
            />
          ) : itemData ? (
            <div className={styles.loadingIcon}>...</div>
          ) : (
            <div className={styles.emptySlotIcon}>
              <div className={styles.emptySlotText}>Loading</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderConsumableName = (itemId, index) => {
    const itemData = itemsData[itemId];
    const qualityColor = getQualityColor(itemData);

    const handleItemClick = () => {
      if (itemData) {
        window.open(`https://wowhead.com/item=${itemId}`, '_blank');
      }
    };

    return (
      <div key={`${itemId}-${index}-name`} className={styles.itemInfo}>
        <div 
          className={`${styles.itemName} ${itemData ? styles.clickableItem : ''}`}
          style={{ 
            color: itemData ? qualityColor : '#666'
          }}
          onClick={handleItemClick}
        >
          {itemData?.name || `Item ${itemId}`}
        </div>
      </div>
    );
  };

  const consumableData = CONSUMABLES_DATA[selectedClassSpec] || { flasks: [], elixirs: [], food: [], potions: [] };

  return (
    <div className={styles.consumablesContainer}>
      <div className={styles.header}>
        <h2>Consumables Guide</h2>
        <select 
          value={selectedClassSpec} 
          onChange={(e) => setSelectedClassSpec(e.target.value)}
          className={styles.dropdown}
        >
          {Object.entries(CLASS_SPECS).map(([key, data]) => (
            <option key={key} value={key}>
              {data.class} - {data.spec}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.consumablesGrid}>
        {/* Flasks Section */}
        <div className={styles.categorySection}>
          <h3>Flasks</h3>
          <div className={styles.categoryItems}>
            <div className={styles.itemsColumn}>
              {consumableData.flasks.map((itemId, index) => renderConsumableIcon(itemId, index))}
            </div>
            <div className={styles.namesColumn}>
              {consumableData.flasks.map((itemId, index) => renderConsumableName(itemId, index))}
            </div>
          </div>
        </div>

        {/* Elixirs Section */}
        <div className={styles.categorySection}>
          <h3>Elixirs</h3>
          <div className={styles.categoryItems}>
            <div className={styles.itemsColumn}>
              {consumableData.elixirs.map((itemId, index) => renderConsumableIcon(itemId, index))}
            </div>
            <div className={styles.namesColumn}>
              {consumableData.elixirs.map((itemId, index) => renderConsumableName(itemId, index))}
            </div>
          </div>
        </div>

        {/* Food Section */}
        <div className={styles.categorySection}>
          <h3>Food</h3>
          <div className={styles.categoryItems}>
            <div className={styles.itemsColumn}>
              {consumableData.food.map((itemId, index) => renderConsumableIcon(itemId, index))}
            </div>
            <div className={styles.namesColumn}>
              {consumableData.food.map((itemId, index) => renderConsumableName(itemId, index))}
            </div>
          </div>
        </div>

        {/* Potions Section */}
        <div className={styles.categorySection}>
          <h3>Potions</h3>
          <div className={styles.categoryItems}>
            <div className={styles.itemsColumn}>
              {consumableData.potions.map((itemId, index) => renderConsumableIcon(itemId, index))}
            </div>
            <div className={styles.namesColumn}>
              {consumableData.potions.map((itemId, index) => renderConsumableName(itemId, index))}
            </div>
          </div>
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
