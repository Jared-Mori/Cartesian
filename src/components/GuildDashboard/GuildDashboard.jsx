import { useState, useEffect } from 'react';
import { fetchCartesianGuildRoster, fetchCartesianGuildActivity, getGuildApiConfig } from '../../utils/blizzardApi';
import { GUILD_CONFIG } from '../../utils/config';
import CharacterDisplay from '../CharacterDisplay/CharacterDisplay';
import GuildActivity from '../GuildActivity/GuildActivity';
import GuildInsights from '../GuildInsights/GuildInsights';
import GuildEvents from '../GuildEvents/GuildEvents';
import RaidBuilder from '../RaidBuilder/RaidBuilder';
import styles from './GuildDashboard.module.css';

function GuildDashboard({ rosterData = [], loading: externalLoading = false, error: externalError = null, onRefresh }) {
  const [guildStats, setGuildStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    if (rosterData.length > 0) {
      calculateGuildStats(rosterData);
    } else {
      loadGuildStats();
    }
    loadEvents();
  }, [rosterData]);

  const calculateGuildStats = (roster) => {
    setLoading(true);
    
    try {
      // Calculate stats from provided roster data
      const stats = {
        totalMembers: roster.length,
        membersByRank: {},
        levelDistribution: {},
        classDistribution: {}
      };

      // Since we don't have full character data in the simplified roster,
      // we'll just show member count for now
      setGuildStats(stats);
    } catch (err) {
      console.error('Error calculating guild stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = () => {
    // Load events from localStorage for now (in a real app, this would come from a backend)
    const savedEvents = localStorage.getItem('cartesian-guild-events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  };

  const handleEventsChange = (updatedEvents) => {
    setEvents(updatedEvents);
  };

  // Drag and drop handlers for roster reordering
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    // This would update the roster order in the parent component
    // For now, we'll just reset the drag state
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const loadGuildStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [roster, activity] = await Promise.all([
        fetchCartesianGuildRoster(),
        fetchCartesianGuildActivity().catch(() => null) // Activity might not be available
      ]);

      // Calculate some basic stats
      const stats = {
        totalMembers: roster.length,
        membersByRank: {},
        levelDistribution: {},
        classDistribution: {}
      };

      roster.forEach(member => {
        const char = member.character;
        const rank = member.rank;
        
        // Count by rank
        stats.membersByRank[rank] = (stats.membersByRank[rank] || 0) + 1;
        
        // Count by level (if available)
        if (char.level) {
          const levelRange = Math.floor(char.level / 10) * 10;
          const levelKey = `${levelRange}-${levelRange + 9}`;
          stats.levelDistribution[levelKey] = (stats.levelDistribution[levelKey] || 0) + 1;
        }
        
        // Count by class (if available)
        if (char.character_class?.name) {
          const className = char.character_class.name;
          stats.classDistribution[className] = (stats.classDistribution[className] || 0) + 1;
        }
      });

      setGuildStats({ ...stats, activity });
    } catch (err) {
      console.error('Error loading guild stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loadingContainer}>
          <h2>Loading Guild Dashboard...</h2>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.errorContainer}>
          <h2>Error loading guild data</h2>
          <p>{error}</p>
          <button onClick={loadGuildStats} className={styles.retryButton}>Retry</button>
        </div>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.overviewLayout}>
        <div className={styles.statsPanel}>
          {Object.keys(guildStats.levelDistribution).length > 0 && (
            <div className={styles.compactStatCard}>
              <h3>Level Distribution</h3>
              <div className={styles.compactStatList}>
                {Object.entries(guildStats.levelDistribution)
                  .sort(([a], [b]) => {
                    const aStart = parseInt(a.split('-')[0]);
                    const bStart = parseInt(b.split('-')[0]);
                    return bStart - aStart;
                  })
                  .map(([range, count]) => (
                    <div key={range} className={styles.compactStatItem}>
                      <span>Level {range}:</span>
                      <span>{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {Object.keys(guildStats.classDistribution).length > 0 && (
            <div className={styles.compactStatCard}>
              <h3>Classes</h3>
              <div className={styles.compactStatList}>
                {Object.entries(guildStats.classDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5) // Show only top 5 classes
                  .map(([className, count]) => (
                    <div key={className} className={styles.compactStatItem}>
                      <span>{className}:</span>
                      <span>{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <GuildInsights guildStats={guildStats} events={events} />
        </div>

        <div className={styles.activityPanel}>
          <GuildActivity 
            guildName={GUILD_CONFIG.name.toLowerCase()} 
            realm={GUILD_CONFIG.realm}
            apiConfig={getGuildApiConfig()}
          />
        </div>
      </div>
    </div>
  );

  const renderEventsTab = () => (
    <div className={styles.tabContent}>
      <GuildEvents events={events} onEventsChange={handleEventsChange} />
    </div>
  );

  const renderToolsTab = () => (
    <div className={styles.tabContent}>
      <RaidBuilder 
        guildStats={guildStats} 
        rosterData={rosterData}
      />
    </div>
  );

  return (
    <div className={styles.dashboard}>
      <div className={styles.guildHeader}>
        <h1>World of Warcraft Guild Viewer</h1>
        <h2>{GUILD_CONFIG.name} - {GUILD_CONFIG.realm} ({GUILD_CONFIG.region.toUpperCase()})</h2>
        {(externalLoading || loading) && <p className={styles.loadingMessage}>Loading...</p>}
        {(externalError || error) && <p className={styles.errorMessage}>Error: {externalError || error}</p>}
      </div>

      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'events' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('events')}
        >
          📅 Events
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'tools' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          ⚔️ Raid Builder
        </button>
      </div>

      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'events' && renderEventsTab()}
      {activeTab === 'tools' && renderToolsTab()}
    </div>
  );
}

export default GuildDashboard;
