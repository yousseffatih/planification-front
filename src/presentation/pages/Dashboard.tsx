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
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue</h3>
            <div className="flex items-end justify-center h-64 space-x-4">
              <div className="flex flex-col items-center">
                <div className="h-16 w-8 bg-gray-200 rounded-t"></div>
                <span className="text-xs text-gray-500 mt-2">Mar</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-20 w-8 bg-gray-200 rounded-t"></div>
                <span className="text-xs text-gray-500 mt-2">Apr</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-12 w-8 bg-gray-200 rounded-t"></div>
                <span className="text-xs text-gray-500 mt-2">May</span>
              </div>
              <div className="flex flex-col items-center relative">
                <div className="h-32 w-8 bg-blue-600 rounded-t"></div>
                <div className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  $15,000
                </div>
                <span className="text-xs text-gray-500 mt-2">Jun</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-10 w-8 bg-gray-200 rounded-t"></div>
                <span className="text-xs text-gray-500 mt-2">Jul</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-14 w-8 bg-gray-200 rounded-t"></div>
                <span className="text-xs text-gray-500 mt-2">Aug</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 bg-gray-200 rounded-t"></div>
                <span className="text-xs text-gray-500 mt-2">Sep</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-6 w-8 bg-gray-200 rounded-t"></div>
                <span className="text-xs text-gray-500 mt-2">Oct</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-18 w-8 bg-gray-200 rounded-t"></div>
                <span className="text-xs text-gray-500 mt-2">Nov</span>
              </div>
            </div>
          </div>

          {/* Announcement Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 inline-block mb-4">
              <span className="text-xs font-medium">NEW</span>
            </div>
            <h3 className="text-lg font-bold mb-2">We have added new invoicing templates!</h3>
            <p className="text-blue-100 text-sm mb-6">
              New templates focused on helping you improve your business
            </p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Download Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Activities */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Activities</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">FG</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">New Invoice</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Francisco Gibbs</strong> created invoice PQ-4491C
                  </p>
                  <p className="text-xs text-gray-400">Just Now</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-xs">⚠️</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    Invoice <strong>JL-3432B</strong> reminder was sent to <strong>Chester Corp</strong>
                  </p>
                  <p className="text-xs text-gray-400">Friday, 12:26PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Invoices</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="text-xs font-medium text-gray-500 pb-4">No</th>
                    <th className="text-xs font-medium text-gray-500 pb-4">Date Created</th>
                    <th className="text-xs font-medium text-gray-500 pb-4">Client</th>
                    <th className="text-xs font-medium text-gray-500 pb-4">Amount</th>
                    <th className="text-xs font-medium text-gray-500 pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {recentInvoices.map((invoice, index) => (
                    <tr key={index}>
                      <td className="py-2 text-sm text-gray-900">{invoice.no}</td>
                      <td className="py-2 text-sm text-gray-600">{invoice.date}</td>
                      <td className="py-2 text-sm text-gray-900">{invoice.client}</td>
                      <td className="py-2 text-sm text-gray-900">{invoice.amount}</td>
                      <td className="py-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            invoice.status === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};