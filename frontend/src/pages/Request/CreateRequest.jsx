import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, FileText, MapPin, Tag, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';
import styles from './Request.module.css';

const CreateRequest = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Medical',
        location: '',
        image_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/aid-requests/', formData);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard/beneficiary'), 2000);
        } catch (error) {
            console.error('Request submission failed:', error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.successWrapper}>
                <div className={styles.successCard}>
                    <CheckCircle2 size={64} className={styles.successIcon} />
                    <h2>Request Submitted!</h2>
                    <p>Your request has been recorded and is waiting for verification.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formCard}>
                <div className={styles.header}>
                    <h1>Request Assistance</h1>
                    <p>Share your need with the community. Verified requests get priority.</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Request Title</label>
                        <input 
                            className={styles.formInput}
                            type="text" 
                            required 
                            placeholder="Brief title of your need"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Category</label>
                            <select 
                                className={styles.formInput}
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                                <option>Medical</option>
                                <option>Education</option>
                                <option>Disaster Relief</option>
                                <option>Food & Hunger</option>
                                <option>Small Business</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Location</label>
                            <input 
                                className={styles.formInput}
                                type="text" 
                                required 
                                placeholder="City, Region"
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Detailed Description</label>
                        <textarea 
                            className={styles.formInput}
                            required 
                            placeholder="Explain your situation in detail. Who needs help, and why is it urgent?"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Support Image URL</label>
                        <input 
                            className={styles.formInput}
                            type="url" 
                            placeholder="Link to a supportive image or document"
                            value={formData.image_url}
                            onChange={e => setFormData({...formData, image_url: e.target.value})}
                        />
                        <span className={styles.hint}>Recommended: Medical documents or site photos.</span>
                    </div>

                    <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '32px', height: '56px', fontSize: '1.1rem'}} disabled={loading}>
                        {loading ? <Loader2 className={styles.spin} /> : <><Send size={20} style={{marginRight: '12px'}} /> Submit Request</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateRequest;
