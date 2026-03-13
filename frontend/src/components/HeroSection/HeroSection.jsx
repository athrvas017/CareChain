import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, TrendingUp, Users, Heart } from 'lucide-react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <ShieldCheck size={16} />
            <span>100% Verified Blockchain Transactions</span>
          </div>
          
          <h1 className={styles.title}>
            Transparent Giving.<br />
            <span className="primary-gradient-text">Verified Impact.</span>
          </h1>
          
          <p className={styles.subtitle}>
            Connect directly with verified beneficiaries and track every donation on the blockchain. 
            Experience a new era of trust and transparency in philanthropy.
          </p>
          
          <div className={styles.actions}>
            <Link to="/campaigns" className={`btn-primary ${styles.btnLarge}`}>
              Explore Campaigns
            </Link>
            <Link to="/how-it-works" className={`btn-secondary ${styles.btnLarge}`}>
              How It Works
            </Link>
          </div>
          
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statIcon}><TrendingUp size={20} /></div>
              <div>
                <div className={styles.statValue}>₹25M+</div>
                <div className={styles.statLabel}>Funds Raised</div>
              </div>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}><Users size={20} /></div>
              <div>
                <div className={styles.statValue}>12k+</div>
                <div className={styles.statLabel}>Beneficiaries</div>
              </div>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}><Heart size={20} /></div>
              <div>
                <div className={styles.statValue}>100%</div>
                <div className={styles.statLabel}>Transparency</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.imageWrapper}>
          <div className={styles.imageBackground}></div>
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1000" 
            alt="People helping people" 
            className={styles.heroImage}
          />
          <div className={`glass-card ${styles.floatingCard}`}>
            <div className={styles.floatingCardHeader}>
              <ShieldCheck size={16} className={styles.verifiedIcon} />
              <span>Milestone Reached</span>
            </div>
            <div className={styles.floatingCardContent}>
              <strong>Food Drive Campaign</strong>
              <p>Target achieved! 1000 meals distributed.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
