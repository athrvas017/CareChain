import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, FileText, Camera, Send, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import styles from './Dashboard.module.css';

const VerificationForm = () => {
    const { campaignId } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        campaign_id: parseInt(campaignId),
        status: 'verified',
        findings: '',
        recommendation: '',
        image_url: ''
    });

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const res = await api.get(`/campaigns/${campaignId}`);
                setCampaign(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [campaignId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/verifications/', formData);
            alert('Verification report submitted successfully!');
            navigate('/dashboard/field_worker');
        } catch (err) {
            console.error(err);
            alert('Failed to submit report');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-spinner">Loading form...</div>;

    return (
        <div className={styles.dashboard}>
                <div className={`glass-card ${styles.formCard}`}>
                    <header className={styles.formHeader}>
                        <div style={{background: 'rgba(249, 115, 22, 0.1)', width: '88px', height: '88px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'}}>
                            <ShieldCheck size={44} color="var(--color-primary)" />
                        </div>
                        <h1 style={{fontSize: '2.5rem', marginBottom: '12px', letterSpacing: '-0.02em'}}>On-Ground Audit</h1>
                        <p style={{color: 'var(--color-text-secondary)', fontSize: '1.1rem'}}>
                            Project: <strong style={{color: 'var(--color-text-primary)'}}>{campaign?.title}</strong>
                        </p>
                    </header>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <ShieldCheck size={18} /> Audit Verdict
                            </label>
                            <select 
                                className={styles.formInput}
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="verified">✅ Verified (Project Authenticity Confirmed)</option>
                                <option value="flagged">⚠️ Flagged (Minor discrepancies - Review Required)</option>
                                <option value="rejected">❌ Rejected (Suspected fraud or mismatch)</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FileText size={18} /> Detailed Findings
                            </label>
                            <textarea 
                                className={styles.formInput}
                                required
                                placeholder="Describe beneficiary interviews, physical site checks, and document verification details..."
                                value={formData.findings}
                                onChange={e => setFormData({...formData, findings: e.target.value})}
                            ></textarea>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Recommendation</label>
                            <input 
                                className={styles.formInput}
                                type="text"
                                required
                                placeholder="E.g. Approved for Phase 1 funding release"
                                value={formData.recommendation}
                                onChange={e => setFormData({...formData, recommendation: e.target.value})}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <Camera size={18} /> Photographic Proof URL
                            </label>
                            <input 
                                className={styles.formInput}
                                type="url"
                                placeholder="Link to timestamped on-ground photo"
                                value={formData.image_url}
                                onChange={e => setFormData({...formData, image_url: e.target.value})}
                            />
                            <p style={{fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <AlertTriangle size={16} color="var(--color-primary)" /> 
                                Requirement: Ensure beneficiary or landmark is clearly visible.
                            </p>
                        </div>

                        <div style={{marginTop: '48px', display: 'flex', gap: '20px'}}>
                            <button 
                                type="submit" 
                                className="btn-primary" 
                                style={{flex: 2, height: '60px', fontSize: '1.15rem'}}
                                disabled={submitting}
                            >
                                {submitting ? <Loader2 className="animate-spin" /> : <><Send size={22} style={{marginRight: '12px'}} /> Submit Audit Report</>}
                            </button>
                            <button 
                                type="button" 
                                className="btn-secondary"
                                onClick={() => navigate(-1)}
                                style={{flex: 1, height: '60px'}}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    );
};

export default VerificationForm;
