import React from 'react';
import { GUILD_CONFIG } from '../../utils/config';
import styles from './GuildTools.module.css';

function GuildTools({ events, guildStats, onRefresh }) {
  const exportGuildData = () => {
    const data = {
      events,
      exportDate: new Date().toISOString(),
      guild: GUILD_CONFIG.name,
      guildStats
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${GUILD_CONFIG.name.toLowerCase()}-guild-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendAnnouncement = () => {
    const message = prompt('Enter guild announcement:');
    if (message) {
      alert(`Announcement would be sent: "${message}"`);
      // In a real app, this would send to a backend API
    }
  };

  const copyEventsData = () => {
    const backup = localStorage.getItem('cartesian-guild-events');
    if (backup) {
      navigator.clipboard.writeText(backup);
      alert('Events data copied to clipboard!');
    } else {
      alert('No events data found to copy.');
    }
  };

  const importEventsData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            if (data.events && Array.isArray(data.events)) {
              localStorage.setItem('cartesian-guild-events', JSON.stringify(data.events));
              alert('Events data imported successfully!');
              window.location.reload(); // Reload to reflect changes
            } else {
              alert('Invalid file format. Please select a valid guild data export.');
            }
          } catch (err) {
            alert('Error reading file. Please ensure it\'s a valid JSON file.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all guild events? This cannot be undone.')) {
      localStorage.removeItem('cartesian-guild-events');
      alert('All events data has been cleared.');
      window.location.reload();
    }
  };

  return (
    <div className={styles.toolsGrid}>
      <div className={styles.toolCard}>
        <h3>Data Management</h3>
        <div className={styles.toolActions}>
          <button onClick={onRefresh} className={styles.toolButton}>
            🔄 Refresh Guild Data
          </button>
          <button onClick={exportGuildData} className={styles.toolButton}>
            📥 Export Guild Data
          </button>
          <button onClick={importEventsData} className={styles.toolButton}>
            📤 Import Events Data
          </button>
          <button onClick={clearAllData} className={`${styles.toolButton} ${styles.dangerButton}`}>
            🗑️ Clear All Data
          </button>
        </div>
      </div>

      <div className={styles.toolCard}>
        <h3>Quick Actions</h3>
        <div className={styles.toolActions}>
          <button onClick={sendAnnouncement} className={styles.toolButton}>
            📢 Send Announcement
          </button>
          <button onClick={copyEventsData} className={styles.toolButton}>
            📋 Copy Events Data
          </button>
          <button 
            onClick={() => {
              const url = `https://worldofwarcraft.blizzard.com/en-us/guild/${GUILD_CONFIG.region}/${GUILD_CONFIG.realm}/${GUILD_CONFIG.name}`;
              window.open(url, '_blank');
            }}
            className={styles.toolButton}
          >
            🌐 View on Battle.net
          </button>
          <button 
            onClick={() => {
              const memberNames = guildStats?.membersByRank ? 
                Object.keys(guildStats.membersByRank).join(', ') : 
                'No member data available';
              navigator.clipboard.writeText(memberNames);
              alert('Member list copied to clipboard!');
            }}
            className={styles.toolButton}
          >
            👥 Copy Member List
          </button>
        </div>
      </div>

      <div className={styles.toolCard}>
        <h3>Guild Statistics</h3>
        <div className={styles.quickStats}>
          <div className={styles.quickStat}>
            <span>Total Events:</span>
            <span>{events.length}</span>
          </div>
          <div className={styles.quickStat}>
            <span>Active Members:</span>
            <span>{guildStats?.totalMembers || 0}</span>
          </div>
          <div className={styles.quickStat}>
            <span>Unique Classes:</span>
            <span>{Object.keys(guildStats?.classDistribution || {}).length}</span>
          </div>
          <div className={styles.quickStat}>
            <span>Guild Ranks:</span>
            <span>{Object.keys(guildStats?.membersByRank || {}).length}</span>
          </div>
          <div className={styles.quickStat}>
            <span>Last Updated:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className={styles.toolCard}>
        <h3>Developer Tools</h3>
        <div className={styles.toolActions}>
          <button 
            onClick={() => {
              console.log('Guild Stats:', guildStats);
              console.log('Events:', events);
              alert('Data logged to console (F12 to view)');
            }}
            className={styles.toolButton}
          >
            🔍 Debug Data
          </button>
          <button 
            onClick={() => {
              const testEvent = {
                id: Date.now(),
                title: 'Test Event',
                date: new Date().toISOString().split('T')[0],
                time: '20:00',
                type: 'raid',
                description: 'This is a test event',
                attendees: ['TestPlayer1', 'TestPlayer2'],
                createdAt: new Date().toISOString()
              };
              const currentEvents = JSON.parse(localStorage.getItem('cartesian-guild-events') || '[]');
              localStorage.setItem('cartesian-guild-events', JSON.stringify([...currentEvents, testEvent]));
              alert('Test event created! Refresh to see it.');
            }}
            className={styles.toolButton}
          >
            🧪 Create Test Event
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuildTools;
