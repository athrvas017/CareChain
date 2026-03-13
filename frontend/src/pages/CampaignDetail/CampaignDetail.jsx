import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Target, Users, MapPin, Calendar, ExternalLink, Download } from 'lucide-react';
import CampaignProgressBar from '../../components/CampaignProgressBar/CampaignProgressBar';
import VerificationBadge from '../../components/VerificationBadge/VerificationBadge';
import { dummyCampaigns } from '../../utils/dummyData';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateProgress } from '../../utils/calculateProgress';
import styles from './CampaignDetail.module.css';

// Mock Milestone Component
const MilestoneTracker = ({ milestones }) => {
  return (
    <div className={styles.milestoneTracker}>
      {milestones.map((milestone, index) => (
        <div key={index} className={`${styles.milestone} ${milestone.completed ? styles.completed : ''}`}>
          <div className={styles.milestoneIndicator}>
            <div className={styles.milestoneDot}></div>
            {index < milestones.length - 1 && <div className={styles.milestoneLine}></div>}
          </div>
          <div className={styles.milestoneContent}>
            <h4>{milestone.title}</h4>
            <p>{milestone.description}</p>
            {milestone.completed && <span className={styles.milestoneDate}>Completed: {milestone.date}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

const CampaignDetail = () => {
  const { id } = useParams();
  const [donationAmount, setDonationAmount] = useState('');
  
  // Find campaign or use first one as fallback for demo
  const campaign = dummyCampaigns.find(c => c.id === parseInt(id)) || dummyCampaigns[0];
  const progress = calculateProgress(campaign.collectedAmount, campaign.targetAmount);

  // Mock data for detail view
  const milestones = [
    { title: "Campaign Launched", description: "Initial setup and verification completed.", completed: true, date: "12 Mar 2026" },
    { title: "25% Funding Reached", description: "First batch of supplies ordered.", completed: true, date: "15 Mar 2026" },
    { title: "50% Funding Reached", description: "Distribution to 500 families.", completed: false, date: "" },
    { title: "100% Target Met", description: "Final distribution and project closure report.", completed: false, date: "" }
  ];

  const verificationReports = [
    { id: 1, title: "Initial Site Assessment", date: "10 Mar 2026", auditor: "NGO Watchdog" },
    { id: 2, title: "First Fund Release Audit", date: "16 Mar 2026", auditor: "CareChain Validator #492" }
  ];

  const handleDonate = (e) => {
    e.preventDefault();
    alert(`Initiating smart contract for donation of ${formatCurrency(donationAmount)}`);
    setDonationAmount('');
  };

  return (
    <div className={`container ${styles.detailPage}`}>
      {/* Banner */}
      <div className={styles.bannerWrapper}>
        <img src={campaign.image} alt={campaign.title} className={styles.bannerImage} />
        <div className={styles.categoryTag}>{campaign.category}</div>
      </div>

      <div className={styles.contentGrid}>
        {/* Main Content (Left) */}
        <div className={styles.mainContent}>
          <div className={styles.headerInfo}>
            <div className={styles.titleWrapper}>
              <h1 className={styles.title}>{campaign.title}</h1>
              {campaign.isVerified && <VerificationBadge />}
            </div>
            
            <div className={styles.metaInfo}>
              <span className={styles.metaItem}><MapPin size={16} /> Global</span>
              <span className={styles.metaItem}><Calendar size={16} /> Created: Mar 2026</span>
            </div>
          </div>

          <div className={styles.section}>
            <h3>About the Campaign</h3>
            <p className={styles.descriptionText}>{campaign.description}</p>
            <p className={styles.descriptionText}>
              In this initiative, we aim to provide direct, verifiable aid to the affected communities. 
              Every contribution is locked in a smart contract and only released when specific, verified milestones are achieved.
            </p>
          </div>

          <div className={styles.section}>
            <h3>Funding Milestones</h3>
            <MilestoneTracker milestones={milestones} />
          </div>

          <div className={styles.section}>
            <h3>Blockchain Verification Reports</h3>
            <div className={styles.reportsList}>
              {verificationReports.map(report => (
                <div key={report.id} className={styles.reportCard}>
                  <div>
                    <h4>{report.title}</h4>
                    <span className={styles.reportMeta}>{report.date} | By: {report.auditor}</span>
                  </div>
                  <button className={styles.downloadBtn} aria-label="View Audit Report">
                    <ExternalLink size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Donation Form (Right) */}
        <div className={styles.sidebar}>
          <div className={`glass-card ${styles.donationWidget}`}>
            <div className={styles.fundingStatus}>
              <div className={styles.amountRaised}>
                {formatCurrency(campaign.collectedAmount)}
              </div>
              <div className={styles.amountTarget}>
                raised of <span>{formatCurrency(campaign.targetAmount)}</span> goal
              </div>
              
              <div className={styles.progressWrapper}>
                <CampaignProgressBar progress={progress} />
              </div>
              
              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <span>{progress}%</span> Funded
                </div>
                <div className={styles.stat}>
                  <Users size={14} className={styles.statIcon} />
                  {campaign.donorsCount} Donors
                </div>
              </div>
            </div>

            <form onSubmit={handleDonate} className={styles.donationForm}>
              <h4 className={styles.formTitle}>Make a verified donation</h4>
              
              <div className={styles.presetAmounts}>
                {[1000, 2500, 5000].map(amount => (
                  <button 
                    key={amount} 
                    type="button"
                    className={`${styles.presetBtn} ${donationAmount == amount ? styles.presetActive : ''}`}
                    onClick={() => setDonationAmount(amount)}
                  >
                    ₹{(amount/1000)}k
                  </button>
                ))}
              </div>
              
              <div className={styles.customAmount}>
                <span className={styles.currencySymbol}>₹</span>
                <input 
                  type="number" 
                  placeholder="Custom Amount" 
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className={styles.amountInput}
                  required
                  min="100"
                />
              </div>

              <button type="submit" className={`btn-primary ${styles.submitDonate}`}>
                Contribute Securely
              </button>
              
              <p className={styles.secureNote}>
                Your donation is secured by verified smart contracts. 100% transparency guaranteed.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
