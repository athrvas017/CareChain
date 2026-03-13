import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Heart,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Clock,
  Briefcase,
  Search
} from 'lucide-react';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ role = 'donor' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Common links that appear for every role
  const commonLinks = [
    { path: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: '/campaigns', label: 'Campaigns', icon: <Search size={20} /> },
    { path: '/profile', label: 'Profile Settings', icon: <Settings size={20} /> },
  ];

  const getNavLinks = () => {
    switch (role) {
      case 'admin':
        return [
          ...commonLinks,
          { path: '/dashboard/campaigns', label: 'Manage Campaigns', icon: <Briefcase size={20} /> },
          { path: '/dashboard/verifications', label: 'Pending Verifications', icon: <Clock size={20} /> },
        ];
      case 'field_worker':
        return [
          ...commonLinks,
          { path: '/dashboard/tasks', label: 'My Tasks', icon: <Clock size={20} /> },
        ];
      case 'beneficiary':
        return [
          ...commonLinks,
        ];
      case 'donor':
      default:
        return [
          ...commonLinks,
          { path: '/dashboard/history', label: 'Donation History', icon: <Clock size={20} /> },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logo}>
            <Heart className={styles.logoIcon} />
            <span className="primary-gradient-text">CareChain</span>
          </Link>
          <button className={styles.closeBtn} onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navItem} ${location.pathname === link.path ? styles.active : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          {role === 'admin' && (
            <Link to="/create-campaign" className={`${styles.navItem} ${styles.createBtn}`}>
              <PlusCircle size={20} />
              <span>New Campaign</span>
            </Link>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to="/" className={styles.homeLink}>
            <Heart size={18} />
            <span>Back to Site</span>
          </Link>
          <button className={styles.logoutBtn}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainWrapper}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <div className={styles.topbarCenter}>
            <Link to="/campaigns" className={styles.campaignQuickLink}>
              <Search size={16} />
              Explore Campaigns
            </Link>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {role.charAt(0).toUpperCase()}
            </div>
            <span className={styles.userRole}>{role.replace('_', ' ').toUpperCase()}</span>
          </div>
        </header>

        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default DashboardLayout;
