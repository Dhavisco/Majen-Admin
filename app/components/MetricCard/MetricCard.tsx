import React from 'react';

interface MetricCardProps {
    title: string;
    value: string | number;
    percentageChange?: number;
    icon: React.ReactNode;
    color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, percentageChange, icon, color }) => {
    return (
        <div className={`p-4 bg-white shadow rounded-lg flex items-center space-x-4 ${color}`}>
            <div className="text-3xl">{icon}</div>
            <div>
                <h3 className="text-sm text-gray-500">{title}</h3>
                <p className="text-xl font-bold">{value}</p>
                {percentageChange !== undefined && (
                    <p className={`text-sm ${percentageChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {percentageChange > 0 ? `+${percentageChange}%` : `${percentageChange}%`}
                    </p>
                )}
            </div>
        </div>
    );
};

export default MetricCard;