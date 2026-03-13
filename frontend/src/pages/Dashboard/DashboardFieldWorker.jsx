import React from 'react';
import { Camera, MapPin, CheckCircle, Clock, Upload } from 'lucide-react';
import styles from './Dashboard.module.css';

const DashboardFieldWorker = () => {
  const assignedTasks = [
    { id: "TSK-01", campaign: "Education for Rural Children", task: "Verify School Construction Milestone 1", location: "District A, State", deadline: "18 Mar 2026", status: "Pending" },
    { id: "TSK-02", campaign: "Flood Relief Assam", task: "Verify Distribution of 500 Food Packets", location: "Kamrup, Assam", deadline: "15 Mar 2026", status: "Needs Updates" }
  ];

  const completedTasks = [
    { id: "TSK-00", campaign: "Cancer Treatment Support", task: "Hospital Invoice Verification", date: "10 Mar 2026", status: "Approved" }
  ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Field Worker Portal</h1>
        <p className={styles.subtitle}>Complete verifications to release funds.</p>
      </header>

      <div className={styles.mainGrid}>
        {/* Left Column: Tasks */}
        <div className={styles.leftColumn}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Assigned Verifications</h2>
            </div>
            
            <div className={styles.taskList}>
              {assignedTasks.map(task => (
                <div key={task.id} className={`glass-card ${styles.taskCard}`}>
                  <div className={styles.taskHeader}>
                    <span className={styles.taskId}>{task.id}</span>
                    <span className={`${styles.statusBadge} ${task.status === 'Pending' ? styles.badgeWarning : styles.badgeDanger}`}>
                      {task.status}
                    </span>
                  </div>
                  <h3 className={styles.taskTitle}>{task.campaign}</h3>
                  <p className={styles.taskDesc}>{task.task}</p>
                  
                  <div className={styles.taskMeta}>
                    <div className={styles.metaItem}><MapPin size={14} /> {task.location}</div>
                    <div className={styles.metaItem}><Clock size={14} /> Due: {task.deadline}</div>
                  </div>
                  
                  <div className={styles.taskActions}>
                    <button className={`btn-primary ${styles.fullWidthBtn}`}>Start Verification Report</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upload Tool & History */}
        <div className={styles.rightColumn}>
          <div className={`glass-card ${styles.card} ${styles.uploadCard}`}>
            <h2 className={styles.sectionTitle}>Quick Upload Proof</h2>
            <div className={styles.uploadArea}>
              <Camera size={48} className={styles.uploadIcon} />
              <p>Take photo with GPS metadata</p>
              <button className="btn-secondary">Capture Image</button>
            </div>
            <div className={styles.locationIndicator}>
              <MapPin size={16} /> GPS: 26.1158° N, 91.7086° E (Verified)
            </div>
          </div>

          <div className={`glass-card ${styles.card}`}>
            <h2 className={styles.sectionTitle}>Completed Tasks</h2>
            <div className={styles.historyList}>
              {completedTasks.map(task => (
                <div key={task.id} className={styles.historyItem}>
                  <div className={styles.historyIcon} style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)'}}>
                    <CheckCircle size={16} />
                  </div>
                  <div className={styles.historyContent}>
                    <p className={styles.historyCampaign}>{task.campaign}</p>
                    <p className={styles.historyDate}>{task.task}</p>
                  </div>
                  <div className={styles.historyAmountWrapper}>
                    <span className={`${styles.statusBadge} ${styles.badgeSuccess}`}>{task.status}</span>
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

export default DashboardFieldWorker;
