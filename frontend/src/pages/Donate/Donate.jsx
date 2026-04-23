import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Heart, CreditCard, Smartphone, Building, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateProgress } from '../../utils/calculateProgress';
import styles from './Donate.module.css';
import api from '../../utils/api';

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];
const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: <Smartphone size={20} /> },
  { id: 'card', label: 'Card', icon: <CreditCard size={20} /> },
  { id: 'netbanking', label: 'Net Banking', icon: <Building size={20} /> },
];

const Donate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState(location.state?.initialAmount || 1000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [donated, setDonated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await api.get(`/campaigns/${id}`);
        setCampaign(response.data);
      } catch (err) {
        console.error('Error fetching campaign:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const finalAmount = customAmount ? parseInt(customAmount) : amount;

  const handleDonate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Mocking transaction ID for the demo, but connecting to real DB
      const transactionId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      await api.post('/donations/', {
        campaign_id: parseInt(id),
        amount: parseFloat(finalAmount),
        transaction_id: transactionId,
        category: campaign.category,
        city: 'Mumbai', // Mock location for demo
      });
      
      setDonated(true);
    } catch (err) {
      console.error('Donation failed:', err);
      alert('Failed to process donation. Please make sure you are logged in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="container">Loading campaign details...</div>;
  if (!campaign) return <div className="container">Campaign not found.</div>;

  const progress = calculateProgress(campaign.raised_amount, campaign.goal_amount);

  if (donated) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle size={56} />
          </div>
          <h1>Thank You! 🎉</h1>
          <p>Your donation of <strong>{formatCurrency(finalAmount)}</strong> to <strong>{campaign.title}</strong> has been received.</p>
          <p className={styles.successSub}>Your contribution is now being tracked on the blockchain for full transparency.</p>
          <div className={styles.successActions}>
            <Link to="/dashboard/donor" className="btn-primary">Go to Dashboard</Link>
            <Link to="/campaigns" className="btn-secondary">Browse More Campaigns</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.donatePage}`}>
      <div className={styles.donateGrid}>
        {/* Campaign Info */}
        <div className={styles.campaignPane}>
          <img src={campaign.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200'} alt={campaign.title} className={styles.campaignImage} />
          <div className={styles.campaignInfo}>
            <span className={styles.campaignCategory}>{campaign.category}</span>
            <h2 className={styles.campaignTitle}>{campaign.title}</h2>
            <div className={styles.progressRow}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
              </div>
              <div className={styles.progressStats}>
                <span className={styles.raised}>{formatCurrency(campaign.raised_amount)} raised</span>
                <span className={styles.target}>of {formatCurrency(campaign.goal_amount)}</span>
              </div>
            </div>
            <div className={styles.campaignMeta}>
               <span><Shield size={14} /> Verified Platform</span>
               <span><Heart size={14} /> Direct Impact</span>
            </div>
            <Link to={`/campaigns/${id}`} className={styles.backLink}>← Back to Story</Link>
          </div>
        </div>

        {/* Donation Form */}
        <div className={styles.formPane}>
          <h2 className={styles.formTitle}>Make a Donation</h2>
          <p className={styles.formSubtitle}>Your contribution creates a real, traceable impact.</p>

          <form onSubmit={handleDonate} className={styles.form}>
            <div className={styles.amountSection}>
              <label className={styles.sectionLabel}>Select Amount (₹)</label>
              <div className={styles.presetGrid}>
                {PRESET_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`${styles.presetBtn} ${amount === a && !customAmount ? styles.presetActive : ''}`}
                    onClick={() => { setAmount(a); setCustomAmount(''); }}
                  >
                    {formatCurrency(a)}
                  </button>
                ))}
              </div>
              <div className={styles.customAmount}>
                <span className={styles.rupeeSign}>₹</span>
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min="100"
                  className={styles.customInput}
                />
              </div>
            </div>

            <div className={styles.paymentSection}>
              <label className={styles.sectionLabel}>Payment Method</label>
              <div className={styles.paymentGrid}>
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`${styles.paymentBtn} ${paymentMethod === m.id ? styles.paymentActive : ''}`}
                    onClick={() => setPaymentMethod(m.id)}
                  >
                    {m.icon} {m.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className={styles.donateBtn} 
              disabled={isSubmitting || !finalAmount || finalAmount < 100}
            >
              {isSubmitting ? 'Processing...' : `Donate ${formatCurrency(finalAmount)}`} <ArrowRight size={18} />
            </button>

            <div className={styles.securityNote}>
              <Shield size={14} />
              <span>100% secure blockchain transaction guaranteed.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Donate;
