import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Users, ArrowRight } from 'lucide-react';
import HeroSection from '../../components/HeroSection/HeroSection';
import CampaignCard from '../../components/CampaignCard/CampaignCard';
import TestimonialCarousel from '../../components/TestimonialCarousel/TestimonialCarousel';
import ImpactGraph from '../../components/ImpactGraph/ImpactGraph';
import { platformStats } from '../../utils/dummyData';
import api from '../../utils/api';
import styles from './Home.module.css';

const Home = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/campaigns/');
        // Get first 3 campaigns as featured
        setFeaturedCampaigns(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className={styles.home}>
      <HeroSection />

      {/* Problem Statement Section */}
      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why CareChain?</h2>
          <p className={styles.sectionSubtitle}>
            Traditional charity platforms often lack transparency, leaving donors uncertain about their impact.
            CareChain builds a complete digital audit trail for every donation — from giver to beneficiary.
          </p>
        </div>
        
        <div className={styles.featuresGrid}>
          <div className={`glass-card ${styles.featureCard}`}>
            <div className={styles.featureIconWrapper}><ShieldCheck size={32} /></div>
            <h3 className={styles.featureTitle}>100% Transparent</h3>
            <p className={styles.featureDesc}>Every donation creates a verifiable record. You can track exactly where and how your funds are used in real time.</p>
          </div>
          
          <div className={styles.featureCard} style={{background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)'}}>
            <div className={styles.featureIconWrapper} style={{background: 'var(--color-success-light)', color: 'var(--color-success)'}}><Activity size={32} /></div>
            <h3 className={styles.featureTitle}>Milestone Based</h3>
            <p className={styles.featureDesc}>Funds are released only when specific, verified milestones are achieved by the beneficiary or NGO.</p>
          </div>
          
          <div className={`glass-card ${styles.featureCard}`}>
            <div className={styles.featureIconWrapper} style={{background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)'}}><Users size={32} /></div>
            <h3 className={styles.featureTitle}>Verified Network</h3>
            <p className={styles.featureDesc}>Strict onboarding and local field workers ensure that aid reaches only verified beneficiaries in real need.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How CareChain Works</h2>
            <p className={styles.sectionSubtitle}>A simple, secure, and verifiable process from donation to impact.</p>
          </div>
          
          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h4 className={styles.stepTitle}>Discover</h4>
              <p className={styles.stepDesc}>Browse verified campaigns that need your support.</p>
            </div>
            
            <div className={styles.stepConnector}></div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h4 className={styles.stepTitle}>Donate Securely</h4>
              <p className={styles.stepDesc}>Contribute funds through our secure, audited payment system.</p>
            </div>
            
            <div className={styles.stepConnector}></div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h4 className={styles.stepTitle}>Milestone Verification</h4>
              <p className={styles.stepDesc}>Field workers verify progress before funds are released.</p>
            </div>
            
            <div className={styles.stepConnector}></div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h4 className={styles.stepTitle}>Track Impact</h4>
              <p className={styles.stepDesc}>See the real-world change your contribution has made.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHeaderLine}>
          <h2 className={styles.sectionTitle}>Featured Campaigns</h2>
          <Link to="/campaigns" className={styles.viewAllBtn}>
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className={styles.campaignGrid}>
          {isLoading ? (
            <div className="loading-spinner">Loading featured campaigns...</div>
          ) : featuredCampaigns.length > 0 ? (
            featuredCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))
          ) : (
            <p>No campaigns available at the moment.</p>
          )}
        </div>
      </section>

      {/* Transparency & Statistics Section */}
      <section className={styles.statsSection}>
        <div className={`container ${styles.statsContainer}`}>
          <div className={styles.statsContent}>
            <h2 className={styles.sectionTitle} style={{color: 'white'}}>Live Platform Impact</h2>
            <p className={styles.sectionSubtitle} style={{color: 'rgba(255,255,255,0.8)'}}>
              Our numbers are updated in real-time. Join thousands of donors making a verifiable difference.
            </p>
            
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <div className={styles.statBoxValue}>₹{(platformStats.totalFundsRaised / 1000000).toFixed(1)}M</div>
                <div className={styles.statBoxLabel}>Total Funds Raised</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBoxValue}>{platformStats.activeCampaigns}</div>
                <div className={styles.statBoxLabel}>Active Campaigns</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBoxValue}>{(platformStats.beneficiariesHelped / 1000).toFixed(1)}k+</div>
                <div className={styles.statBoxLabel}>Beneficiaries Helped</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBoxValue}>{platformStats.verifiedReports}</div>
                <div className={styles.statBoxLabel}>Verified Reports</div>
              </div>
            </div>
          </div>
          
          <div className={styles.graphWrapper}>
            <ImpactGraph />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Voices of Trust</h2>
          <p className={styles.sectionSubtitle}>Hear from the people who use CareChain every day.</p>
        </div>
        <TestimonialCarousel />
      </section>

      {/* Final CTA */}
      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaContainer}`}>
          <h2 className={styles.ctaTitle}>Ready to Make a Verifiable Impact?</h2>
          <p className={styles.ctaSubtitle}>
            Join the movement towards 100% transparent philanthropy today.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/register" className="btn-primary" style={{padding: '16px 32px', fontSize: '1.125rem'}}>
              Start Donating
            </Link>
            <Link to="/request-aid" className="btn-secondary" style={{padding: '16px 32px', fontSize: '1.125rem'}}>
              Create a Campaign
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
