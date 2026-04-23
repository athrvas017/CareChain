import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Target, Users, MapPin, Calendar, ExternalLink, Download } from 'lucide-react';
import CampaignProgressBar from '../../components/CampaignProgressBar/CampaignProgressBar';
import VerificationBadge from '../../components/VerificationBadge/VerificationBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateProgress } from '../../utils/calculateProgress';
import styles from './CampaignDetail.module.css';
import api from '../../utils/api';

const milestones = [
  { title: 'Project Initiation', description: 'Setup and community outreach.', completed: true },
  { title: 'Resource Gathering', description: 'Securing necessary supplies and equipment.', completed: false },
  { title: 'Execution Phase 1', description: 'First round of aid distribution.', completed: false },
];

const verificationReports = [
  { id: 1, title: 'Initial Needs Assessment', date: '2024-03-10', auditor: 'CareChain Field Team' },
  { id: 2, title: 'Financial Pre-Audit', date: '2024-03-15', auditor: 'Blockchain Ledger' },
];

const MilestoneTracker = ({ milestones }) => {
  if (!milestones || milestones.length === 0) return <p>No milestones added yet.</p>;
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
            {milestone.completed && <span className={styles.milestoneDate}>Completed</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donationAmount, setDonationAmount] = useState('');
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await api.get(`/campaigns/${id}`);
        setCampaign(response.data);
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  if (isLoading) return <div className="container">Loading campaign details...</div>;
  if (!campaign) return <div className="container">Campaign not found.</div>;

  const progress = calculateProgress(campaign.raised_amount || 0, campaign.goal_amount || 1);

  const handleDonate = (e) => {
    e.preventDefault();
    if (!donationAmount || donationAmount < 100) {
      alert("Please enter a minimum donation of ₹100");
      return;
    }
    navigate(`/donate/${id}`, { state: { initialAmount: parseFloat(donationAmount) } });
  };

  return (
    <div className={`container ${styles.detailPage}`}>
      {/* Banner */}
      <div className={styles.bannerWrapper}>
        <img src={campaign.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200'} alt={campaign.title} className={styles.bannerImage} />
        <div className={styles.categoryTag}>{campaign.category}</div>
      </div>

      <div className={styles.contentGrid}>
        {/* Main Content (Left) */}
        <div className={styles.mainContent}>
          <div className={styles.headerInfo}>
            <div className={styles.titleWrapper}>
              <h1 className={styles.title}>{campaign.title}</h1>
              {(campaign.status === 'approved' || campaign.is_verified) && <VerificationBadge />}
            </div>
            
            <div className={styles.metaInfo}>
              <span className={styles.metaItem}><MapPin size={16} /> Global</span>
              <span className={styles.metaItem}><Calendar size={16} /> Created: {new Date().toLocaleDateString()}</span>
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
                {formatCurrency(campaign.raised_amount || 0)}
              </div>
              <div className={styles.amountTarget}>
                raised of <span>{formatCurrency(campaign.goal_amount || 0)}</span> goal
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
                  {campaign.donors_count || 0} Donors
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
