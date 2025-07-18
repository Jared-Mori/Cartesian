import React, { useEffect, useState, memo } from 'react';
import { fetchCharacterProfile, fetchCharacterEquipment, fetchCharacterMedia } from '../../utils/apiClient';
import { getClassColor } from '../../utils/wowData';
import GearDisplay from './GearDisplay';
import styles from './CharacterDisplay.module.css';
import TalentDisplay from './TalentDisplay';

const CharacterDisplay = memo(function CharacterDisplay({ 
  realm, 
  characterName, 
  apiConfig,
  draggable = false,
  onDragStart,
  onDragEnd,
  isDragging = false
}) {
  const [characterData, setCharacterData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get faction color CSS class based on race
  const getFactionColorClass = (raceName) => {
    if (!raceName) return '';
    
    const hordeRaces = [
      'Orc', 'Undead', 'Tauren', 'Troll', 'Blood Elf', 'Goblin', 
      'Highmountain Tauren', 'Nightborne', 'Mag\'har Orc', 'Zandalari Troll', 'Vulpera'
    ];
    
    const allianceRaces = [
      'Human', 'Dwarf', 'Night Elf', 'Gnome', 'Draenei', 'Worgen',
      'Lightforged Draenei', 'Void Elf', 'Dark Iron Dwarf', 'Kul Tiran', 'Mechagnome'
    ];
    
    if (hordeRaces.includes(raceName)) {
      return 'factionHorde';
    } else if (allianceRaces.includes(raceName)) {
      return 'factionAlliance';
    }
    
    return '';
  };

  useEffect(() => {
    async function loadCharacterData() {
      try {
        setLoading(true);
        const profile = await fetchCharacterProfile(realm, characterName.toLowerCase());
        const equipment = await fetchCharacterEquipment(realm, characterName.toLowerCase());
        const charIcon = await fetchCharacterMedia(profile.media.href);

        setCharacterData({
          name: characterName,
          class: profile.character_class.name,
          spec: profile.active_spec.name,
          level: profile.level,
          race: profile.race.name,
          itemLevel: profile.average_item_level,
          equippedItems: equipment.equipped_items,
          charIcon: charIcon.assets.find(a => a.key === 'avatar')?.value
        });
      } catch (err) {
        console.error(`Failed to fetch data for ${characterName}`, err);
        setError(`Failed to load character data for ${characterName}`);
      } finally {
        setLoading(false);
      }
    }

    if (realm && characterName && apiConfig) {
      loadCharacterData();
    }
  }, [realm, characterName, apiConfig]);

  if (loading) {
    return (
      <div className={styles.characterContainer}>
        <div className={styles.characterHeader}>
          <h3 className={styles.characterName}>{characterName}</h3>
          <p className={styles.loadingText}>Loading character data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.characterContainer}>
        <div className={styles.characterHeader}>
          <h3 className={styles.characterName}>{characterName}</h3>
          <p className={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.characterContainer} ${isDragging ? styles.dragging : ''}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className={styles.characterHeader}>
        <div className={styles.characterInfoContainer}>
          <img
            src={characterData.charIcon}
            alt={`${characterData.name} icon`}
            title={`${characterData.name} (${characterData.class})`}
            className={styles.characterAvatar}
          />
          <div className={styles.characterDetails}>
            <h3 className={styles.characterName} style={{ color: getClassColor(characterData.class) }}>
              {characterData.name}
            </h3>
            <p className={styles.characterInfoText}>
              <span className={styles[getFactionColorClass(characterData.race)]}>{characterData.race}</span> <span style={{ color: getClassColor(characterData.class) }}>{characterData.spec}</span> <span style={{ color: getClassColor(characterData.class) }}>{characterData.class}</span>
            </p>
            <p className={styles.levelAndItemLevel}>
              Level {characterData.level} • Item Level: {characterData.itemLevel}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.gearSection}>
        <GearDisplay equippedItems={characterData.equippedItems} characterName={characterData.name} apiConfig={apiConfig} />
      </div>
    </div>
  );
});

export default CharacterDisplay;
