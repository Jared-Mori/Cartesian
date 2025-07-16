import React from 'react';
import styles from './ActivityEvent.module.css';

export default function ActivityEvent({ activity }) {
  const ca = activity.character_achievement;
  const name = ca.character.name;
  const achievement = ca.achievement.name;
  const timestamp = new Date(activity.timestamp).toLocaleString();
  const isLevel = /^Level \d+$/.test(achievement);

  return (
    <div className={styles.activity}>
      <strong>
        {isLevel ? `🆙 ${name} reached ${achievement}` : `🏆 ${name} earned "${achievement}"`}
      </strong>
      <div className={styles.timestamp}>{timestamp}</div>
    </div>
  );
}
