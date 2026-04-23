import React, { useState, useEffect } from 'react';
import { Camera, MapPin, CheckCircle, Clock, Upload, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import styles from './Dashboard.module.css';

const DashboardFieldWorker = () => {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/campaigns/assigned');
        setAssignedTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const completedTasks = [
    { id: "TSK-00", campaign: "Cancer Treatment Support", task: "Hospital Invoice Verification", date: "10 Mar 2026", status: "Approved" }
  ];

  if (loading) return <div className="loading-spinner">Loading tasks...</div>;

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
              {assignedTasks.length > 0 ? assignedTasks.map(task => (
                <div key={task.id} className={`glass-card ${styles.taskCard}`}>
                  <div className={styles.taskHeader}>
                    <span className={styles.taskId}>CMP-{task.id}</span>
                    <span className={`${styles.statusBadge} ${styles.badgeWarning}`}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className={styles.taskTitle}>{task.title}</h3>
                  <p className={styles.taskDesc}>{task.description.substring(0, 100)}...</p>
                  
                  <div className={styles.taskMeta}>
                    <div className={styles.metaItem}><MapPin size={14} /> Location: Verified by NGO</div>
                    <div className={styles.metaItem}><Clock size={14} /> Created: {new Date(task.created_at).toLocaleDateString()}</div>
                  </div>
                  
                  <div className={styles.taskActions}>
                    <Link to={`/verify/${task.id}`} className={`btn-primary ${styles.fullWidthBtn}`}>
                       Start Verification Report
                    </Link>
                  </div>
                </div>
              )) : (
                <div className={`glass-card ${styles.card}`}>
                   <p>No campaigns assigned for verification yet.</p>
                </div>
              )}
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
