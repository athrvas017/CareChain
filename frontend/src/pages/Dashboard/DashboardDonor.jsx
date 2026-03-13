import React from 'react';
import { Download, Clock, CheckCircle, TrendingUp, Heart } from 'lucide-react';
import ImpactGraph from '../../components/ImpactGraph/ImpactGraph';
import CampaignCard from '../../components/CampaignCard/CampaignCard';
import { dummyCampaigns } from '../../utils/dummyData';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './Dashboard.module.css';

const DashboardDonor = () => {
  const recentDonations = [
    { id: 1, campaign: "Flood Relief Assam", amount: 5000, date: "12 Mar 2026", status: "Verified" },
    { id: 2, campaign: "Education for Rural Children", amount: 2500, date: "10 Mar 2026", status: "Verified" },
    { id: 3, campaign: "Food Drive for Homeless", amount: 1000, date: "05 Mar 2026", status: "Verified" },
  ];

  const recommendedCampaigns = dummyCampaigns.slice(1, 4);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome back, Donor!</h1>
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
            <h3 className={styles.statValue}>{formatCurrency(8500)}</h3>
          </div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIconWrapper} style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)'}}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Campaigns Supported</p>
            <h3 className={styles.statValue}>3</h3>
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
              {recentDonations.map(donation => (
                <div key={donation.id} className={styles.historyItem}>
                  <div className={styles.historyIcon}>
                    <Heart size={16} />
                  </div>
                  <div className={styles.historyContent}>
                    <p className={styles.historyCampaign}>{donation.campaign}</p>
                    <p className={styles.historyDate}>{donation.date}</p>
                  </div>
                  <div className={styles.historyAmountWrapper}>
                    <p className={styles.historyAmount}>{formatCurrency(donation.amount)}</p>
                    <span className={styles.statusBadge}>{donation.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className={`btn-secondary ${styles.fullWidthBtn}`}>
              <Download size={16} /> Download Tax Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDonor;
