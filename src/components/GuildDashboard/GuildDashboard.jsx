import { useState, useEffect } from 'react';
import { fetchCartesianGuildRoster, fetchCartesianGuildActivity, getGuildApiConfig, fetchCharacterProfile } from '../../utils/blizzardApi';
import { GUILD_CONFIG } from '../../utils/config';
import { CLASS_COLORS } from '../../utils/wowData';
import CharacterDisplay from '../CharacterDisplay/CharacterDisplay';
import GuildActivity from '../GuildActivity/GuildActivity';
import GuildInsights from '../GuildInsights/GuildInsights';
import GuildConsumables from '../GuildConsumables/GuildConsumables';
import RaidBuilder from '../RaidBuilder/RaidBuilder';
import styles from './GuildDashboard.module.css';

function GuildDashboard({ rosterData = [], loading: externalLoading = false, error: externalError = null, onRefresh }) {
  const [guildStats, setGuildStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (rosterData.length > 0) {
      calculateGuildStats(rosterData);
    } else {
      loadGuildStats();
    }
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

      // If this is simplified roster data (from App.jsx), 
      // we need to load full guild data
      if (roster.length > 0 && !roster[0].character) {
        // This is simplified data, fallback to loading full stats
        setGuildStats(stats);
        loadGuildStats();
        return;
      }

      // Process full roster data with character details
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

      setGuildStats(stats);
    } catch (err) {
      console.error('Error calculating guild stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

      
      const characterProfiles = await Promise.allSettled(
        roster.map(async (member) => {
          try {
            const profile = await fetchCharacterProfile(
              member.character.realm.slug, 
              member.character.name.toLowerCase(),
              getGuildApiConfig()
            );
            return {
              ...member,
              profile
            };
          } catch (error) {
            console.warn(`Failed to fetch profile for ${member.character.name}:`, error.message);
            return member; // Return original member data if profile fetch fails
          }
        })
      );

      // Process the results and calculate stats
      characterProfiles.forEach((result) => {
        if (result.status === 'fulfilled') {
          const member = result.value;
          const char = member.character;
          const profile = member.profile;
          const rank = member.rank;
          
          // Count by rank
          stats.membersByRank[rank] = (stats.membersByRank[rank] || 0) + 1;
          
          // Count by level (from profile if available)
          if (profile?.level) {
            const levelRange = Math.floor(profile.level / 10) * 10;
            const levelKey = `${levelRange}-${levelRange + 9}`;
            stats.levelDistribution[levelKey] = (stats.levelDistribution[levelKey] || 0) + 1;
          }
          
          // Count by class (from profile if available)
          if (profile?.character_class?.name) {
            const className = profile.character_class.name;
            stats.classDistribution[className] = (stats.classDistribution[className] || 0) + 1;
          }
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

  const renderOverviewTab = () => {
    // Get all WoW classes from the wowData utility
    const allClasses = Object.keys(CLASS_COLORS);

    const renderClassSlots = () => {
      return allClasses.map((className) => {
        const count = guildStats.classDistribution[className] || 0;
        const isEmpty = count === 0;
        const classColor = CLASS_COLORS[className] || '#6b7280';
        
        return (
          <div 
            key={className} 
            className={`${styles.classSlot} ${isEmpty ? styles.empty : styles.filled}`}
            style={{
              '--class-color': classColor,
              borderColor: isEmpty ? '#374151' : classColor,
              backgroundColor: isEmpty ? 'rgba(15, 15, 15, 0.6)' : `rgba(${parseInt(classColor.slice(1, 3), 16)}, ${parseInt(classColor.slice(3, 5), 16)}, ${parseInt(classColor.slice(5, 7), 16)}, 0.1)`
            }}
          >
            <div className={styles.className}>{className}</div>
            <div 
              className={styles.classCount}
              style={{
                color: isEmpty ? '#374151' : classColor
              }}
            >
              {isEmpty ? '--' : count}
            </div>
          </div>
        );
      });
    };

    return (
      <div className={styles.tabContent}>
        <div className={styles.overviewLayout}>
          {/* Guild Insights - Top Left */}
          <div className={styles.guildInsightsContainer}>
            <GuildInsights guildStats={guildStats} />
          </div>

          {/* Guild Activity - Top Right */}
          <div className={styles.activityPanel}>
            <GuildActivity 
              guildName={GUILD_CONFIG.name.toLowerCase()} 
              realm={GUILD_CONFIG.realm}
              apiConfig={getGuildApiConfig()}
            />
          </div>

          {/* Level Distribution - Bottom Left */}
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
          </div>

          {/* Class Distribution - Bottom Right */}
          <div className={`${styles.compactStatCard} ${styles.classDistributionCard}`}>
            <h3>Class Distribution</h3>
            <div className={styles.classSlots}>
              {renderClassSlots()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConsumablesTab = () => (
    <div className={styles.tabContent}>
      <GuildConsumables />
    </div>
  );

  const renderToolsTab = () => (
    <div className={styles.tabContent}>
      <RaidBuilder rosterData={rosterData} />
    </div>
  );

  return (
    <div className={styles.dashboard}>
      <div className={styles.guildHeader}>
        <h1>Cartesian</h1>
        <h2>{GUILD_CONFIG.realm} - {GUILD_CONFIG.region.toUpperCase()}</h2>
        {(externalLoading || loading) && <p className={styles.loadingMessage}>Loading...</p>}
        {(externalError || error) && <p className={styles.errorMessage}>Error: {externalError || error}</p>}
      </div>

      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'consumables' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('consumables')}
        >
          Consumables
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'tools' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          Raid Builder
        </button>
      </div>

      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'consumables' && renderConsumablesTab()}
      {activeTab === 'tools' && renderToolsTab()}
    </div>
  );
}

export default GuildDashboard;
