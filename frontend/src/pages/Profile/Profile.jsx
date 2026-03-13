import React from 'react';
import { User, Mail, Shield, CheckCircle } from 'lucide-react';
import styles from '../Dashboard/Dashboard.module.css';

const Profile = () => {
  return (
    <div className={styles.dashboard} style={{maxWidth: '600px'}}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your Profile</h1>
        <p className={styles.subtitle}>Manage your account and preferences.</p>
      </header>

      <div className={`glass-card ${styles.card}`}>
        <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-5)'}}>
          <div style={{width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
            <User size={40} />
          </div>
          <div>
            <h2 style={{margin: '0 0 4px 0', fontSize: '1.5rem'}}>Demo User</h2>
            <p style={{margin: 0, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px'}}>
              <Shield size={14} /> Global Donor
            </p>
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '0.875rem'}}>Full Name</label>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'var(--color-bg-light)', borderRadius: 'var(--radius-sm)'}}>
              <User size={18} color="var(--color-text-secondary)" />
              <span>Demo User</span>
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '0.875rem'}}>Email Address</label>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'var(--color-bg-light)', borderRadius: 'var(--radius-sm)'}}>
              <Mail size={18} color="var(--color-text-secondary)" />
              <span>demo@carechain.org</span>
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '0.875rem'}}>Verification Status</label>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: 'var(--radius-sm)', fontWeight: 600}}>
              <CheckCircle size={18} />
              <span>KYC Verified via Blockchain</span>
            </div>
          </div>

          <div style={{borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)'}}>
            <button className="btn-secondary">Change Password</button>
            <button className="btn-primary">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
