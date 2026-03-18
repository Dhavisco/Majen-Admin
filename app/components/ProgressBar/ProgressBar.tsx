import React from 'react';

interface ProgressBarProps {
    label: string;
    value: number;
    color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, color }) => {
    return (
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm text-gray-600">{value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full ${color}`}
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;