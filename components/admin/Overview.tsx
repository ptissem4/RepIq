

import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import { User, Transaction, CompletedSession } from '../../types';
import { UsersIcon } from '../common/icons/UsersIcon';
import { CurrencyDollarIcon } from '../common/icons/CurrencyDollarIcon';
import BarChart from '../common/charts/BarChart';
import DonutChart from '../common/charts/DonutChart';
import Button from '../common/Button';
import { CheckBadgeIcon } from '../common/icons/CheckBadgeIcon';
import { DocumentTextIcon } from '../common/icons/DocumentTextIcon';
import { XCircleIcon } from '../common/icons/XCircleIcon';
import { ArrowTrendingUpIcon } from '../common/icons/ArrowTrendingUpIcon';


type DateFilter = 'today' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'custom';

interface OverviewProps {
    users: User[];
    transactions: Transaction[];
    isGlobalView?: boolean;
    sessions: CompletedSession[];
    onReviewSession: (session: CompletedSession) => void;
}

const KpiCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, subtext?: string }> = ({ icon, label, value, subtext }) => (
    <Card className="p-4">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-gray-400">{label}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
                 {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
            </div>
            {icon}
        </div>
    </Card>
);

const Overview: React.FC<OverviewProps> = ({ users, transactions, isGlobalView = false, sessions, onReviewSession }) => {
  const [filter, setFilter] = useState<DateFilter>('last30');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const globalStats = useMemo(() => {
    if (!isGlobalView) return null;
    
    const relevantUsers = users.filter(u => u.role !== 'super-admin');
    const totalUsers = relevantUsers.length;
    const activeSubscriptions = relevantUsers.filter(u => u.status === 'Active').length;
    const inactiveSubscriptions = relevantUsers.filter(u => u.status === 'Inactive').length;
    
    const planCounts = {
        Basic: relevantUsers.filter(u => u.plan === 'Basic').length,
        Pro: relevantUsers.filter(u => u.plan === 'Pro').length,
        Enterprise: relevantUsers.filter(u => u.plan === 'Enterprise').length,
    };

    const paidUsers = relevantUsers.filter(u => u.plan === 'Basic' || u.plan === 'Pro' || u.plan === 'Enterprise').length;
    const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0;
    
    return {
        totalUsers,
        activeSubscriptions,
        inactiveSubscriptions,
        planCounts,
        conversionRate,
    };
  }, [users, isGlobalView]);
  
  const sessionsToReview = useMemo(() => {
    if (isGlobalView) return [];
    return sessions
        .filter(s => !s.managerFeedback)
        .sort((a,b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, 5);
  }, [sessions, isGlobalView]);

  const filteredData = useMemo(() => {
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
        start = customStartDate ? new Date(customStartDate) : new Date(0);
        if (customEndDate) {
            const tempEnd = new Date(customEndDate);
            tempEnd.setHours(23, 59, 59, 999);
            end = tempEnd;
        } else {
            end = new Date();
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
    
    const newUsers = users.filter(u => {
      const joinDate = new Date(u.joinedDate).getTime();
      return joinDate >= startTime && joinDate <= endTime;
    });

    const periodTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date).getTime();
      return transactionDate >= startTime && transactionDate <= endTime;
    });

    const revenueInPeriod = periodTransactions
      .filter(t => t.status === 'Completed')
      .reduce((acc, t) => acc + t.amount, 0);
      
    const newSubscribers = newUsers.filter(u => u.status === 'Active');
    
    const planDistribution = [
        { label: 'Pro', value: newUsers.filter(u => u.plan === 'Pro').length },
        { label: 'Basic', value: newUsers.filter(u => u.plan === 'Basic').length },
        { label: 'Enterprise', value: newUsers.filter(u => u.plan === 'Enterprise').length },
    ].filter(p => p.value > 0);

    const dailyRevenue: { [key: string]: number } = {};
    for (const t of periodTransactions) {
        if (t.status === 'Completed') {
            const day = new Date(t.date).toISOString().split('T')[0];
            dailyRevenue[day] = (dailyRevenue[day] || 0) + t.amount;
        }
    }
    const dailyRevenueData = Object.entries(dailyRevenue)
        .map(([day, value]) => ({ label: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}), value }))
        .sort((a,b) => new Date(a.label).getTime() - new Date(b.label).getTime());


    return {
      newUsersCount: newUsers.length,
      revenueInPeriod,
      newSubscribersCount: newSubscribers.length,
      planDistribution,
      dailyRevenueData,
      transactionCount: periodTransactions.length,
    };
  }, [users, transactions, filter, customStartDate, customEndDate]);

  const handleReset = () => {
    setFilter('last30');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const commonInputClasses = "w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-brand-purple focus:outline-none";

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">{isGlobalView ? 'SaaS Dashboard Overview' : 'Team Overview'}</h1>
        <p className="text-gray-400 mt-1">{isGlobalView ? 'A high-level look at your platform\'s key metrics.' : 'A high-level look at your team\'s activity for the selected period.'}</p>
      </div>

       {isGlobalView && globalStats && (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <KpiCard icon={<UsersIcon className="w-8 h-8 text-blue-400" />} label="Total Users" value={globalStats.totalUsers.toLocaleString()} />
                <KpiCard icon={<CheckBadgeIcon className="w-8 h-8 text-green-400" />} label="Active Subs" value={globalStats.activeSubscriptions.toLocaleString()} />
                <KpiCard icon={<XCircleIcon className="w-8 h-8 text-red-400" />} label="Inactive Subs" value={globalStats.inactiveSubscriptions.toLocaleString()} />
                <KpiCard icon={<ArrowTrendingUpIcon className="w-8 h-8 text-yellow-400" />} label="Conversion Rate" value={`${globalStats.conversionRate.toFixed(1)}%`} subtext="Paid / Total" />
                <KpiCard 
                    icon={<DocumentTextIcon className="w-8 h-8 text-purple-400" />} 
                    label="Plan Distribution" 
                    value={`${globalStats.planCounts.Basic}/${globalStats.planCounts.Pro}/${globalStats.planCounts.Enterprise}`}
                    subtext="Basic / Pro / Ent"
                />
            </div>
            <hr className="border-dark-700"/>
        </>
      )}

      {!isGlobalView && (
        <Card>
            <div className="p-6">
                <h3 className="text-xl font-bold text-white">Sessions Pending Review</h3>
                {sessionsToReview.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                        {sessionsToReview.map(session => {
                            const user = users.find(u => u.id === session.userId);
                            return (
                                <li key={session.id} className="flex justify-between items-center bg-dark-800 p-3 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-white">{session.scenario.title}</p>
                                        <p className="text-xs text-gray-400">Completed by {user?.name || 'Unknown'} on {new Date(session.completedAt).toLocaleDateString()}</p>
                                    </div>
                                    <Button onClick={() => onReviewSession(session)} variant="secondary" className="!text-xs !py-1 !px-3">Review</Button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 mt-3">No new sessions from your team need review. Great work!</p>
                )}
            </div>
        </Card>
      )}


      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-4">
            <div className="flex-grow">
                <label htmlFor="dateFilter" className="text-xs font-medium text-gray-400">Date Range</label>
                <select id="dateFilter" value={filter} onChange={(e) => setFilter(e.target.value as DateFilter)} className={commonInputClasses}>
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
                    <input id="startDate" type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className={commonInputClasses} />
                </div>
                <div className="flex-grow">
                    <label htmlFor="endDate" className="text-xs font-medium text-gray-400">End Date</label>
                    <input id="endDate" type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className={commonInputClasses} />
                </div>
                </>
            )}
            <div>
                <Button onClick={handleReset} variant="secondary">Reset</Button>
            </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg"><UsersIcon className="w-6 h-6 text-blue-400" /></div>
            <div>
              <p className="text-3xl font-bold text-white">{filteredData.newUsersCount.toLocaleString()}</p>
              <p className="text-sm text-gray-400">{isGlobalView ? 'New Users' : 'New Team Members'}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg"><CurrencyDollarIcon className="w-6 h-6 text-green-400" /></div>
            <div>
              <p className="text-3xl font-bold text-white">${filteredData.revenueInPeriod.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Revenue in Period</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
           <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg"><CheckBadgeIcon className="w-6 h-6 text-purple-400" /></div>
            <div>
              <p className="text-3xl font-bold text-white">{filteredData.newSubscribersCount.toLocaleString()}</p>
              <p className="text-sm text-gray-400">New Active Subs</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
           <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg"><DocumentTextIcon className="w-6 h-6 text-yellow-400" /></div>
            <div>
              <p className="text-3xl font-bold text-white">{filteredData.transactionCount}</p>
              <p className="text-sm text-gray-400">Transactions</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">Daily Revenue</h3>
            <div className="h-80">
                {filteredData.dailyRevenueData.length > 0 ? <BarChart data={filteredData.dailyRevenueData} /> : <div className="flex items-center justify-center h-full text-gray-500">No revenue data for this period.</div>}
            </div>
        </Card>
        <Card className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">New User Plans (Period)</h3>
             <div className="h-80">
                {filteredData.planDistribution.reduce((sum, p) => sum + p.value, 0) > 0 ? <DonutChart data={filteredData.planDistribution} /> : <div className="flex items-center justify-center h-full text-gray-500">No new users in this period.</div>}
            </div>
        </Card>
      </div>

    </div>
  );
};

export default Overview;