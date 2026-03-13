import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Heart, CreditCard, Smartphone, Building, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { dummyCampaigns } from '../../utils/dummyData';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateProgress } from '../../utils/calculateProgress';
import styles from './Donate.module.css';

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];
const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: <Smartphone size={20} /> },
  { id: 'card', label: 'Card', icon: <CreditCard size={20} /> },
  { id: 'netbanking', label: 'Net Banking', icon: <Building size={20} /> },
];

const Donate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = dummyCampaigns.find((c) => c.id === parseInt(id)) || dummyCampaigns[0];
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [donated, setDonated] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount) : amount;
  const progress = calculateProgress(campaign.collectedAmount, campaign.targetAmount);

  const handleDonate = (e) => {
    e.preventDefault();
    setDonated(true);
    setTimeout(() => navigate('/dashboard/donor'), 2500);
  };

  if (donated) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle size={56} />
          </div>
          <h1>Thank You! 🎉</h1>
          <p>Your donation of <strong>{formatCurrency(finalAmount)}</strong> to <strong>{campaign.title}</strong> has been received.</p>
          <p className={styles.successSub}>A tax receipt will be sent to your registered email within 24 hours.</p>
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
          <img src={campaign.image} alt={campaign.title} className={styles.campaignImage} />
          <div className={styles.campaignInfo}>
            <span className={styles.campaignCategory}>{campaign.category}</span>
            <h2 className={styles.campaignTitle}>{campaign.title}</h2>
            <p className={styles.campaignDesc}>{campaign.description}</p>
            <div className={styles.progressRow}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
              </div>
              <div className={styles.progressStats}>
                <span className={styles.raised}>{formatCurrency(campaign.collectedAmount)} raised</span>
                <span className={styles.target}>of {formatCurrency(campaign.targetAmount)}</span>
              </div>
            </div>
            <div className={styles.campaignMeta}>
              <span><Heart size={14} /> {campaign.donorsCount} donors</span>
              <span><Shield size={14} /> {campaign.isVerified ? 'Verified Campaign' : 'Pending Verification'}</span>
            </div>
            <Link to="/campaigns" className={styles.backLink}>← Browse all campaigns</Link>
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
                  min="10"
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

            {paymentMethod === 'upi' && (
              <div className={styles.inputGroup}>
                <label>UPI ID</label>
                <input type="text" placeholder="yourname@upi" className={styles.inputField} />
              </div>
            )}

            {paymentMethod === 'card' && (
              <>
                <div className={styles.inputGroup}>
                  <label>Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" className={styles.inputField} maxLength={19} />
                </div>
                <div className={styles.cardRow}>
                  <div className={styles.inputGroup}>
                    <label>Expiry</label>
                    <input type="text" placeholder="MM/YY" className={styles.inputField} maxLength={5} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>CVV</label>
                    <input type="password" placeholder="•••" className={styles.inputField} maxLength={3} />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'netbanking' && (
              <div className={styles.inputGroup}>
                <label>Select Bank</label>
                <select className={styles.inputField}>
                  <option>SBI</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Bank</option>
                </select>
              </div>
            )}

            <div className={styles.summaryBox}>
              <div className={styles.summaryRow}>
                <span>Donation Amount</span>
                <span>{formatCurrency(finalAmount || 0)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Platform Fee</span>
                <span className={styles.free}>Free</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>{formatCurrency(finalAmount || 0)}</span>
              </div>
            </div>

            <button type="submit" className={styles.donateBtn} disabled={!finalAmount || finalAmount < 10}>
              Donate {finalAmount ? formatCurrency(finalAmount) : ''} <ArrowRight size={18} />
            </button>

            <div className={styles.securityNote}>
              <Shield size={14} />
              <span>100% secure. 80G tax receipt included.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Donate;
