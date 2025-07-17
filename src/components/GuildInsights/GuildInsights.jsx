import React from 'react';
import styles from './GuildInsights.module.css';

function GuildInsights({ guildStats }) {
  // Helper function to calculate meaningful metrics
  const calculateInsights = () => {
    if (!guildStats) {
      return {
        totalMembers: 0,
        uniqueClasses: 0,
        activePlayers: 0,
        maxLevelPercentage: 0
      };
    }

    const totalMembers = guildStats.totalMembers || 0;
    
    // Calculate unique classes from class distribution
    const classDistribution = guildStats.classDistribution || {};
    const uniqueClasses = Object.keys(classDistribution).length;
    
    // Calculate active players (players with level data)
    const levelDistribution = guildStats.levelDistribution || {};
    const activePlayers = Object.values(levelDistribution).reduce((sum, count) => sum + count, 0);
    
    // Calculate max level percentage for WoW Classic (level 60+)
    let maxLevelPlayers = 0;
    let totalPlayersWithLevel = 0;
    
    Object.entries(levelDistribution).forEach(([range, count]) => {
      const startLevel = parseInt(range.split('-')[0]);
      totalPlayersWithLevel += count;
      
      // For WoW Classic, consider level 60+ as "max level"
      // For TBC, consider level 70+
      // For Wrath, consider level 80+
      if (startLevel >= 60) {
        maxLevelPlayers += count;
      }
    });
    
    const maxLevelPercentage = totalPlayersWithLevel > 0 
      ? Math.round((maxLevelPlayers / totalPlayersWithLevel) * 100) 
      : 0;

    return {
      totalMembers,
      uniqueClasses,
      activePlayers,
      maxLevelPercentage
    };
  };

  const insights = calculateInsights();

  return (
    <div className={styles.guildInsights}>
      <h3>Guild Insights</h3>
      <div className={styles.insightsGrid}>
        <div className={styles.insightItem}>
          <span className={styles.insightValue}>
            {insights.totalMembers}
          </span>
          <span className={styles.insightLabel}>Total Members</span>
        </div>
        <div className={styles.insightItem}>
          <span className={styles.insightValue}>
            {insights.uniqueClasses}
          </span>
          <span className={styles.insightLabel}>Unique Classes</span>
        </div>
        <div className={styles.insightItem}>
          <span className={styles.insightValue}>
            {insights.activePlayers}
          </span>
          <span className={styles.insightLabel}>Active Players</span>
        </div>
        <div className={styles.insightItem}>
          <span className={styles.insightValue}>
            {insights.maxLevelPercentage}%
          </span>
          <span className={styles.insightLabel}>Max Level</span>
        </div>
      </div>
    </div>
  );
}

export default GuildInsights;
