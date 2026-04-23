import React, { useState, useEffect } from 'react';
import { ShieldCheck, Crosshair, AlertTriangle, Users, CheckCircle, XCircle, BrainCircuit, RefreshCw, Map as MapIcon, Heart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import HotspotMap from '../../components/Map/HotspotMap';
import { formatCurrency } from '../../utils/formatCurrency';
import api from '../../utils/api';
import styles from './Dashboard.module.css';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({ total_users: 0, total_campaigns: 0, total_donations: 0, total_raised: 0 });
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [pendingAidRequests, setPendingAidRequests] = useState([]);
  const [fieldWorkers, setFieldWorkers] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [verificationReports, setVerificationReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetraining, setIsRetraining] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [statsRes, campaignsRes, donationsRes, hotspotsRes, workersRes, aidRes, reportRes, usersRes] = await Promise.all([
        api.get('/admin/insights/summary'),
        api.get('/admin/campaigns'),
        api.get('/admin/donations'),
        api.get('/admin/ml/hotspots'),
        api.get('/admin/field-workers'),
        api.get('/admin/aid-requests'),
        api.get('/verifications/all'),
        api.get('/admin/users')
      ]);

      setStats(statsRes.data);
      setPendingCampaigns(campaignsRes.data.filter(c => c.status === 'pending'));
      setPendingAidRequests(aidRes.data.filter(r => r.status === 'pending'));
      setRecentDonations(donationsRes.data.slice(-5).reverse());
      setHotspots(hotspotsRes.data);
      setFieldWorkers(workersRes.data);
      setVerificationReports(reportRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyUser = async (userId, verified) => {
    try {
      await api.put(`/admin/users/${userId}/verify?verified=${verified}`);
      await fetchAdminData();
      alert(`User ${verified ? 'verified' : 'unverified'} successfully`);
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCampaignStatus = async (id, status) => {
    try {
      await api.put(`/admin/campaigns/${id}/status?status=${status}`);
      await fetchAdminData(); // Refresh everything
    } catch (err) {
      alert('Failed to update campaign status');
    }
  };

  const handleAidRequestStatus = async (id, status) => {
    try {
      await api.put(`/admin/aid-requests/${id}/status?status=${status}`);
      await fetchAdminData(); // Refresh everything
    } catch (err) {
      alert('Failed to update aid request');
    }
  };

  const handleAssign = async (campaignId, workerId) => {
    if (!workerId) return;
    try {
      await api.put(`/admin/campaigns/${campaignId}/assign/${workerId}`);
      await fetchAdminData(); // Show assigned worker state
      alert('Field worker assigned successfully!');
    } catch (err) {
      alert('Assignment failed');
    }
  };

  const handleRetrain = async () => {
    setIsRetraining(true);
    try {
      await api.post('/admin/ml/retrain');
      const hotspotsRes = await api.get('/admin/ml/hotspots');
      setHotspots(hotspotsRes.data);
      alert('Model retrained successfully!');
    } catch (err) {
      alert('Retraining failed');
    } finally {
      setIsRetraining(false);
    }
  };

  if (isLoading) return <div className="loading-spinner">Loading Admin Dashboard...</div>;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>System Administration</h1>
        <p className={styles.subtitle}>Platform oversight and verification control.</p>
      </header>

      {/* Stats KPI */}
      <div className={styles.statsGrid} style={{gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px'}}>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIconWrapper} style={{background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)'}}>
            <ShieldCheck size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Raised</p>
            <h3 className={styles.statValue}>{formatCurrency(stats.total_raised)}</h3>
          </div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIconWrapper} style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)'}}>
            <Crosshair size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Active Projects</p>
            <h3 className={styles.statValue}>{stats.total_campaigns}</h3>
          </div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIconWrapper} style={{background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent)'}}>
            <Users size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Verified Users</p>
            <h3 className={styles.statValue}>{stats.total_users}</h3>
          </div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIconWrapper} style={{background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary)'}}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Transactions</p>
            <h3 className={styles.statValue}>{stats.total_donations}</h3>
          </div>
        </div>
      </div>
      
      {/* AI Hotspot Analysis Section */}
      <div className={`glass-card ${styles.card}`} style={{marginBottom: '24px', padding: '32px'}}>
        <div className={styles.sectionHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h2 className={styles.sectionTitle} style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-primary)'}}>
              <BrainCircuit size={22} color="var(--primary)" /> AI High-Need Priority Map
            </h2>
            <p className={styles.sectionSubtitle} style={{color: 'var(--color-text-secondary)'}}>Predictive modeling identifying geographical zones needing immediate funding injection.</p>
          </div>
          <button 
            className={styles.btnApprove} 
            onClick={handleRetrain} 
            disabled={isRetraining}
            style={{padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem'}}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <RefreshCw size={16} className={isRetraining ? 'animate-spin' : ''} /> 
              {isRetraining ? 'Retraining...' : 'Run Analysis'}
            </div>
          </button>
        </div>

        <div className={styles.mlFlexContainer} style={{display: 'flex', gap: '32px', marginTop: '24px'}}>
          <div className={styles.chartWrapper} style={{flex: 1, height: '420px'}}>
             <HotspotMap hotspots={hotspots} />
          </div>
          
          <div className={styles.hotspotLegend} style={{width: '320px', display: 'flex', flexDirection: 'column', gap: '14px'}}>
             <h4 style={{fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px'}}>
               <MapIcon size={18} /> Impact Hotspots
             </h4>
             {hotspots.slice(0, 5).map((h, i) => (
                <div key={i} className={styles.hotspotItem} style={{padding: '16px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', borderLeft: `5px solid ${h.hotspot_score > 0.7 ? 'var(--error)' : 'var(--primary)'}`}}>
                  <p style={{fontSize: '0.875rem', fontWeight: 600, margin: 0, color: '#fff'}}>{h.title}</p>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '6px'}}>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{h.city}</span>
                    <span style={{fontSize: '0.75rem', fontWeight: 800, color: h.hotspot_score > 0.7 ? 'var(--error)' : 'var(--primary)'}}>
                        {Math.round(h.hotspot_score * 100)}% PRIORITY
                    </span>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className={styles.mainGrid} style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px'}}>
        {/* Left Column - Approval Queue */}
        <div className={styles.leftColumn}>
          <div className={`glass-card ${styles.card}`} style={{padding: '32px'}}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle} style={{color: 'var(--color-text-primary)'}}>Campaign Verification Queue</h2>
              <p className={styles.sectionSubtitle} style={{color: 'var(--color-text-secondary)'}}>Assign field workers to verify reality and approve for listing.</p>
            </div>
            
            <div className={styles.tableContainer} style={{marginTop: '24px'}}>
              <table className={styles.table} style={{width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px'}}>
                <thead>
                  <tr style={{textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem'}}>
                    <th style={{padding: '12px'}}>CAMPAIGN</th>
                    <th>GOAL</th>
                    <th>STATUS / VERIFIER</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingCampaigns.map(req => {
                    const assignedWorker = fieldWorkers.find(w => w.id === req.field_worker_id);
                    return (
                    <tr key={req.id} style={{background: 'rgba(255,255,255,0.02)', borderRadius: '12px'}}>
                      <td style={{padding: '16px', borderRadius: '12px 0 0 12px'}}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <strong style={{color: 'var(--text-main)', fontSize: '0.95rem'}}>{req.title}</strong>
                            <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>ID: {req.id} • {req.category}</span>
                        </div>
                      </td>
                      <td>{formatCurrency(req.goal_amount)}</td>
                      <td>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                          <select 
                              style={{padding: '6px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.8rem'}}
                              onChange={(e) => handleAssign(req.id, e.target.value)}
                              value={req.field_worker_id || ""}
                          >
                              <option value="" disabled>Assign Field Worker</option>
                              {fieldWorkers.map(w => (
                                  <option key={w.id} value={w.id}>{w.name}</option>
                              ))}
                          </select>
                          {assignedWorker && <span style={{fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600}}>✓ Assigned: {assignedWorker.name}</span>}
                        </div>
                      </td>
                      <td style={{borderRadius: '0 12px 12px 0'}}>
                        <div className={styles.actionButtons} style={{display: 'flex', gap: '10px'}}>
                          <button 
                            className="btn-success"
                            onClick={() => handleCampaignStatus(req.id, 'active')}
                          >
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
                  {pendingCampaigns.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{padding: '24px', textAlign: 'center', color: 'var(--text-muted)'}}>No campaigns pending.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Aid Requests Section */}
            <div className={styles.sectionHeader} style={{marginTop: '40px'}}>
              <h2 className={styles.sectionTitle} style={{color: 'var(--text-main)'}}>Direct Assistance Requests</h2>
              <p className={styles.sectionSubtitle}>Personalized aid requests from beneficiaries.</p>
            </div>
            
            <div className={styles.tableContainer} style={{marginTop: '20px'}}>
              <table className={styles.table} style={{width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px'}}>
                <thead>
                  <tr style={{textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem'}}>
                    <th style={{padding: '10px'}}>USER REQUEST</th>
                    <th>LOCATION</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAidRequests.map(req => (
                    <tr key={req.id} style={{background: 'rgba(30, 41, 59, 0.03)', borderRadius: '10px'}}>
                      <td style={{padding: '14px'}}>
                        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                          {req.image_url && <img src={req.image_url} alt="" style={{width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover'}} />}
                          <div>
                            <strong style={{color: 'var(--text-main)', fontSize: '0.9rem'}}>{req.title}</strong>
                            <p style={{fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0}}>{req.category}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{fontSize: '0.8rem', color: 'var(--text-main)'}}>{req.location}</td>
                      <td style={{padding: '14px', borderRadius: '0 10px 10px 0'}}>
                        <div style={{display: 'flex', gap: '8px'}}>
                           <button onClick={() => handleAidRequestStatus(req.id, 'verified')} className="btn-success" style={{fontSize: '0.75rem'}}>Verify</button>
                           <button onClick={() => handleAidRequestStatus(req.id, 'rejected')} className="btn-danger" style={{fontSize: '0.75rem'}}>Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingAidRequests.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{padding: '20px', textAlign: 'center', color: 'var(--text-muted)'}}>No new aid requests.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Activity */}
        <div className={styles.rightColumn}>
          <div className={`glass-card ${styles.card}`} style={{padding: '32px'}}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle} style={{color: '#fff'}}>Real-Time Transactions</h2>
              <p className={styles.sectionSubtitle}>Monitoring global capital flow into verified causes.</p>
            </div>
            
            <div className={styles.historyList} style={{marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
              {recentDonations.map((don, idx) => (
                <div key={idx} className={styles.historyItem} style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '16px'}}>
                  <div className={styles.historyIcon} style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '10px', borderRadius: '12px'}}>
                    <Heart size={20} />
                  </div>
                  <div className={styles.historyContent} style={{flex: 1}}>
                    <p style={{fontSize: '0.9rem', fontWeight: 700, color: '#fff'}}>Contribution #{don.id}</p>
                    <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{new Date(don.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className={styles.historyAmountWrapper} style={{textAlign: 'right'}}>
                    <span style={{fontSize: '1rem', fontWeight: 800, color: 'var(--success)'}}>{formatCurrency(don.amount)}</span>
                  </div>
                </div>
              ))}
              {recentDonations.length === 0 && (
                <p className={styles.emptyState} style={{padding: '40px', textAlign: 'center', color: 'var(--text-muted)'}}>No donations recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* User Registry Section */}
      <div className={`glass-card ${styles.card}`} style={{marginTop: 'var(--space-5)'}}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>User Management Registry</h2>
          <p className={styles.sectionSubtitle}>Oversee all platform participants and verify identities.</p>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Verification</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{fontWeight: 700}}>{u.name}</td>
                  <td><span className={styles.statusBadge}>{u.role.toUpperCase()}</span></td>
                  <td>{u.email}</td>
                  <td>
                    {u.verified ? 
                      <span style={{color: '#10b981', fontWeight: 800}}>● VERIFIED</span> : 
                      <span style={{color: '#ef4444', fontWeight: 800}}>○ UNVERIFIED</span>
                    }
                  </td>
                  <td>
                    <button 
                      onClick={() => handleVerifyUser(u.id, !u.verified)}
                      className={u.verified ? 'btn-secondary' : 'btn-primary'}
                      style={{padding: '4px 12px', fontSize: '0.75rem'}}
                    >
                      {u.verified ? 'Revoke' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Field Worker Verification Reports Section */}
      <div className={`glass-card ${styles.card}`} style={{marginTop: 'var(--space-5)'}}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
             Field Worker Verification Reports
          </h2>
          <p className={styles.sectionSubtitle}>Detailed on-ground findings from the field</p>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Field Worker</th>
                <th>Report Status</th>
                <th>Findings</th>
                <th>Evidence</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {verificationReports.length > 0 ? verificationReports.map(report => (
                <tr key={report.id}>
                  <td style={{fontWeight: 700}}>CMP-{report.campaign_id}</td>
                  <td>Worker #{report.field_worker_id}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${report.status === 'verified' ? styles.badgeSuccess : report.status === 'flagged' ? styles.badgeWarning : styles.badgeDanger}`}>
                      {report.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{maxWidth: '300px', fontSize: '0.875rem'}}>{report.findings}</td>
                  <td>
                    {report.image_url ? (
                      <a href={report.image_url} target="_blank" rel="noreferrer" style={{color: 'var(--color-primary)', fontWeight: 600}}>View Proof</a>
                    ) : 'No Image'}
                  </td>
                  <td>{new Date(report.created_at).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: 'var(--space-6)'}}>No verification reports submitted yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
