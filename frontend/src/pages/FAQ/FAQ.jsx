import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, HelpCircle, Heart } from 'lucide-react';
import styles from './FAQ.module.css';

const FAQS = [
  {
    category: 'Donations',
    items: [
      { q: 'How are my donations tracked?', a: 'Every donation is recorded in our secure audit system with a unique transaction ID. You can view the complete journey of your contribution — from receipt to disbursement — from your donor dashboard.' },
      { q: 'Is my donation tax-deductible?', a: 'Yes! CareChain is registered under Section 80G of the Income Tax Act. You will receive an auto-generated tax receipt within 24 hours of your donation.' },
      { q: 'What payment methods are accepted?', a: 'We accept UPI, Net Banking, Debit/Credit Cards (Visa, Mastercard, RuPay), and Wallets (Paytm, PhonePe, Google Pay).' },
      { q: 'Can I set up recurring donations?', a: 'Yes, you can set up monthly recurring donations to any active campaign from your donor dashboard.' },
    ]
  },
  {
    category: 'Campaigns',
    items: [
      { q: 'How do I start a campaign?', a: 'Register as an NGO/Field Worker, complete the verification process, and submit your campaign for admin approval. Once approved, it goes live within 24 hours.' },
      { q: 'How are campaigns verified?', a: 'Each campaign undergoes identity verification of the organizer, document review by our admin team, and a field visit for campaigns above ₹5 Lakh.' },
      { q: 'What are milestones?', a: 'Milestones are defined goals within a campaign (e.g., "25% completion — first batch of materials delivered"). Funds are released to beneficiaries only after a milestone is verified by a field worker.' },
      { q: 'What happens if a campaign doesn\'t reach its goal?', a: 'If a campaign\'s deadline passes without reaching its target, all collected funds are either transferred to the next campaign of the same organization (with donor consent) or fully refunded to donors.' },
    ]
  },
  {
    category: 'Accounts & Verification',
    items: [
      { q: 'Who verifies beneficiaries?', a: 'Beneficiaries are verified through a combination of document submission (Aadhar, income certificate), a field worker visit, and admin review. This ensures aid reaches only those who truly need it.' },
      { q: 'How long does NGO verification take?', a: 'NGO verification typically takes 3–5 business days after all documents are submitted. You will receive email updates at each step.' },
      { q: 'Is my personal data safe?', a: 'Yes. We use industry-standard encryption (AES-256) for all stored data. We never sell or share your personal data with third parties.' },
    ]
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.faqItem} ${open ? styles.faqItemOpen : ''}`}>
      <button className={styles.faqQuestion} onClick={() => setOpen(!open)}>
        <span>{q}</span>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {open && <div className={styles.faqAnswer}>{a}</div>}
    </div>
  );
};

const FAQ = () => {
  return (
    <div className={styles.faqPage}>
      <div className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <HelpCircle size={16} />
            <span>Help Center</span>
          </div>
          <h1>Frequently Asked Questions</h1>
          <p>Find quick answers to common questions about donations, campaigns, and accounts.</p>
          <Link to="/contact" className={styles.heroContactLink}>
            Can't find your answer? Contact us →
          </Link>
          <div className={styles.heroExtra}>
            <Link to="/campaigns" className="btn-primary" style={{ marginTop: '8px' }}>
              <Heart size={16} /> Browse Campaigns
            </Link>
          </div>
        </div>
      </div>

      <div className={`container ${styles.faqContent}`}>
        {FAQS.map((section) => (
          <div key={section.category} className={styles.faqSection}>
            <h2 className={styles.faqCategory}>{section.category}</h2>
            <div className={styles.faqList}>
              {section.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
