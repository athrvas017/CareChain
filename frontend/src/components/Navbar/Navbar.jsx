import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Real auth state from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path ? styles.active : '';

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/campaigns', label: 'Campaigns' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/faq', label: 'FAQ' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link to="/" className={styles.logo}>
          <Heart className={styles.logoIcon} />
          <span className="primary-gradient-text">CareChain</span>
        </Link>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          {navLinks.map((l) => (
            <Link key={l.path} to={l.path} className={`${styles.navLink} ${isActive(l.path)}`}>
              {l.label}
            </Link>
          ))}

          <div className={styles.authButtons}>
            {isAuthenticated ? (
              <>
                <Link to={`/dashboard/${user?.role}`} className="btn-secondary">Dashboard</Link>
                <button onClick={handleLogout} className="btn-primary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">Login</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.mobileMenuBtn} onClick={toggleMenu}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileNavLinks}>
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`${styles.mobileNavLink} ${isActive(l.path)}`}
                onClick={toggleMenu}
              >
                {l.label}
              </Link>
            ))}

            <div className={styles.mobileAuthButtons}>
              {isAuthenticated ? (
                <>
                  <Link to={`/dashboard/${user?.role}`} className="btn-secondary" style={{ textAlign: 'center', marginBottom: '8px' }} onClick={toggleMenu}>Dashboard</Link>
                  <button onClick={handleLogout} className="btn-primary" style={{ width: '100%' }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary" style={{ textAlign: 'center', marginBottom: '8px' }} onClick={toggleMenu}>Login</Link>
                  <Link to="/register" className="btn-primary" style={{ textAlign: 'center' }} onClick={toggleMenu}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
