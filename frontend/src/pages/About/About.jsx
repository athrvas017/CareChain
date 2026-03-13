import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Target, Users, CheckCircle, Award, Globe, ArrowRight } from 'lucide-react';
import styles from './About.module.css';

const TEAM = [
  { name: 'Ananya Sharma', role: 'Founder & CEO', emoji: '👩‍💼', desc: 'Ex-NGO director with 10 years in social impact.' },
  { name: 'Rohan Verma', role: 'CTO', emoji: '👨‍💻', desc: 'Full-stack engineer passionate about civic tech.' },
  { name: 'Priya Iyer', role: 'Head of Operations', emoji: '👩‍🔬', desc: 'Logistics expert ensuring aid reaches the last mile.' },
  { name: 'Karan Mehta', role: 'Field Verification Lead', emoji: '🌍', desc: 'Coordinates our nationwide network of field workers.' },
];

const VALUES = [
  { icon: <CheckCircle size={28} />, title: 'Transparency', desc: 'Every rupee is tracked from donor to beneficiary, with public audit trails.' },
  { icon: <Target size={28} />, title: 'Accountability', desc: 'Campaigns are milestone-based — funds are released only after verified progress.' },
  { icon: <Users size={28} />, title: 'Community', desc: 'We unite donors, NGOs, and field workers in a single trusted ecosystem.' },
  { icon: <Globe size={28} />, title: 'Reach', desc: 'Our verified network spans 18 states, ensuring aid finds those who truly need it.' },
];

const About = () => {
  return (
    <div className={styles.aboutPage}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <Heart size={16} fill="var(--color-primary)" color="var(--color-primary)" />
            <span>Our Story</span>
          </div>
          <h1 className={styles.heroTitle}>Built on Trust, Powered by Purpose</h1>
          <p className={styles.heroSubtitle}>
            CareChain was born from a simple question — why can't donors know exactly where their money goes?
            We built the answer.
          </p>
          <div className={styles.heroActions}>
            <Link to="/campaigns" className="btn-primary">Explore Campaigns <ArrowRight size={16} /></Link>
            <Link to="/register" className="btn-secondary">Join Us</Link>
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className={`container ${styles.section}`}>
        <div className={styles.missionGrid}>
          <div className={styles.missionText}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p className={styles.sectionText}>
              CareChain exists to eliminate the trust gap in the Indian charitable sector. By creating a fully
              verified, milestone-based aid delivery platform, we ensure that every contribution — no matter
              how small — creates real, measurable impact.
            </p>
            <p className={styles.sectionText}>
              We partner with registered NGOs, independent field workers, and government bodies to verify
              beneficiary identities, track aid delivery, and publish transparent impact reports.
            </p>
          </div>
          <div className={styles.missionStats}>
            <div className={styles.missionStat}><span className={styles.statNum}>₹2.5Cr+</span><span>Funds Disbursed</span></div>
            <div className={styles.missionStat}><span className={styles.statNum}>12,500+</span><span>Lives Impacted</span></div>
            <div className={styles.missionStat}><span className={styles.statNum}>180+</span><span>Verified Reports</span></div>
            <div className={styles.missionStat}><span className={styles.statNum}>42</span><span>Active Campaigns</span></div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className="container">
          <h2 className={styles.sectionTitle} style={{ textAlign: 'center', marginBottom: '48px' }}>What We Stand For</h2>
          <div className={styles.valuesGrid}>
            {VALUES.map((v) => (
              <div key={v.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle} style={{ textAlign: 'center', marginBottom: '48px' }}>Meet the Team</h2>
        <div className={styles.teamGrid}>
          {TEAM.map((member) => (
            <div key={member.name} className={styles.teamCard}>
              <div className={styles.teamAvatar}>{member.emoji}</div>
              <h3 className={styles.teamName}>{member.name}</h3>
              <p className={styles.teamRole}>{member.role}</p>
              <p className={styles.teamDesc}>{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaContent}`}>
          <Award size={48} color="white" />
          <h2>Join the Transparent Giving Movement</h2>
          <p>Whether you're a donor, an NGO, or a beneficiary — CareChain has a place for you.</p>
          <div className={styles.ctaActions}>
            <Link to="/register" className="btn-primary" style={{ padding: '14px 32px' }}>Get Started Free</Link>
            <Link to="/campaigns" className="btn-secondary" style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}>Browse Campaigns</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
