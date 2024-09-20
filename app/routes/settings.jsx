import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Tabs } from '@shopify/polaris';
import ColourSettings from '../components/ColourSettings';
import DesignSettings from '../components/DesignSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { id: 'colour', content: 'Colour' },
    { id: 'design', content: 'Design' },
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
        </div>
      </Tabs>
    </Layout>
  );
};

export default Settings;
