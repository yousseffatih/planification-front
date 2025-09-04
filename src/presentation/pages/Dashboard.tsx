import React from 'react';
import { 
  CurrencyDollarIcon, 
  DocumentTextIcon, 
  UsersIcon, 
  HeartIcon 
} from '@heroicons/react/24/solid';
import { MetricCard } from '../components/dashboard/MetricCard';

export const Dashboard: React.FC = () => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$216k',
      change: '$341 ↗',
      changeType: 'positive' as const,
      icon: <CurrencyDollarIcon className="h-6 w-6 text-white" />,
      color: 'bg-orange-500'
    },
    {
      title: 'Invoices',
      value: '2,221',
      change: '121 ↗',
      changeType: 'positive' as const,
      icon: <DocumentTextIcon className="h-6 w-6 text-white" />,
      color: 'bg-green-500'
    },
    {
      title: 'Clients',
      value: '1,423',
      change: '91 ↗',
      changeType: 'positive' as const,
      icon: <UsersIcon className="h-6 w-6 text-white" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Loyalty',
      value: '78%',
      change: '1% ↘',
      changeType: 'negative' as const,
      icon: <HeartIcon className="h-6 w-6 text-white" />,
      color: 'bg-pink-500'
    }
  ];

  const recentInvoices = [
    {
      no: 'PQ-4491C',
      date: '3 Jul, 2020',
      client: 'Daniel Padilla',
      amount: '$2,450',
      status: 'PAID'
    },
    {
      no: 'IN-9911J',
      date: '21 May, 2021',
      client: 'Christina Jacobs',
      amount: '$14,810',
      status: 'OVERDUE'
    },
    {
      no: 'UV-2319A',
      date: '14 Apr, 2020',
      client: 'Elizabeth Bailey',
      amount: '$450',
      status: 'PAID'
    }
  ];

  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Revenue Chart */}
          

          {/* Announcement Card */}
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Activities */}
          

          {/* Recent Invoices */}
          
        </div>
      </div>
    </div>
  );
};