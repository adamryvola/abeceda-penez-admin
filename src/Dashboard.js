import React from 'react';
import OverviewTable from './components/OverviewTable';
import Layout from './components/Layout';

const Dashboard = () => {

    return (
        <Layout title="Přehled">
            <OverviewTable />
        </Layout>
    );
};

export default Dashboard;
