import React, { useEffect, useState } from 'react';
import { fetchGuildActivity } from '../../utils/apiClient';
import ActivityEvent from './ActivityEvent';
import styles from './GuildActivity.module.css';

export default function GuildActivity({ guildName, realm, apiConfig }) {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadActivity() {
      try {
        const data = await fetchGuildActivity(realm, guildName);
        if (data?.activities) {
          const sorted = [...data.activities].sort((a, b) => b.timestamp - a.timestamp);
          setActivities(sorted);
        }
      } catch (err) {
        setError('Failed to load guild activity');
      }
    }

    if (guildName && realm && apiConfig) {
      loadActivity();
    }
  }, [guildName, realm, apiConfig]);

  if (error) return <p className={styles.errorMessage}>{error}</p>;
  if (!activities.length) return <p className={styles.loadingMessage}>Loading guild activity...</p>;

  return (
    <div className={styles.guildActivity}>
      <h3 className={styles.sectionHeader}>Recent Guild Activity</h3>
      <ul className={styles.activityList}>
        {activities.map((entry, idx) => (
          <li key={idx}>
            <ActivityEvent activity={entry} />
          </li>
        ))}
      </ul>
    </div>
  );
}
