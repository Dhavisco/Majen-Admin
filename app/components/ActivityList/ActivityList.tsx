import React from 'react';

interface Activity {
    description: string;
    time: string;
    status: string;
}

interface ActivityListProps {
    activities: Activity[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'text-green-500';
            case 'warning':
                return 'text-yellow-500';
            case 'error':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
            <ul>
                {activities.map((activity, index) => (
                    <li key={index} className="flex justify-between items-center py-2 border-t">
                        <span>{activity.description}</span>
                        <span className={`text-sm ${getStatusColor(activity.status)}`}>{activity.time}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityList;