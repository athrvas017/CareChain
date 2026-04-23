import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import CampaignCard from '../../components/CampaignCard/CampaignCard';
import api from '../../utils/api';
import styles from './Campaigns.module.css';

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/campaigns/');
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const categories = ['All', 'Disaster Relief', 'Medical', 'Education', 'Food & Hunger'];
  const statuses = ['All', 'Active', 'Completed'];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || campaign.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || (
      (statusFilter === 'Active' && (campaign.status === 'active' || campaign.status === 'approved')) ||
      (statusFilter === 'Completed' && campaign.status === 'completed')
    );
    
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
