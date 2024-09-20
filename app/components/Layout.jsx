import React from 'react';
import { AppProvider, Frame } from '@shopify/polaris';
import Sidebar from './Sidebar';
import '@shopify/polaris/build/esm/styles.css';

const Layout = ({ children }) => {
  return (
    <AppProvider>
      <Frame>
        <div style={styles.container}>
          <Sidebar />
          <main style={styles.mainContent}>
            {children}
          </main>
        </div>
      </Frame>
    </AppProvider>
  );
};

const styles = {
  container: {
    display: 'flex',
  },
  mainContent: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#fff',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
};

export default Layout;
