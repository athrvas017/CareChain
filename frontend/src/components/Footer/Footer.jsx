import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContent}`}>
        <div className={styles.footerBrand}>
          <div className={styles.logo}>
            <Heart className={styles.logoIcon} />
            <span className="primary-gradient-text">CareChain</span>
          </div>
          <p className={styles.brandDescription}>
            Empowering transparent giving and verifiable impact. Together we can make a difference.
          </p>
        </div>

        <div className={styles.footerLinks}>
          <h4>Platform</h4>
          <Link to="/campaigns">Explore Campaigns</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/transparency">Transparency Policy</Link>
          <Link to="/register">Join as Ngo</Link>
        </div>

        <div className={styles.footerLinks}>
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>

        <div className={styles.footerSocial}>
          <h4>Connect With Us</h4>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook"><Facebook /></a>
            <a href="#" aria-label="Twitter"><Twitter /></a>
            <a href="#" aria-label="Instagram"><Instagram /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin /></a>
          </div>
          <div className={styles.contactEmail}>
            <Mail size={16} />
            <a href="mailto:hello@carechain.org">hello@carechain.org</a>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <div className="container">
          <p>&copy; {currentYear} CareChain. All rights reserved. Verified by Blockchain Technology.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
