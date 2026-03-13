import React from 'react';
import { ShieldCheck, Crosshair, AlertTriangle, Users, FileText } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './Dashboard.module.css';

const DashboardAdmin = () => {
  const pendingApprovals = [
    { id: "CMP-082", title: "Clean Water for Village", org: "WaterLife NGO", target: 800000, date: "13 Mar 2026" },
    { id: "CMP-083", title: "Medical Camp Setup", org: "Health First", target: 450000, date: "14 Mar 2026" },
  ];

  const recentVerifications = [
    { id: "VRF-421", campaign: "Flood Relief Assam", milestone: "25% Target Reached", status: "Approved", fieldWorker: "Rajesh S." },
    { id: "VRF-422", campaign: "Food Drive", milestone: "50% Target Reached", status: "Pending Review", fieldWorker: "Priya M." },
  ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>System Administration</h1>
        <p className={styles.subtitle}>Platform oversight and verification control.</p>
      </header>

      {/* Stats KPI */}
      <div className={styles.statsGrid} style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIconWrapper} style={{background: 'rgba(255, 111, 97, 0.1)', color: 'var(--color-primary)'}}>
            <ShieldCheck size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total TVL</p>
            <h3 className={styles.statValue}>{formatCurrency(25000000)}</h3>
          </div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIconWrapper} style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)'}}>
            <Crosshair size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Active Campaigns</p>
            <h3 className={styles.statValue}>42</h3>
          </div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIconWrapper} style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}>
            <FileText size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Pending Verifications</p>
            <h3 className={styles.statValue}>12</h3>
          </div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIconWrapper} style={{background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)'}}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Fraud Alerts</p>
            <h3 className={styles.statValue}>0</h3>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <div className={`glass-card ${styles.card}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Campaign Approval Queue</h2>
            </div>
            
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Campaign</th>
                    <th>Organization</th>
                    <th>Target Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApprovals.map(req => (
                    <tr key={req.id}>
                      <td className={styles.mutedText}>{req.id}</td>
                      <td><strong>{req.title}</strong></td>
                      <td>{req.org}</td>
                      <td>{formatCurrency(req.target)}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button className={styles.btnApprove}>Approve</button>
                          <button className={styles.btnReject}>Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingApprovals.length === 0 && (
                    <tr>
                      <td colSpan="5" className={styles.emptyState}>No campaigns pending approval.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div className={`glass-card ${styles.card}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Field Reports</h2>
            </div>
            
            <div className={styles.historyList}>
              {recentVerifications.map((ver, idx) => (
                <div key={idx} className={styles.historyItem}>
                  <div className={styles.historyIcon} style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}>
                    <FileText size={16} />
                  </div>
                  <div className={styles.historyContent}>
                    <p className={styles.historyCampaign}>{ver.campaign}</p>
                    <p className={styles.historyDate}>{ver.milestone}</p>
                    <p className={styles.historyDate} style={{marginTop: '2px'}}>By: {ver.fieldWorker}</p>
                  </div>
                  <div className={styles.historyAmountWrapper}>
                    <span className={`${styles.statusBadge} ${ver.status === 'Approved' ? styles.badgeSuccess : styles.badgeWarning}`}>
                      {ver.status}
                    </span>
                    <button className={styles.textBtn}>Review</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
