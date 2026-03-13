import React from 'react';
import styles from './CampaignProgressBar.module.css';

const CampaignProgressBar = ({ progress }) => {
  // Cap visual progress at 100%
  const validProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={styles.progressBarContainer}>
      <div 
        className={styles.progressBarFill} 
        style={{ width: `${validProgress}%` }}
      />
    </div>
  );
};

export default CampaignProgressBar;
