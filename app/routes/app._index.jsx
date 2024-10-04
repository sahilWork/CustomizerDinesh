import React from 'react';
import Layout from '../components/Layout';
import { authenticate } from '../shopify.server';
import { useLoaderData } from '@remix-run/react';
import '@shopify/polaris/build/esm/styles.css';
export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  return { session };
}

const Dashboard = () => {
  const { session, admin } = useLoaderData();

  const addSvg = async () => {
    let shop = session.shop;
    let accessToken = session.accessToken;
    const response = await fetch(`https://${shop}/admin/api/2023-07/themes.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch themes:', response.statusText);
      return;
    }

    const data = await response.json();
    console.log('Themes data:', data);
  }

  return (
    <Layout>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard. Here you can view various metrics and settings.</p>
      <button onClick={addSvg}>Add SVG</button>
    </Layout>
  );
};

export default Dashboard;