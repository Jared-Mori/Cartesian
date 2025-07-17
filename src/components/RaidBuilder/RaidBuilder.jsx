import React, { useState, useEffect } from 'react';
import styles from './RaidBuilder.module.css';
import { getClassColor, getSpecRole } from '../../utils/wowData';
import { fetchCharacterProfile } from '../../utils/blizzardApi';

function RaidBuilder({ rosterData = [] }) {
  const [raidSize, setRaidSize] = useState(25);
  const [raidComposition, setRaidComposition] = useState({});
  const [draggedMember, setDraggedMember] = useState(null);

  // Initialize raid slots based on size
  useEffect(() => {
    const raidConfig = raidSize === 10 
      ? { tank: 2, healer: 2, dps: 6 }
      : { tank: 2, healer: 5, dps: 18 };
    
    const slots = {};
    Object.entries(raidConfig).forEach(([role, count]) => {
      for (let i = 0; i < count; i++) {
        slots[`${role}-${i}`] = null;
      }
    });
    
    setRaidComposition(slots);
  }, [raidSize]);

  // Distribute slots evenly across 5 columns
  const getSlotColumns = () => {
    const slotsByRole = ['tank', 'healer', 'dps'].reduce((acc, role) => {
      acc.push(...Object.keys(raidComposition).filter(id => id.startsWith(role)).sort());
      return acc;
    }, []);
    
    const columns = Array.from({ length: 5 }, () => []);
    slotsByRole.forEach((slotId, index) => {
      columns[index % 5].push(slotId);
    });
    
    return columns;
  };

  // Process guild members from roster data
  const processRosterData = async () => {
    if (!rosterData?.length) return [];
    
    return Promise.all(rosterData.map(async (member, index) => {
      try {
        const character = await fetchCharacterProfile(member.realm, member.name.toLowerCase());
        return {
          id: index,
          name: character.name || member.name || `Member${index + 1}`,
          class: character.character_class?.name || 'Unknown',
          spec: character.active_spec?.name || 'Unknown',
          role: getSpecRole(character.active_spec?.name),
          level: character.level || 80,
          classColor: getClassColor(character.character_class?.name)
        };
      } catch (error) {
        console.error(`Failed to fetch character ${member.name}:`, error);
        return {
          id: index,
          name: member.name || `Member${index + 1}`,
          class: 'Unknown',
          spec: 'Unknown',
          role: 'dps',
          level: 80,
          classColor: '#666666'
        };
      }
    }));
  };

  const [guildMembers, setGuildMembers] = useState([]);

  // Update guild members when roster data changes
  useEffect(() => {
    const loadGuildMembers = async () => {
      const members = await processRosterData();
      setGuildMembers(members);
    };
    
    loadGuildMembers();
  }, [rosterData]);

  const handleDragStart = (e, member) => {
    setDraggedMember(member);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, slotId) => {
    e.preventDefault();
    if (!draggedMember) return;

    // Remove member from any existing slot
    const newComposition = { ...raidComposition };
    Object.keys(newComposition).forEach(key => {
      if (newComposition[key]?.id === draggedMember.id) {
        newComposition[key] = null;
      }
    });

    // Add to new slot
    newComposition[slotId] = draggedMember;
    setRaidComposition(newComposition);
    setDraggedMember(null);
  };

  const handleRemoveFromSlot = (slotId) => {
    setRaidComposition(prev => ({
      ...prev,
      [slotId]: null
    }));
  };

  const clearRaid = () => {
    setRaidComposition(prev => 
      Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: null }), {})
    );
  };

  // Reusable member card component
  const renderMemberCard = (member, isInSlot = false) => {
    const getRoleIcon = (role) => {
      switch(role) {
        case 'tank': return '🛡️';
        case 'healer': return '❤️';
        case 'dps': return '⚔️';
        default: return '❓';
      }
    };

    return (
      <div 
        className={styles.poolMember}
        style={{ borderColor: member.classColor || getClassColor(member.class) }}
        draggable={!isInSlot}
        onDragStart={!isInSlot ? (e) => handleDragStart(e, member) : undefined}
      >
        <span className={styles.roleIcon}>{getRoleIcon(member.role)}</span>
        <div className={styles.memberContent}>
          <div className={styles.memberName}>{member.name}</div>
          <div className={styles.memberSpec} style={{ color: member.classColor || getClassColor(member.class) }}>
            {member.spec}
          </div>
        </div>
        <span className={styles.memberLevel}>{member.level}</span>
      </div>
    );
  };

  const renderSlot = (slotId, role) => {
    const member = raidComposition[slotId];
    const slotNumber = slotId.split('-')[1];

    return (
      <div
        key={slotId}
        className={member ? styles.filledSlot : `${styles.raidSlot} ${styles[role]} ${styles.empty}`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, slotId)}
        onClick={() => member && handleRemoveFromSlot(slotId)}
      >
        {member ? (
          renderMemberCard(member, true)
        ) : (
          <div className={styles.emptySlot}>
            <div className={styles.slotLabel}>{role.toUpperCase()}</div>
            <div className={styles.slotNumber}>{parseInt(slotNumber) + 1}</div>
          </div>
        )}
      </div>
    );
  };

  const renderMemberPool = () => {
    const usedMemberIds = new Set(
      Object.values(raidComposition).filter(Boolean).map(member => member.id)
    );

    const availableMembers = guildMembers.filter(member => !usedMemberIds.has(member.id));
    const columns = Array.from({ length: 5 }, () => []);
    
    availableMembers.forEach((member, index) => {
      columns[index % 5].push(member);
    });

    return columns.map((columnMembers, columnIndex) => (
      <div key={columnIndex} className={styles.memberColumn}>
        {columnMembers.map(member => (
          <div key={member.id}>
            {renderMemberCard(member, false)}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className={styles.raidBuilder}>
      <div className={styles.builderHeader}>
        <h2>Raid Builder</h2>
        <div className={styles.controls}>
          <div className={styles.sizeSelector}>
            <button 
              className={`${styles.sizeButton} btn-base transition-smooth p-half ${raidSize === 10 ? 'gradient-secondary' : ''}`}
              onClick={() => setRaidSize(10)}
            >
              10 Man
            </button>
            <button 
              className={`${styles.sizeButton} btn-base transition-smooth p-half ${raidSize === 25 ? 'gradient-secondary' : ''}`}
              onClick={() => setRaidSize(25)}
            >
              25 Man
            </button>
            <button onClick={clearRaid} className={`${styles.sizeButton} btn-base btn-primary p-half`}>
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div className={styles.raidPanel}>
        <div className={styles.raidComposition}>
          {getSlotColumns().map((columnSlots, columnIndex) => (
            <div key={columnIndex} className={styles.slotColumn}>
              {columnSlots.map(slotId => {
                const [role] = slotId.split('-');
                return renderSlot(slotId, role);
              })}
            </div>
          ))}
        </div>

        <div className={styles.memberPool}>
          <div className={styles.poolGrid}>
            {renderMemberPool()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RaidBuilder;
