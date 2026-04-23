import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff, Lock, Mail, User, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import styles from './Auth.module.css';

import api from '../../utils/api';

const ROLES = [
  {
    id: 'donor',
    label: 'Donor',
    emoji: '💚',
    desc: 'Support campaigns you believe in',
  },
  {
    id: 'beneficiary',
    label: 'Beneficiary',
    emoji: '🤝',
    desc: 'Receive aid through verified campaigns',
  },
  {
    id: 'field_worker',
    label: 'NGO / Field Worker',
    emoji: '🌍',
    desc: 'Verify and manage on-ground relief',
  },
];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('donor');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    registration_id: '',
    id_reference: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: role,
        // Optional fields based on role
        registration_id: role === 'field_worker' ? formData.registration_id : null,
        id_reference: role === 'beneficiary' ? formData.id_reference : null
      });

      // After registration, redirect to login or auto-login
      // For now, let's redirect to login with a success message state
      alert('Registration successful! Please login.');
      setIsLoading(false);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authLayout}>
        {/* Left Side - Form */}
        <div className={styles.formSide}>
          <div className={styles.formWrapper}>
            <div className={styles.mobileBrand}>
              <Heart size={28} className={styles.brandIconMobile} fill="var(--color-primary)" />
              <span className="primary-gradient-text">CareChain</span>
            </div>

            <div className={styles.formHeader}>
              <h1 className={styles.formTitle}>Join CareChain</h1>
              <p className={styles.formSubtitle}>Create your free account and start making a difference.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Role Selection */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>I am joining as a...</label>
                <div className={styles.roleGrid}>
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`${styles.roleCard} ${role === r.id ? styles.roleCardActive : ''}`}
                      onClick={() => setRole(r.id)}
                    >
                      <span className={styles.roleEmoji}>{r.emoji}</span>
                      <span className={styles.roleLabel}>{r.label}</span>
                      <span className={styles.roleDesc}>{r.desc}</span>
                      {role === r.id && <CheckCircle size={16} className={styles.roleCheck} />}
                    </button>
                  ))}
                </div>
              </div>

                {error && <div className={styles.errorBanner}>{error}</div>}

                <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name {role === 'field_worker' ? '/ Organization Name' : ''}</label>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    placeholder={role === 'field_worker' ? 'WaterLife NGO' : 'John Doe'}
                    className={styles.input}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

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
                <label className={styles.label}>Password</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 8 characters"
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

              {/* Dynamic Field based on role */}
              {role === 'field_worker' && (
                <div className={styles.inputGroup}>
                  <label className={styles.label}>NGO Registration ID</label>
                  <div className={styles.inputWrapper}>
                    <Shield size={18} className={styles.inputIcon} />
                    <input
                      type="text"
                      required
                      placeholder="Ex: NGO-2026-X123"
                      className={styles.input}
                      value={formData.registration_id}
                      onChange={(e) => setFormData({ ...formData, registration_id: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {role === 'beneficiary' && (
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Aadhar or ID Reference (Optional)</label>
                  <div className={styles.inputWrapper}>
                    <User size={18} className={styles.inputIcon} />
                    <input
                      type="text"
                      placeholder="For faster verification"
                      className={styles.input}
                      value={formData.id_reference}
                      onChange={(e) => setFormData({ ...formData, id_reference: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`${styles.submitBtn} ${isLoading ? styles.submitBtnLoading : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className={styles.loadingDots}>Creating account<span>.</span><span>.</span><span>.</span></span>
                ) : (
                  <>Create Free Account <ArrowRight size={18} /></>
                )}
              </button>

              <p className={styles.termsText}>
                By registering, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </p>
            </form>

            <div className={styles.formFooter}>
              <p>Already have an account? <Link to="/login">Sign in here</Link></p>
            </div>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className={styles.illustrationSide}>
          <img
            src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1200"
            alt="Collaboration"
            className={styles.illustrationImage}
          />
          <div className={styles.overlay}></div>
          <div className={styles.illustrationContent}>
            <div className={styles.brandBadge}>
              <Shield size={20} fill="white" />
              <span>Verified Platform</span>
            </div>
            <h2 className={styles.illustrationTitle}>
              Transparent Aid, Verified Impact
            </h2>
            <p className={styles.illustrationText}>
              Every user on CareChain is verified. Every donation is tracked. Every rupee finds its true purpose.
            </p>
            <div className={styles.trustItems}>
              <div className={styles.trustItem}>
                <CheckCircle size={18} />
                <span>Identity verification for all roles</span>
              </div>
              <div className={styles.trustItem}>
                <CheckCircle size={18} />
                <span>Real-time donation tracking</span>
              </div>
              <div className={styles.trustItem}>
                <CheckCircle size={18} />
                <span>Milestone-based fund release</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
