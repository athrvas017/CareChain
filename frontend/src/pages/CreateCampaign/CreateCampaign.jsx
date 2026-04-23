import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Upload, FileText, Plus } from 'lucide-react';
import api from '../../utils/api';
import styles from './CreateCampaign.module.css';

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Medical',
    goal_amount: '',
    description: '',
    milestones: [{ title: '', target: '' }]
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...formData.milestones, { title: '', target: '' }]
    });
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index][field] = value;
    setFormData({ ...formData, milestones: newMilestones });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/campaigns/', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        goal_amount: parseFloat(formData.goal_amount)
      });
      alert("Campaign proposal submitted successfully!");
      navigate('/dashboard/beneficiary');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please make sure you are logged in as a beneficiary.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Start a Campaign</h1>
        <p className={styles.subtitle}>Create a transparent, milestone-based funding request for your cause.</p>
      </header>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Campaign Title</label>
            <input 
              type="text" 
              required 
              className="form-input"
              placeholder="E.g., Clean Water Initiative"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className={styles.grid}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Medical</option>
                <option>Education</option>
                <option>Disaster Relief</option>
                <option>Food & Hunger</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Target Amount (₹)</label>
              <input 
                type="number" 
                required 
                className="form-input"
                placeholder="100000"
                value={formData.goal_amount}
                onChange={(e) => setFormData({ ...formData, goal_amount: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Campaign Story & Description</label>
            <textarea 
              rows="5"
              required
              className="form-input"
              placeholder="Explain why you are raising funds and how they will be used..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Cover Image</label>
            <div className={styles.uploadArea}>
              <Upload size={32} />
              <p>Click to browse or drag and drop</p>
              <span style={{fontSize: '0.75rem', opacity: 0.6}}>Max size: 5MB (JPG, PNG)</span>
            </div>
          </div>

          <div className={styles.milestoneSection}>
            <h3 className={styles.milestoneHeader}>
              <Target size={24} color="var(--color-primary)" /> Funding Milestones
            </h3>
            <p className={styles.milestoneDesc}>
              Define specific impact goals. Funds are locked and released when field workers verify these milestones on-ground.
            </p>

            {formData.milestones.map((m, idx) => (
              <div key={idx} className={styles.milestoneRow}>
                <input 
                  type="text" 
                  placeholder={`Milestone ${idx+1} Description (e.g. Purchase 100 filters)`} 
                  className="form-input"
                  style={{flex: 1}}
                  required
                  value={m.title}
                  onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="% Fund" 
                  className="form-input"
                  style={{width: '100px'}}
                  required
                  value={m.target}
                  onChange={(e) => handleMilestoneChange(idx, 'target', e.target.value)}
                />
              </div>
            ))}
            
            <button 
              type="button" 
              className="btn-secondary" 
              style={{padding: '8px 16px', fontSize: '0.875rem'}}
              onClick={addMilestone}
            >
              <Plus size={14} /> Add Milestone
            </button>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            style={{width: '100%', marginTop: '32px'}}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit for Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
