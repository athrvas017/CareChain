import React from 'react';
import { Clock, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import CampaignProgressBar from '../../components/CampaignProgressBar/CampaignProgressBar';
import { calculateProgress } from '../../utils/calculateProgress';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './Dashboard.module.css';

const DashboardBeneficiary = () => {
  const activeCampaign = {
    title: "Vocational Training Center",
    target: 500000,
    collected: 350000,
    status: "Active",
    milestones: [
      { name: "Campaign Approved", status: "completed", date: "01 Mar 2026" },
      { name: "25% Target", status: "completed", date: "10 Mar 2026" },
      { name: "50% Target", status: "completed", date: "15 Mar 2026" },
      { name: "75% Target", status: "pending", date: "Expected: 25 Mar 2026" },
      { name: "100% Target", status: "pending", date: "" },
    ]
  };

  const progress = calculateProgress(activeCampaign.collected, activeCampaign.target);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Beneficiary Dashboard</h1>
        <p className={styles.subtitle}>Track your campaign funding and milestones.</p>
      </header>

      <div className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <div className={`glass-card ${styles.card}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Active Campaign: {activeCampaign.title}</h2>
            </div>
            
            <div style={{marginBottom: 'var(--space-4)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <span className={styles.statValue} style={{fontSize: '2rem'}}>{formatCurrency(activeCampaign.collected)}</span>
                <span style={{color: 'var(--color-text-secondary)', alignSelf: 'flex-end'}}>Target: {formatCurrency(activeCampaign.target)}</span>
              </div>
              <CampaignProgressBar progress={progress} />
              <div style={{marginTop: '8px', textAlign: 'right', fontWeight: 600, color: 'var(--color-primary)'}}>
                {progress}% Funded
              </div>
            </div>

            <div className={styles.taskList}>
              <h3 style={{marginBottom: 'var(--space-2)'}}>Funding Milestones</h3>
              {activeCampaign.milestones.map((ms, idx) => (
                <div key={idx} className={styles.historyItem}>
                  <div className={styles.historyIcon} style={{
                    background: ms.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)', 
                    color: ms.status === 'completed' ? 'var(--color-success)' : 'var(--color-text-secondary)'
                  }}>
                    {ms.status === 'completed' ? <CheckCircle size={16} /> : <Clock size={16} />}
                  </div>
                  <div className={styles.historyContent}>
                    <p className={styles.historyCampaign} style={{color: ms.status === 'completed' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'}}>
                      {ms.name}
                    </p>
                    <p className={styles.historyDate}>{ms.date}</p>
                  </div>
                  <div className={styles.historyAmountWrapper}>
                    {ms.status === 'completed' ? (
                      <span className={`${styles.statusBadge} ${styles.badgeSuccess}`}>Completed</span>
                    ) : (
                      <span className={styles.statusBadge} style={{background: 'rgba(0,0,0,0.05)', color: 'var(--color-text-secondary)'}}>Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={`glass-card ${styles.card}`}>
            <h2 className={styles.sectionTitle}>Fund Withdrawals</h2>
            <div className={styles.historyList}>
              <div className={styles.historyItem}>
                <div className={styles.historyIcon} style={{background: 'rgba(255, 111, 97, 0.1)', color: 'var(--color-primary)'}}>
                  <DollarSign size={16} />
                </div>
                <div className={styles.historyContent}>
                  <p className={styles.historyCampaign}>Initial 25% Release</p>
                  <p className={styles.historyDate}>12 Mar 2026</p>
                </div>
                <div className={styles.historyAmountWrapper}>
                  <p className={styles.historyAmount} style={{color: 'var(--color-success)'}}>+{formatCurrency(125000)}</p>
                  <span className={`${styles.statusBadge} ${styles.badgeSuccess}`}>Transferred</span>
                </div>
              </div>
            </div>
            
            <div style={{marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.2)'}}>
              <h4 style={{color: 'var(--color-warning)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px'}}>
                <Clock size={16} /> Update Required
              </h4>
               <p style={{fontSize: '0.875rem', marginTop: '8px', color: 'var(--color-text-secondary)'}}>
                 Your 50% milestone has been reached. Please submit expenditure proofs to trigger the next smart contract release.
               </p>
               <button className="btn-secondary" style={{width: '100%', marginTop: '8px'}}>Upload Proofs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBeneficiary;
