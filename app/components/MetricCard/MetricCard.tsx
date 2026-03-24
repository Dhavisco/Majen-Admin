import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

type IndicatorTone = 'neutral' | 'warning' | 'danger' | 'success';

type MetricIndicator =
    | { type: 'percentage'; value: number }
    | { type: 'text'; text: string; tone?: IndicatorTone };

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    indicator?: MetricIndicator;
}

const toneStyles: Record<IndicatorTone, string> = {
    neutral: 'bg-gray-100 text-gray-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    success: 'bg-green-100 text-green-700',
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, indicator, icon, color }) => {
    const renderIndicator = () => {
        if (!indicator) return null;

        if (indicator.type === 'text') {
            const tone = indicator.tone ?? 'neutral';
            return (
                <div className={`flex items-center rounded-2xl px-2 py-1 font-medium text-xs md:text-[13px] ${toneStyles[tone]}`}>
                    <span>{indicator.text}</span>
                </div>
            );
        }

        const isIncrease = indicator.value > 0;
        const isFlat = indicator.value === 0;

        if (isFlat) {
            return (
                <div className="flex items-center rounded-2xl px-2 py-1 font-medium text-xs md:text-[13px] bg-gray-100 text-gray-700">
                    <span>0%</span>
                </div>
            );
        }

        return (
            <div className={`flex items-center p-1 rounded-2xl space-x-1 font-medium text-xs md:text-[13px] ${isIncrease ? 'bg-green-100' : 'bg-red-100'}`}>
                {isIncrease ? (
                    <FaArrowUp className="text-green-500" />
                ) : (
                    <FaArrowDown className="text-red-500" />
                )}
                <span className={isIncrease ? 'text-green-500' : 'text-red-500'}>
                    {isIncrease ? `+${indicator.value}%` : `${indicator.value}%`}
                </span>
            </div>
        );
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg flex justify-between items-start space-x-4">
            <div className="flex-1 gap-0.5 flex flex-col items-start">
                <div className={`p-2 flex items-center justify-center rounded-full w-9 ${color} text-white text-base`}>
                    {icon}
                </div>

                <h3 className="text-2xl font-bold">{value}</h3>
                <p className="text-sm text-gray-500">{title}</p>
            </div>

            <div>
                {renderIndicator()}
            </div>
        </div>
    );
};

export default MetricCard;