import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import CampaignCard from '../../components/CampaignCard/CampaignCard';
import { dummyCampaigns } from '../../utils/dummyData';
import styles from './Campaigns.module.css';

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const categories = ['All', 'Disaster Relief', 'Medical', 'Education', 'Food & Hunger'];
  const statuses = ['All', 'Active', 'Completed'];

  const filteredCampaigns = dummyCampaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || campaign.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || campaign.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className={`container ${styles.campaignsPage}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Explore Campaigns</h1>
        <p className={styles.subtitle}>Discover and support verified causes that matter to you.</p>
      </div>

      <div className={styles.controlsSection}>
        <div className={`glass-card ${styles.searchBar}`}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search campaigns by name or description..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={`glass-card ${styles.filterPanel}`}>
          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>
              <Filter size={16} /> Category
            </div>
            <select 
              className={styles.filterSelect}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>
               Status
            </div>
            <select 
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
            </select>
          </div>
        </div>
      </div>

      {filteredCampaigns.length > 0 ? (
        <div className={styles.campaignGrid}>
          {filteredCampaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <h3>No campaigns found</h3>
          <p>Try adjusting your search or filters to find what you're looking for.</p>
          <button 
            className="btn-secondary" 
            onClick={() => { setSearchTerm(''); setCategoryFilter('All'); setStatusFilter('All'); }}
            style={{marginTop: '16px'}}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
