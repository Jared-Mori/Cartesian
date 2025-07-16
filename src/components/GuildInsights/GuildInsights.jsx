import React from 'react';
import styles from './GuildInsights.module.css';

function GuildInsights({ guildStats, events }) {
  // Helper function to calculate meaningful metrics
  const calculateInsights = () => {
    if (!guildStats) {
      return {
        totalMembers: 0,
        uniqueClasses: 0,
        upcomingEvents: 0,
        maxLevelPercentage: 0
      };
    }

    const totalMembers = guildStats.totalMembers || 0;
    const uniqueClasses = Object.keys(guildStats.classDistribution || {}).length;
    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;
    
    // Calculate max level percentage (players at level 70+ out of total)
    const levelDistribution = guildStats.levelDistribution || {};
    const maxLevelPlayers = Object.entries(levelDistribution)
      .filter(([range]) => {
        const startLevel = parseInt(range.split('-')[0]);
        return startLevel >= 70; // Assuming max level content is 70+
      })
      .reduce((sum, [, count]) => sum + count, 0);
    
    const maxLevelPercentage = totalMembers > 0 ? Math.round((maxLevelPlayers / totalMembers) * 100) : 0;

    return {
      totalMembers,
      uniqueClasses,
      upcomingEvents,
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
            {insights.upcomingEvents}
          </span>
          <span className={styles.insightLabel}>Upcoming Events</span>
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
