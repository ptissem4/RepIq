

import React, { useMemo } from 'react';
import { CompletedSession, User } from '../../types';
import Card from '../common/Card';
import ScoreEvolutionChart from '../ScoreEvolutionChart'; // Re-using this component
import RadarChart from '../common/charts/RadarChart';

interface TeamAnalyticsProps {
  users: User[];
  onSelectUser: (user: User) => void;
  completedSessions: CompletedSession[];
}

const ProgressBar: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-300">{label}</span>
            <span className="text-sm font-bold text-white">{value.toFixed(1)}/100</span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-brand-purple to-brand-green h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
    </div>
);


const TeamAnalytics: React.FC<TeamAnalyticsProps> = ({ users, onSelectUser, completedSessions }) => {

  const teamData = useMemo(() => {
    const allSessions = completedSessions.sort((a,b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());
    
    // Leaderboard
    const userScores: { [userId: string]: { totalScore: number; count: number; user: User } } = {};
    users.forEach(user => {
      if (user.role === 'member') {
        userScores[user.id] = { totalScore: 0, count: 0, user };
      }
    });

    completedSessions.forEach(session => {
      if (userScores[session.userId]) {
        userScores[session.userId].totalScore += session.feedback.overallScore;
        userScores[session.userId].count++;
      }
    });

    const leaderboard = Object.values(userScores)
      .map(({ user, totalScore, count }) => ({
        ...user,
        avgScore: count > 0 ? Math.round(totalScore / count) : 0,
        totalSimulations: count,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5);


    // Skill averages
    const totalSkillScores = { rapportBuilding: 0, objectionHandling: 0, closing: 0, count: 0 };
    allSessions.forEach(session => {
        if (session.feedback) {
            totalSkillScores.rapportBuilding += session.feedback.skillScores.rapportBuilding;
            totalSkillScores.objectionHandling += session.feedback.skillScores.objectionHandling;
            totalSkillScores.closing += session.feedback.skillScores.closing;
            totalSkillScores.count++;
        }
    });
    const avgSkillScores = {
        rapportBuilding: totalSkillScores.count > 0 ? totalSkillScores.rapportBuilding / totalSkillScores.count : 0,
        objectionHandling: totalSkillScores.count > 0 ? totalSkillScores.objectionHandling / totalSkillScores.count : 0,
        closing: totalSkillScores.count > 0 ? totalSkillScores.closing / totalSkillScores.count : 0,
    };
    
    const radarChartData = {
      labels: ['Rapport', 'Objections', 'Closing'],
      datasets: [
        {
          label: 'Team Average',
          data: [avgSkillScores.rapportBuilding, avgSkillScores.objectionHandling, avgSkillScores.closing],
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 2,
        },
      ],
    };


    // Scenario performance
    const scenarioPerformance: { [title: string]: { totalScore: number; count: number; avgScore: number } } = {};
    allSessions.forEach(session => {
        if (!scenarioPerformance[session.scenario.title]) {
            scenarioPerformance[session.scenario.title] = { totalScore: 0, count: 0, avgScore: 0 };
        }
        scenarioPerformance[session.scenario.title].totalScore += session.feedback.overallScore;
        scenarioPerformance[session.scenario.title].count++;
    });

    Object.values(scenarioPerformance).forEach(scenario => {
        scenario.avgScore = Math.round(scenario.totalScore / scenario.count);
    });

    const sortedScenarioPerformance = Object.entries(scenarioPerformance)
        .sort(([, a], [, b]) => b.count - a.count);

    return {
        leaderboard,
        avgSkillScores,
        radarChartData,
        sortedScenarioPerformance,
        allSessionsForChart: allSessions.map(s => ({
            id: s.id,
            completedAt: s.completedAt,
            feedback: { overallScore: s.feedback.overallScore }
        }))
    };
  }, [users, completedSessions]);
  
  const getScoreColor = (score: number) => {
    if (score > 85) return 'text-green-400';
    if (score > 70) return 'text-yellow-400';
    return 'text-red-400';
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Performance Hub</h1>
        <p className="text-gray-400 mt-1">Analyze your team's training performance and identify coaching opportunities.</p>
      </div>
      
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Team Score Evolution</h3>
        <ScoreEvolutionChart sessions={teamData.allSessionsForChart as any} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Team Skill Matrix</h3>
                <RadarChart data={teamData.radarChartData} />
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card className="overflow-hidden">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-white">Leaderboard</h3>
                    <p className="text-sm text-gray-400">Top 5 users by average score.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-dark-700">
                            <tr>
                                <th className="p-4 font-semibold text-sm text-gray-300">Rank</th>
                                <th className="p-4 font-semibold text-sm text-gray-300">Name</th>
                                <th className="p-4 font-semibold text-sm text-gray-300">Simulations</th>
                                <th className="p-4 font-semibold text-sm text-gray-300">Avg Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {teamData.leaderboard.map((user, index) => (
                                <tr key={user.id} onClick={() => onSelectUser(user)} className="hover:bg-dark-800 transition-colors cursor-pointer">
                                    <td className="p-4 font-bold text-lg text-white">#{index + 1}</td>
                                    <td className="p-4 text-white font-medium hover:underline">{user.name}</td>
                                    <td className="p-4 text-gray-300">{user.totalSimulations}</td>
                                    <td className={`p-4 font-bold ${getScoreColor(user.avgScore)}`}>{user.avgScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
      </div>
      
      <Card>
        <div className="p-6">
            <h3 className="text-xl font-bold text-white">Scenario Performance</h3>
            <p className="text-sm text-gray-400">Average team scores for each scenario, sorted by most practiced.</p>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-dark-700">
                    <tr>
                        <th className="p-4 font-semibold text-sm text-gray-300">Scenario Title</th>
                        <th className="p-4 font-semibold text-sm text-gray-300">Times Practiced</th>
                        <th className="p-4 font-semibold text-sm text-gray-300">Team Avg. Score</th>
                    </tr>
                </thead>
                 <tbody className="divide-y divide-dark-700">
                    {teamData.sortedScenarioPerformance.map(([title, data]) => (
                        <tr key={title}>
                            <td className="p-4 font-medium text-white">{title}</td>
                            <td className="p-4 text-gray-300">{data.count}</td>
                            <td className={`p-4 font-bold ${getScoreColor(data.avgScore)}`}>{data.avgScore}</td>
                        </tr>
                    ))}
                 </tbody>
            </table>
        </div>
      </Card>

    </div>
  );
};

export default TeamAnalytics;