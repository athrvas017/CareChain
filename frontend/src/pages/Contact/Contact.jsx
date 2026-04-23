import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, MapPin, Phone, Mail, MessageSquare, Send } from 'lucide-react';
import styles from './Contact.module.css';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! Your message has been received. We will get back to you within 24 hours.');
  };

  return (
    <div className={styles.contactPage}>
      {/* Header */}
      <div className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <MessageSquare size={16} />
            <span>Get In Touch</span>
          </div>
          <h1 className={styles.heroTitle}>We'd Love to Hear From You</h1>
          <p className={styles.heroSubtitle}>
            Have a question, want to partner with us, or need help with a campaign? We're here for you.
          </p>
        </div>
      </div>

      <div className={`container ${styles.contactContent}`}>
        {/* Contact Info Cards */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon} style={{ background: 'rgba(255,111,97,0.1)', color: 'var(--color-primary)' }}>
              <Mail size={24} />
            </div>
            <h3>Email Us</h3>
            <p>support@carechain.in</p>
            <p>partnerships@carechain.in</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon} style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)' }}>
              <Phone size={24} />
            </div>
            <h3>Call Us</h3>
            <p>+91 98765 43210</p>
            <p>Mon–Sat, 9am–6pm IST</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon} style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--color-warning)' }}>
              <MapPin size={24} />
            </div>
            <h3>Visit Us</h3>
            <p>VJTI Matunga</p>
            <p>Mumbai Maharashtra</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className={styles.formSection}>
          <div className={styles.formWrapper}>
            <h2 className={styles.formTitle}>Send Us a Message</h2>
            <p className={styles.formSubtitle}>We typically respond within 1 business day.</p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input type="text" required placeholder="Your full name" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email</label>
                  <input type="email" required placeholder="your@email.com" />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Subject</label>
                <input type="text" required placeholder="How can we help?" />
              </div>
              <div className={styles.inputGroup}>
                <label>Message</label>
                <textarea rows={5} required placeholder="Tell us more about your query..."></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>
                <Send size={18} /> Send Message
              </button>
            </form>
          </div>

          <div className={styles.sideInfo}>
            <div className={styles.faqCard}>
              <h3>Common Questions</h3>
              <ul>
                <li><Link to="/faq">How are donations tracked?</Link></li>
                <li><Link to="/faq">How do I start a campaign?</Link></li>
                <li><Link to="/faq">Who verifies beneficiaries?</Link></li>
                <li><Link to="/faq">Is my donation tax-deductible?</Link></li>
              </ul>
              <Link to="/faq" className={styles.faqLink}>View all FAQs →</Link>
            </div>

            <div className={styles.campaignPrompt}>
              <Heart size={32} fill="var(--color-primary)" color="var(--color-primary)" />
              <h3>Want to Make a Difference?</h3>
              <p>Browse active campaigns and donate today.</p>
              <Link to="/campaigns" className={styles.campaignBtn}>Explore Campaigns</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
