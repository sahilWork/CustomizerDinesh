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


  return (
    <Layout>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard. Here you can view various metrics and settings.</p>
     
    </Layout>
  );
};

export default Dashboard;