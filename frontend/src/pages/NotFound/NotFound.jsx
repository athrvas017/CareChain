import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, Search } from 'lucide-react';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <div className={styles.heartIcon}>
          <Heart size={40} fill="var(--color-primary)" color="var(--color-primary)" />
        </div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.subtitle}>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Link to="/" className="btn-primary">
            <Home size={18} /> Back to Home
          </Link>
          <Link to="/campaigns" className="btn-secondary">
            <Search size={18} /> Browse Campaigns
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
