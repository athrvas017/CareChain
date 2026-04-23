import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, TrendingUp, Heart } from 'lucide-react';
import ImpactGraph from '../../components/ImpactGraph/ImpactGraph';
import CampaignCard from '../../components/CampaignCard/CampaignCard';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './Dashboard.module.css';
import api from '../../utils/api';

const DashboardDonor = () => {
  const [recentDonations, setRecentDonations] = useState([]);
  const [recommendedCampaigns, setRecommendedCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationsRes, campaignsRes] = await Promise.all([
          api.get('/donations/me'),
          api.get('/campaigns/')
        ]);
        setRecentDonations(donationsRes.data);
        setRecommendedCampaigns(campaignsRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalDonated = recentDonations.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome back, {user.name || 'Donor'}!</h1>
        <p className={styles.subtitle}>Here is your verifiable impact at a glance.</p>
      </header>

      {/* Stats KPI */}
      <div className={styles.statsGrid}>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIconWrapper} style={{background: 'rgba(255, 111, 97, 0.1)', color: 'var(--color-primary)'}}>
            <Heart size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Donated</p>
            <h3 className={styles.statValue}>{formatCurrency(totalDonated)}</h3>
          </div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIconWrapper} style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)'}}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Campaigns Supported</p>
            <h3 className={styles.statValue}>{recentDonations.length}</h3>
          </div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIconWrapper} style={{background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)'}}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Impact Score</p>
            <h3 className={styles.statValue}>Top 15%</h3>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column: Graph & Recommended */}
        <div className={styles.leftColumn}>
          <div className={styles.section}>
             <ImpactGraph />
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recommended for You</h2>
              <a href="/campaigns" className={styles.viewAllLink}>View More</a>
            </div>
            <div className={styles.campaignList}>
               {recommendedCampaigns.map(campaign => (
                 <CampaignCard key={campaign.id} campaign={campaign} />
               ))}
            </div>
          </div>
        </div>

        {/* Right Column: History */}
        <div className={styles.rightColumn}>
          <div className={`glass-card ${styles.card}`}>
            <h2 className={styles.sectionTitle}>Recent Donations</h2>
            
            <div className={styles.historyList}>
              {recentDonations.length > 0 ? (
                recentDonations.map(donation => (
                  <div key={donation.id} className={styles.historyItem}>
                    <div className={styles.historyIcon}>
                      <Heart size={16} />
                    </div>
                    <div className={styles.historyContent}>
                      <p className={styles.historyCampaign}>{donation.campaign_title || `Campaign #${donation.campaign_id}`}</p>
                      <p className={styles.historyDate}>{new Date(donation.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className={styles.historyAmountWrapper}>
                      <p className={styles.historyAmount}>{formatCurrency(donation.amount)}</p>
                      <span className={styles.statusBadge}>Verified</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No donations yet.</p>
              )}
            </div>

            <button 
              className={`btn-secondary ${styles.fullWidthBtn}`}
              onClick={() => alert('Tax receipt generation in progress. You will be notified via email once ready.')}
            >
              <Download size={16} /> Download Tax Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDonor;
