import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import styles from './Auth.module.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login based on email content
    setTimeout(() => {
      let role = 'donor';
      if (formData.email.includes('admin')) role = 'admin';
      if (formData.email.includes('field')) role = 'field_worker';
      if (formData.email.includes('ben')) role = 'beneficiary';
      setIsLoading(false);
      navigate(`/dashboard/${role}`);
    }, 1000);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authLayout}>
        {/* Left Side - Illustration */}
        <div className={styles.illustrationSide}>
          <img
            src="https://images.unsplash.com/photo-1593113514676-1e6498be5b50?auto=format&fit=crop&q=80&w=1200"
            alt="Community care"
            className={styles.illustrationImage}
          />
          <div className={styles.overlay}></div>
          <div className={styles.illustrationContent}>
            <div className={styles.brandBadge}>
              <Heart size={20} fill="white" />
              <span>CareChain</span>
            </div>
            <h2 className={styles.illustrationTitle}>
              Making Every Rupee Count
            </h2>
            <p className={styles.illustrationText}>
              Join thousands of verified donors creating real, measurable impact across India.
            </p>
            <div className={styles.illustrationStats}>
              <div className={styles.illustrationStat}>
                <span className={styles.illustrationStatValue}>₹2.5 Cr+</span>
                <span className={styles.illustrationStatLabel}>Funds Raised</span>
              </div>
              <div className={styles.illustrationStatDivider}></div>
              <div className={styles.illustrationStat}>
                <span className={styles.illustrationStatValue}>12,500+</span>
                <span className={styles.illustrationStatLabel}>Lives Impacted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.formSide}>
          <div className={styles.formWrapper}>
            <div className={styles.mobileBrand}>
              <Heart size={28} className={styles.brandIconMobile} fill="var(--color-primary)" />
              <span className="primary-gradient-text">CareChain</span>
            </div>

            <div className={styles.formHeader}>
              <h1 className={styles.formTitle}>Welcome back</h1>
              <p className={styles.formSubtitle}>Sign in to continue your impact journey.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address</label>
                <div className={styles.inputWrapper}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className={styles.input}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>Password</label>
                  <a href="#" className={styles.forgotPasswordLink}>Forgot password?</a>
                </div>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className={styles.input}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`${styles.submitBtn} ${isLoading ? styles.submitBtnLoading : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className={styles.loadingDots}>Signing in<span>.</span><span>.</span><span>.</span></span>
                ) : (
                  <>Sign In <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <div className={styles.divider}>
              <span>or continue as</span>
            </div>

            <div className={styles.quickLoginGrid}>
              <button className={styles.quickLoginBtn} onClick={() => navigate('/dashboard/donor')}>
                <span className={styles.quickLoginIcon}>💚</span> Donor
              </button>
              <button className={styles.quickLoginBtn} onClick={() => navigate('/dashboard/admin')}>
                <span className={styles.quickLoginIcon}>🛡️</span> Admin
              </button>
              <button className={styles.quickLoginBtn} onClick={() => navigate('/dashboard/field_worker')}>
                <span className={styles.quickLoginIcon}>🌍</span> Field Worker
              </button>
              <button className={styles.quickLoginBtn} onClick={() => navigate('/dashboard/beneficiary')}>
                <span className={styles.quickLoginIcon}>🤝</span> Beneficiary
              </button>
            </div>

            <div className={styles.formFooter}>
              <p>Don't have an account? <Link to="/register">Create one free</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
