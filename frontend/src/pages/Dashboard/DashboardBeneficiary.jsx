import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, TrendingUp, DollarSign, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import CampaignProgressBar from '../../components/CampaignProgressBar/CampaignProgressBar';
import { calculateProgress } from '../../utils/calculateProgress';
import { formatCurrency } from '../../utils/formatCurrency';
import api from '../../utils/api';
import styles from './Dashboard.module.css';

const DashboardBeneficiary = () => {
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        // Backend needs an endpoint for /campaigns/me or similar
        // For now, let's assume get all campaigns and filter or add /me
        const response = await api.get('/campaigns/me');
        setMyCampaigns(response.data);
      } catch (err) {
        console.error('Error fetching beneficiary data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyData();
  }, [user.id]);

  if (isLoading) return <div className="loading-spinner">Loading Beneficiary Dashboard...</div>;

  const activeCampaign = myCampaigns[0]; // For demo, show first one in detail

  return (
    <div className={styles.dashboard}>
      <header className={styles.header} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1 className={styles.title}>Beneficiary Dashboard</h1>
          <p className={styles.subtitle}>Track your funding requests and impact.</p>
        </div>
        <Link to="/request-aid" className="btn-primary" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <PlusCircle size={20} /> Create New Request
        </Link>
      </header>

      {myCampaigns.length > 0 ? (
        <div className={styles.mainGrid}>
          <div className={styles.leftColumn}>
            {myCampaigns.map(camp => {
              const progress = calculateProgress(camp.raised_amount, camp.goal_amount);
              return (
                <div key={camp.id} className={`glass-card ${styles.card}`} style={{marginBottom: 'var(--space-4)'}}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{camp.title}</h2>
                    <span className={`${styles.statusBadge} ${camp.status === 'active' || camp.status === 'approved' ? styles.badgeSuccess : styles.badgeWarning}`}>
                      {camp.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={{marginBottom: 'var(--space-4)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span className={styles.statValue} style={{fontSize: '1.5rem'}}>{formatCurrency(camp.raised_amount)}</span>
                      <span style={{color: 'var(--color-text-secondary)', alignSelf: 'flex-end'}}>Target: {formatCurrency(camp.goal_amount)}</span>
                    </div>
                    <CampaignProgressBar progress={progress} />
                    <div style={{marginTop: '8px', textAlign: 'right', fontWeight: 600, color: 'var(--color-primary)'}}>
                      {progress}% Funded
                    </div>
                  </div>

                  <p className={styles.historyDate}>Created on: {new Date(camp.created_at).toLocaleDateString()}</p>
                </div>
              );
            })}
          </div>

          <div className={styles.rightColumn}>
            <div className={`glass-card ${styles.card}`}>
              <h2 className={styles.sectionTitle}>Required Verifications</h2>
              <div style={{marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.2)'}}>
                <h4 style={{color: 'var(--color-warning)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Clock size={16} /> Documents Pending
                </h4>
                <p style={{fontSize: '0.875rem', marginTop: '8px', color: 'var(--color-text-secondary)'}}>
                  Your latest campaign is in the 'pending' state. Please ensure you have uploaded all necessary identity and 80G documents.
                </p>
                <button 
              className="btn-secondary" 
              style={{width: '100%', marginTop: '8px'}}
              onClick={() => alert('Proof upload system is currently being migrated to secure storage. Please email documents to verify@carechain.com')}
            >
              Upload Proofs
            </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`glass-card ${styles.card}`} style={{textAlign: 'center', padding: 'var(--space-10)'}}>
            <h3>No campaigns found.</h3>
            <p>You haven't submitted any funding requests yet.</p>
            <Link to="/create-campaign" className="btn-primary" style={{marginTop: 'var(--space-4)', display: 'inline-block'}}>
              Start Your First Campaign
            </Link>
            <br />
            <Link to="/request-aid" className="btn-secondary" style={{marginTop: 'var(--space-2)', display: 'inline-block'}}>
              Request Personal Aid (Medical/Food)
            </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardBeneficiary;
