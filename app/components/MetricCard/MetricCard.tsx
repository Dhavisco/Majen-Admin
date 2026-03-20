import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface MetricCardProps {
    title: string;
    value: string | number;
    percentageChange?: number;
    icon: React.ReactNode;
    color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, percentageChange, icon, color }) => {
    const isIncrease = percentageChange !== undefined && percentageChange > 0;

    return (
        <div className="p-4 bg-white shadow rounded-lg flex justify-between items-start space-x-4">
            <div className="flex-1 gap-0.5 flex flex-col items-start">
                <div className={`p-2 flex items-center justify-center rounded-full w-9 ${color} text-white text-base`}>
                    {icon}
                </div>

                <h3 className="text-2xl font-bold">{value}</h3>
                <p className="text-sm text-gray-500">{title}</p>

            </div>

            <div className=''>
                {percentageChange !== undefined && (
                    <div className={`flex items-center p-1 rounded-2xl space-x-1 font-medium text-xs md:text-[13px] ${isIncrease ? 'bg-green-100' : 'bg-red-100'}`}>
                        {isIncrease ? (
                            <FaArrowUp className="text-green-500" />
                        ) : (
                            <FaArrowDown className="text-red-500" />
                        )}
                        <span className={isIncrease ? 'text-green-500' : 'text-red-500'}>
                            {isIncrease ? `+${percentageChange}%` : `${percentageChange}%`}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetricCard;