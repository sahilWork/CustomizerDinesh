// app/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav style={styles.sidebar}>
      <ul style={styles.menu}>
        <li><Link to="/app" style={styles.link}>Dashboard</Link></li>
        <li><Link to="/settings" style={styles.link}>Settings</Link></li>
        <li><Link to="/products" style={styles.link}>Products</Link></li>
      </ul>
    </nav>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    padding: '1rem',
    backgroundColor: '#f4f4f4',
    borderRight: '1px solid #ddd',
    height: '100vh',
    boxSizing: 'border-box',
  },
  menu: {
    listStyleType: 'none',
    padding: 0,
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    display: 'block',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background 0.3s',
  },
};

export default Sidebar;
