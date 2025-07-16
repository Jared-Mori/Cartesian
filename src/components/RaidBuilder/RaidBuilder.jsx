import React, { useState, useEffect } from 'react';
import styles from './RaidBuilder.module.css';
import { getClassColor, getSpecRole } from '../../utils/wowData';
import { fetchCharacterProfile } from '../../utils/blizzardApi';

function RaidBuilder({ guildStats, rosterData = [] }) {
  const [raidSize, setRaidSize] = useState(25);
  const [raidComposition, setRaidComposition] = useState({});
  const [draggedMember, setDraggedMember] = useState(null);

  // Initialize raid slots based on size
  useEffect(() => {
    const slots = {};
    if (raidSize === 10) {
      // 2 tanks, 2 healers, 6 dps = 10 total
      // Distribute evenly across 5 columns: 2 slots per column
      for (let i = 0; i < 2; i++) slots[`tank-${i}`] = null;
      for (let i = 0; i < 2; i++) slots[`healer-${i}`] = null;
      for (let i = 0; i < 6; i++) slots[`dps-${i}`] = null;
    } else {
      // 2 tanks, 5 healers, 18 dps = 25 total
      // Distribute evenly across 5 columns: 5 slots per column
      for (let i = 0; i < 2; i++) slots[`tank-${i}`] = null;
      for (let i = 0; i < 5; i++) slots[`healer-${i}`] = null;
      for (let i = 0; i < 18; i++) slots[`dps-${i}`] = null;
    }
    setRaidComposition(slots);
  }, [raidSize]);

  // Distribute slots evenly across 5 columns
  const getSlotColumns = () => {
    // Order: tanks first, then healers, then dps
    const tankSlots = Object.keys(raidComposition).filter(id => id.startsWith('tank')).sort();
    const healerSlots = Object.keys(raidComposition).filter(id => id.startsWith('healer')).sort();
    const dpsSlots = Object.keys(raidComposition).filter(id => id.startsWith('dps')).sort();
    
    const allSlots = [...tankSlots, ...healerSlots, ...dpsSlots];
    const slotsPerColumn = raidSize === 10 ? 2 : 5;
    const columns = [[], [], [], [], []];
    
    allSlots.forEach((slotId, index) => {
      const columnIndex = index % 5;
      columns[columnIndex].push(slotId);
    });
    
    return columns;
  };

  // Process real guild members from roster data
  const processRosterData = async () => {
    if (!rosterData || rosterData.length === 0) {
      return [];
    }
    
    const processedMembers = [];
    
    for (let index = 0; index < rosterData.length; index++) {
      const member = rosterData[index];
      try {
        // Fetch detailed character profile
        const character = await fetchCharacterProfile(member.realm, member.name.toLowerCase());
        
        const className = character.character_class?.name || 'Unknown';
        const spec = character.active_spec?.name || 'Unknown';
        const level = character.level || 80;
        const name = character.name || member.name || `Member${index + 1}`;
        
        // You can implement the role detection logic here
        const role = getSpecRole(spec);
        const classColor = getClassColor(className);

        processedMembers.push({
          id: index,
          name: name,
          class: className,
          spec: spec,
          role: role,
          level: level,
          classColor: classColor // Store the color directly
        });
      } catch (error) {
        console.error(`Failed to fetch character ${member.name}:`, error);
        // Fallback for failed API calls
        processedMembers.push({
          id: index,
          name: member.name || `Member${index + 1}`,
          class: 'Unknown',
          spec: 'Unknown',
          role: 'dps',
          level: 80,
          classColor: '#666666' // Gray fallback color
        });
      }
    }
    
    return processedMembers;
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
    const slots = {};
    Object.keys(raidComposition).forEach(key => {
      slots[key] = null;
    });
    setRaidComposition(slots);
  };

  const exportRaid = () => {
    const raidData = {
      size: raidSize,
      composition: raidComposition,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(raidData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `raid-composition-${raidSize}man-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
      Object.values(raidComposition)
        .filter(Boolean)
        .map(member => member.id)
    );

    const availableMembers = guildMembers.filter(member => !usedMemberIds.has(member.id));

    // Organize members into 5 columns
    const columns = [[], [], [], [], []];
    availableMembers.forEach((member, index) => {
      const columnIndex = index % 5;
      columns[columnIndex].push(member);
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
              className={`${styles.sizeButton} ${raidSize === 10 ? styles.active : ''}`}
              onClick={() => setRaidSize(10)}
            >
              10 Man
            </button>
            <button 
              className={`${styles.sizeButton} ${raidSize === 25 ? styles.active : ''}`}
              onClick={() => setRaidSize(25)}
            >
              25 Man
            </button>
          </div>
          <div className={styles.actions}>
            <button onClick={clearRaid} className={styles.actionButton}>
              Clear All
            </button>
            <button onClick={exportRaid} className={styles.actionButton}>
              Export
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
