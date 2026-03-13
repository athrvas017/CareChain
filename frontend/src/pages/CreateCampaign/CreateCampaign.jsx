import React, { useState } from 'react';
import { Target, Upload, FileText } from 'lucide-react';
import styles from '../Dashboard/Dashboard.module.css';

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Medical',
    targetAmount: '',
    description: '',
    milestones: [{ title: '', target: '' }]
  });

  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...formData.milestones, { title: '', target: '' }]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Campaign proposal submitted for verification into the blockchain.");
  };

  return (
    <div className={styles.dashboard} style={{maxWidth: '800px'}}>
      <header className={styles.header}>
        <h1 className={styles.title}>Start a Campaign</h1>
        <p className={styles.subtitle}>Create a transparent, milestone-based funding request.</p>
      </header>

      <div className={`glass-card ${styles.card}`}>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontWeight: 600}}>Campaign Title</label>
            <input 
              type="text" 
              required 
              style={{padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)', width: '100%'}} 
              placeholder="E.g., Clean Water Initiative"
            />
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)'}}>
             <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <label style={{fontWeight: 600}}>Category</label>
              <select style={{padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)', width: '100%'}}>
                <option>Medical</option>
                <option>Education</option>
                <option>Disaster Relief</option>
                <option>Food & Hunger</option>
              </select>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <label style={{fontWeight: 600}}>Target Amount (₹)</label>
              <input 
                type="number" 
                required 
                style={{padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)', width: '100%'}} 
                placeholder="100000"
              />
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontWeight: 600}}>Campaign Story & Description</label>
            <textarea 
              rows="5"
              required
              style={{padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)', width: '100%', resize: 'vertical'}}
              placeholder="Explain why you are raising funds and how they will be used..."
            ></textarea>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
             <label style={{fontWeight: 600}}>Cover Image</label>
             <div className={styles.uploadArea}>
               <Upload color="var(--color-primary)" />
               <p>Click to browse or drag and drop</p>
             </div>
          </div>

          {/* Milestones */}
          <div style={{borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 'var(--space-4)'}}>
            <h3 style={{marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <Target size={20} color="var(--color-primary)" /> Funding Milestones
            </h3>
            <p style={{fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)'}}>
              Define specific goals. Funds are locked in smart contracts and released when field workers verify these milestones.
            </p>

            {formData.milestones.map((m, idx) => (
              <div key={idx} style={{display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)'}}>
                <input 
                  type="text" 
                  placeholder={`Milestone ${idx+1} Description`} 
                  style={{flex: 2, padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)'}} 
                  required
                />
                <input 
                  type="number" 
                  placeholder="% of Funds to Release" 
                  style={{flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)'}} 
                  required
                />
              </div>
            ))}
            
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={addMilestone}
              style={{marginTop: 'var(--space-2)'}}
            >
              + Add Milestone
            </button>
          </div>

          <button type="submit" className="btn-primary" style={{padding: '16px', fontSize: '1.125rem', marginTop: 'var(--space-2)'}}>
            Submit for Blockchain Verification
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
