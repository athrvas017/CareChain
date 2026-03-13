import React from 'react';
import { ShieldCheck } from 'lucide-react';
import styles from './VerificationBadge.module.css';

const VerificationBadge = () => {
  return (
    <div className={styles.badge} title="Verified by CareChain Blockchain">
      <ShieldCheck size={14} className={styles.icon} />
      <span>Verified</span>
    </div>
  );
};

export default VerificationBadge;
