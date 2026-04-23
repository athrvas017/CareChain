import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
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

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // 🔐 Protected Route Logic
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || 'donor';

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Common links
  const commonLinks = [
    { path: `/dashboard/${role}`, label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: '/campaigns', label: 'Explore', icon: <Search size={20} /> },
    { path: '/profile', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const getNavLinks = () => {
    switch (role) {
      case 'admin':
        return [
          ...commonLinks,
          // Removed duplicate /dashboard/admin link
        ];
      case 'beneficiary':
        return [
          ...commonLinks,
          { path: '/request-aid', label: 'Request Aid', icon: <PlusCircle size={20} /> },
          { path: '/create-campaign', label: 'New Campaign', icon: <Briefcase size={20} /> },
        ];
      case 'field_worker':
        return [
          ...commonLinks,
          // Field worker dashboard already in commonLinks
        ];
      case 'donor':
      default:
        return [
          ...commonLinks,
          // Removed duplicate /dashboard/donor link
        ];
    }
  };

  if (!token || !user) return null;

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
          {getNavLinks().map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navItem} ${location.pathname === link.path ? styles.active : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
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
            <span className={styles.welcomeText}>Hello, {user.name}</span>
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
