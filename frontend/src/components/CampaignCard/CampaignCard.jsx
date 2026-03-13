import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target } from 'lucide-react';
import CampaignProgressBar from '../CampaignProgressBar/CampaignProgressBar';
import VerificationBadge from '../VerificationBadge/VerificationBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateProgress } from '../../utils/calculateProgress';
import styles from './CampaignCard.module.css';

const CampaignCard = ({ campaign }) => {
  const {
    id,
    title,
    category,
    targetAmount,
    collectedAmount,
    image,
    description,
    isVerified,
    donorsCount
  } = campaign;

  const progress = calculateProgress(collectedAmount, targetAmount);

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.image} />
        <div className={styles.categoryBadge}>{category}</div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {isVerified && <VerificationBadge />}
        </div>
        
        <p className={styles.description}>{description}</p>
        
        <div className={styles.stats}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Raised</span>
            <span className={styles.statValue}>{formatCurrency(collectedAmount)}</span>
          </div>
          
          <CampaignProgressBar progress={progress} />
          
          <div className={styles.statFooter}>
            <div className={styles.targetInfo}>
              <Target size={14} className={styles.icon} />
              <span>Target: {formatCurrency(targetAmount)}</span>
            </div>
            <div className={styles.donorInfo}>
              <Users size={14} className={styles.icon} />
              <span>{donorsCount} Donors</span>
            </div>
          </div>
        </div>
        
        <div className={styles.actions}>
          <Link to={`/campaigns/${id}`} className={`btn-primary ${styles.donateBtn}`}>
            Donate Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
