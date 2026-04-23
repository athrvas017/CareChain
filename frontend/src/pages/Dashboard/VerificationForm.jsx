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
                <div className={`glass-card ${styles.card}`} style={{padding: '48px', borderTop: '8px solid var(--color-primary)'}}>
                    <header style={{marginBottom: '40px', textAlign: 'center'}}>
                        <div style={{background: 'rgba(249, 115, 22, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 24px'}}>
                            <ShieldCheck size={40} color="var(--color-primary)" />
                        </div>
                        <h1 style={{fontSize: '2.25rem', marginBottom: '8px', color: 'var(--color-text-primary)'}}>On-Ground Audit</h1>
                        <p style={{color: 'var(--color-text-secondary)', fontWeight: 500}}>Project Verification for: <span style={{color: 'var(--color-primary)'}}>{campaign?.title}</span></p>
                    </header>

                    <form onSubmit={handleSubmit} className={styles.form} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                        <div className="form-group">
                            <label className="form-label" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <ShieldCheck size={18} /> Verdict Status
                            </label>
                            <select 
                                className="form-input"
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value})}
                                style={{background: 'var(--color-bg-light)', border: '2px solid rgba(0,0,0,0.05)'}}
                            >
                                <option value="verified">✅ Fully Verified (Project Authenticity Confirmed)</option>
                                <option value="flagged">⚠️ Flagged (Minor discrepancies - Review Required)</option>
                                <option value="rejected">❌ Rejected (Suspected fraud or site mismatch)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <FileText size={18} /> On-Ground Findings
                            </label>
                            <textarea 
                                className="form-input"
                                rows="6"
                                required
                                placeholder="Describe beneficiary interviews, physical site checks, and document verification details..."
                                value={formData.findings}
                                onChange={e => setFormData({...formData, findings: e.target.value})}
                                style={{background: 'var(--color-bg-light)', border: '2px solid rgba(0,0,0,0.05)'}}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Key Recommendation</label>
                            <input 
                                className="form-input"
                                type="text"
                                required
                                placeholder="E.g. Approved for Phase 1 funding release"
                                value={formData.recommendation}
                                onChange={e => setFormData({...formData, recommendation: e.target.value})}
                                style={{background: 'var(--color-bg-light)', border: '2px solid rgba(0,0,0,0.05)'}}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Camera size={18} /> Photographic Evidence URL
                            </label>
                            <input 
                                className="form-input"
                                type="url"
                                placeholder="Link to timestamped on-ground photo"
                                value={formData.image_url}
                                onChange={e => setFormData({...formData, image_url: e.target.value})}
                                style={{background: 'var(--color-bg-light)', border: '2px solid rgba(0,0,0,0.05)'}}
                            />
                            <p style={{fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                                <AlertTriangle size={14} color="var(--color-primary)" /> Requirement: Ensure beneficiary or landmark is visible.
                            </p>
                        </div>

                        <div style={{marginTop: '40px', display: 'flex', gap: '16px'}}>
                            <button 
                                type="submit" 
                                className="btn-primary" 
                                style={{flex: 2, height: '56px', fontSize: '1.1rem'}}
                                disabled={submitting}
                            >
                                {submitting ? <Loader2 className="animate-spin" /> : <><Send size={20} style={{marginRight: '12px'}} /> Submit Formal Audit</>}
                            </button>
                            <button 
                                type="button" 
                                className="btn-secondary"
                                onClick={() => navigate(-1)}
                                style={{flex: 1, height: '56px'}}
                            >
                                Back
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    );
};

export default VerificationForm;
