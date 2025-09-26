
import React, { useState, useMemo, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Transaction } from '../../types';

type DateFilter = 'today' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'custom';

interface RevenueAnalyticsProps {
    transactions: Transaction[];
}

const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<DateFilter>('last30');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const TRANSACTIONS_PER_PAGE = 20;

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let start: Date;
    let end: Date = new Date(now);
    end.setHours(23, 59, 59, 999);

    switch (filter) {
        case 'today':
            start = new Date(now);
            start.setHours(0, 0, 0, 0);
            break;
        case 'last7':
            start = new Date(now);
            start.setDate(now.getDate() - 6);
            start.setHours(0, 0, 0, 0);
            break;
        case 'thisMonth':
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'lastMonth':
            start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            end = new Date(now.getFullYear(), now.getMonth(), 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'thisYear':
            start = new Date(now.getFullYear(), 0, 1);
            break;
        case 'custom':
            if (!customStartDate && !customEndDate) return transactions;
            start = customStartDate ? new Date(customStartDate) : new Date(0);
            end = customEndDate ? new Date(customEndDate) : new Date();
            if (customEndDate) {
                const tempEnd = new Date(customEndDate);
                tempEnd.setHours(23, 59, 59, 999);
                end = tempEnd;
            }
            break;
        case 'last30':
        default:
            start = new Date(now);
            start.setDate(now.getDate() - 29);
            start.setHours(0, 0, 0, 0);
            break;
    }
    
    const startTime = start.getTime();
    const endTime = end.getTime();

    return transactions.filter(t => {
      const transactionDate = new Date(t.date).getTime();
      return transactionDate >= startTime && transactionDate <= endTime;
    });
  }, [transactions, filter, customStartDate, customEndDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredTransactions]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
    return filteredTransactions.slice(startIndex, startIndex + TRANSACTIONS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / TRANSACTIONS_PER_PAGE);

  const totalRevenueForPeriod = useMemo(() => {
    return filteredTransactions
      .filter(t => t.status === 'Completed')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [filteredTransactions]);

  const handleReset = () => {
    setFilter('last30');
    setCustomStartDate('');
    setCustomEndDate('');
  };
  
  const getStatusBadge = (status: 'Completed' | 'Failed') => {
    return status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';
  }
  
  const commonInputClasses = "w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-brand-purple focus:outline-none";

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Global Revenue</h1>
        <p className="text-gray-400 mt-1">Track the platform's financial performance.</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-grow">
            <label htmlFor="dateFilter" className="text-xs font-medium text-gray-400">Date Range</label>
            <select
              id="dateFilter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as DateFilter)}
              className={commonInputClasses}
            >
              <option value="today">Today</option>
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
           {filter === 'custom' && (
            <>
              <div className="flex-grow">
                <label htmlFor="startDate" className="text-xs font-medium text-gray-400">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={customStartDate}
                  onChange={e => setCustomStartDate(e.target.value)}
                  className={commonInputClasses}
                />
              </div>
              <div className="flex-grow">
                <label htmlFor="endDate" className="text-xs font-medium text-gray-400">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={customEndDate}
                  onChange={e => setCustomEndDate(e.target.value)}
                  className={commonInputClasses}
                />
              </div>
            </>
          )}
          <div>
            <Button onClick={handleReset} variant="secondary">Reset</Button>
          </div>
        </div>
      </Card>
      
       <Card className="p-6 flex flex-col justify-center text-center">
             <p className="text-sm text-gray-400 mb-2">Total Revenue (Selected Period)</p>
            <p className="text-5xl font-bold text-white">${totalRevenueForPeriod.toLocaleString()}</p>
        </Card>

      <Card className="overflow-x-auto">
         <div className="p-4 border-b border-dark-700">
            <h3 className="text-xl font-bold text-white">Transaction History</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-dark-700/50">
            <tr>
              <th className="p-4 font-semibold text-sm text-gray-300">Date</th>
              <th className="p-4 font-semibold text-sm text-gray-300">User</th>
              <th className="p-4 font-semibold text-sm text-gray-300">Amount</th>
              <th className="p-4 font-semibold text-sm text-gray-300">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {paginatedTransactions.map(t => (
              <tr key={t.id} className="hover:bg-dark-800 transition-colors">
                <td className="p-4 whitespace-nowrap text-gray-400">{new Date(t.date).toLocaleDateString()}</td>
                <td className="p-4 whitespace-nowrap text-white font-medium">{t.userName}</td>
                <td className="p-4 whitespace-nowrap text-gray-300">${t.amount.toFixed(2)}</td>
                <td className="p-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(t.status)}`}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
            <div className="p-8 text-center text-gray-500">
                <p>No transactions found for the selected period.</p>
            </div>
        )}
        {totalPages > 1 && (
            <div className="p-4 flex justify-between items-center text-sm border-t border-dark-700">
                <Button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    variant="secondary"
                    className="!text-xs !py-1 !px-3"
                >
                    Previous
                </Button>
                <span className="text-gray-400">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    variant="secondary"
                    className="!text-xs !py-1 !px-3"
                >
                    Next
                </Button>
            </div>
        )}
      </Card>
      
    </div>
  );
};

export default RevenueAnalytics;
