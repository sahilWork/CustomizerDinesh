import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Tabs } from '@shopify/polaris';
import ColourSettings from '../components/ColourSettings';
import DesignSettings from '../components/DesignSettings';
import LogoForm from './logo'; // Import your LogoForm component

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { id: 'colour', content: 'Colour' },
    { id: 'design', content: 'Design' },
    { id: 'logo', content: 'Logo' }, // Add a new tab for Logo
  ];

  const handleTabChange = (activeTabIndex) => setActiveTab(activeTabIndex);

  return (
    <Layout>
      <h1>Settings</h1>
      <Tabs
        tabs={tabs.map((tab, index) => ({
          id: tab.id,
          content: tab.content,
          panelID: tab.id,
          accessibilityLabel: `Tab ${tab.content}`,
          selected: activeTab === index,
        }))}
        selected={activeTab}
        onSelect={handleTabChange}
      >
        <div>
          {activeTab === 0 && <ColourSettings />}
          {activeTab === 1 && <DesignSettings />}
          {activeTab === 2 && <LogoForm />} {/* Render LogoForm for the new tab */}
        </div>
      </Tabs>
    </Layout>
  );
};

export default Settings;
