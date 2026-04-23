import React, { useState, useEffect } from 'react';
import CampaignCard from '../../components/CampaignCard/CampaignCard';
import api from '../../utils/api';
import styles from './Campaigns.module.css';

const NewCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNew = async () => {
            try {
                const res = await api.get('/campaigns/');
                // Show 'pending' campaigns for the "New" page
                setCampaigns(res.data.filter(c => c.status === 'pending'));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNew();
    }, []);

    return (
        <div className={`container ${styles.campaignsPage}`}>
            <div className={styles.header}>
                <h1 className={styles.title} style={{color: 'var(--accent)'}}>New Opportunities</h1>
                <p className={styles.subtitle} style={{color: 'var(--text-main)'}}>
                    These campaigns are recently submitted and awaiting final verification. 
                    Be the first to show interest!
                </p>
            </div>

            {loading ? (
                <div style={{color: 'var(--primary)', textAlign: 'center', padding: '40px'}}>Scanning for new arrivals...</div>
            ) : (
                <div className={styles.campaignGrid}>
                    {campaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
                    {campaigns.length === 0 && <p style={{color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1/-1'}}>No new campaigns at the moment.</p>}
                </div>
            )}
        </div>
    );
};

export default NewCampaigns;
