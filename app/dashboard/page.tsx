import React from 'react';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import MetricCard from '../components/MetricCard/MetricCard';
import RevenueChart from '../components/RevenueChart/RevenueChart';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import VerificationTable from '../components/VerificationTable/VerificationTable';
import ActivityList from '../components/ActivityList/ActivityList';
import { FaUsers, FaShoppingCart, FaDollarSign, FaChartLine } from 'react-icons/fa';

const DashboardPage: React.FC = () => {
    const metrics = [
        { title: 'Total Designers', value: 1000, percentageChange: 12, icon: <FaUsers />, color: 'bg-blue-100' },
        { title: 'Active Clients', value: 8420, percentageChange: 18, icon: <FaUsers />, color: 'bg-green-100' },
        { title: 'Total Orders', value: 3241, percentageChange: 7, icon: <FaShoppingCart />, color: 'bg-orange-100' },
        { title: 'Platform Revenue', value: '₦48.2M', percentageChange: 22, icon: <FaDollarSign />, color: 'bg-purple-100' },
    ];

    const verifications = [
        { designer: 'Kike Johnson', business: 'Liz&Co', submitted: 'Mar 14', actions: <button className="text-blue-600">Verify</button> },
        { designer: 'Omowaju Ayotunde', business: 'Shop Mora', submitted: 'Mar 15', actions: <button className="text-blue-600">Verify</button> },
    ];

    const activities = [
        { description: 'Yvonne Onyata verified by Admin', time: '2m', status: 'success' },
        { description: 'Ankara Blazer flagged for review', time: '18m', status: 'warning' },
        { description: 'Order #4821 placed — ₦100,000', time: '34m', status: 'success' },
        { description: 'Sarah Martin suspended', time: '1h', status: 'error' },
    ];

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {metrics.map((metric, index) => (
                    <MetricCard key={index} {...metric} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                <RevenueChart />
                <div className="bg-white p-4 shadow rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Platform Health</h3>
                    <ProgressBar label="Verified Designers" value={50} color="bg-blue-500" />
                    <ProgressBar label="Order Fulfillment" value={87} color="bg-green-500" />
                    <ProgressBar label="Active Products" value={81} color="bg-purple-500" />
                    <ProgressBar label="Client Retention" value={74} color="bg-yellow-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <VerificationTable data={verifications} />
                <ActivityList activities={activities} />
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;