import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ReactNode;
  color: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  color
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change}
              </span>
              <span className="text-gray-400 text-sm ml-1">
                {changeType === 'positive' ? '↗' : '↘'}
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};