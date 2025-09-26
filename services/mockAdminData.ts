

import { User, Transaction, Organization, CompletedSession, CoachingProgram, UserProgramProgress, Feedback, MessageSender } from '../types';
import { SCENARIOS } from '../constants';


const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Katie', 'Michael', 'Sarah', 'David', 'Laura', 'James', 'Linda', 'Robert', 'Patricia', 'William', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Charles', 'Mary', 'Daniel', 'Jennifer', 'Matthew', 'Maria', 'Anthony', 'Nancy', 'Mark', 'Lisa', 'Steven', 'Karen', 'Paul', 'Betty', 'Andrew', 'Helen'];
const lastNames = ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King'];
const plans: ('Basic' | 'Pro' | 'Enterprise' | 'Trial')[] = ['Basic', 'Pro', 'Enterprise', 'Trial'];
const statuses: ('Active' | 'Inactive' | 'Trial')[] = ['Active', 'Inactive', 'Trial'];
const orgNames = ['Acme Inc.', 'Innovate LLC', 'Solutions Co.', 'Synergy Group', 'Momentum Corp.'];
const billingStatuses: ('Active' | 'Past Due' | 'Canceled')[] = ['Active', 'Past Due', 'Canceled'];

const generateOrganizations = (): Organization[] => {
    return orgNames.map((name, i) => {
        const nextBilling = new Date();
        nextBilling.setDate(nextBilling.getDate() + Math.floor(Math.random() * 30));
        return { 
            id: `org_${i+1}`, 
            name,
            licenseLimit: 10 + i * 5,
            billingStatus: billingStatuses[Math.floor(Math.random() * billingStatuses.length)],
            monthlyAmount: (10 + i * 5) * 25, // Example amount
            nextBillingDate: nextBilling.toISOString().split('T')[0],
        };
    });
};

const generateSessionHistory = (count: number, userId: string, managerId?: string): CompletedSession[] => {
    const history: CompletedSession[] = [];
    let lastDate = new Date();
    for(let i = 0; i < count; i++) {
        lastDate.setDate(lastDate.getDate() - (Math.floor(Math.random() * 7) + 1));
        const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
        const isReviewed = managerId && i < 2 && Math.random() > 0.3; // Review the first 2 recent sessions randomly
        
        history.push({
            id: `sess_${userId}_${i}`,
            userId: userId,
            completedAt: lastDate.toISOString(),
            scenario: scenario,
            chatHistory: [
                { sender: MessageSender.AI, text: "Let's begin." },
                { sender: MessageSender.USER, text: "Okay, I'm ready." }
            ],
            feedback: {
                overallScore: Math.floor(Math.random() * 41) + 60,
                pacingWPM: 150,
                clarityScore: 80,
                inferredTonality: 'Confident',
                strengths: ['Good opening', 'Clear value prop'],
                areasForImprovement: ['Handle objections better', 'Stronger closing'],
                summary: 'A solid attempt with room for improvement in closing.',
                contextualFeedback: [],
                talkToListenRatio: { user: 45, prospect: 55 },
                discourseStructure: { openingEffectiveness: 85, discoveryQuestions: 70, callToActionStrength: 60 },
                skillScores: {
                    rapportBuilding: Math.floor(Math.random() * 51) + 50,
                    objectionHandling: Math.floor(Math.random() * 61) + 40,
                    closing: Math.floor(Math.random() * 71) + 30,
                }
            },
            managerFeedback: isReviewed ? "Good work on the opening. Next time, let's focus on asking more clarifying questions before jumping to the solution." : undefined,
            reviewedByManagerId: isReviewed ? managerId : undefined,
            reviewedAt: isReviewed ? new Date(lastDate.getTime() + 1000 * 60 * 60).toISOString() : undefined,
        });
    }
    return history;
};

const generateAllData = () => {
    const organizations = generateOrganizations();
    const users: User[] = [];
    const transactions: Transaction[] = [];
    const coachingPrograms: CoachingProgram[] = [];
    const programProgress: UserProgramProgress[] = [];
    let allCompletedSessions: CompletedSession[] = [];

    let userIdCounter = 1;
    let transactionIdCounter = 1;

    // Add SaaS Admin user
    const saasAdminOrg: Organization = { id: 'org_0', name: 'RepIQ', licenseLimit: 1 };
    organizations.unshift(saasAdminOrg);
    
    users.push({
        id: `user_0`,
        name: `SaaS Admin`,
        email: `admin@repIQ.ai`,
        avatarUrl: `https://i.pravatar.cc/150?u=admin`,
        plan: 'Enterprise',
        status: 'Active',
        joinedDate: new Date().toLocaleDateString(),
        renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        lastActivity: new Date().toLocaleDateString(),
        totalSimulations: 0,
        avgScore: 0,
        sessionHistory: [],
        organizationId: saasAdminOrg.id,
        role: 'super-admin',
    });


    organizations.filter(org => org.id !== 'org_0').forEach(org => {
        const membersOfOrg: User[] = [];
        // Create one manager for the org
        const managerFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const managerLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const managerJoinDate = new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000);
        
        const manager: User = {
            id: `user_${userIdCounter++}`,
            name: `${managerFirstName} ${managerLastName}`,
            email: `${managerFirstName.toLowerCase()}.${managerLastName.toLowerCase()}@${org.name.split(' ')[0].toLowerCase()}.com`,
            avatarUrl: `https://i.pravatar.cc/150?u=manager${userIdCounter}`,
            plan: 'Enterprise',
            status: 'Active',
            joinedDate: managerJoinDate.toLocaleDateString(),
            renewalDate: new Date(managerJoinDate.getTime() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            totalSimulations: 0, avgScore: 0, sessionHistory: [],
            organizationId: org.id, role: 'manager',
        };

        // Create members for the org, ensuring we don't exceed the license limit
        const memberCount = Math.floor(Math.random() * (org.licenseLimit! - 2)) + 1;
        for (let i = 0; i < memberCount; i++) {
            const memberFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const memberLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const joinDate = new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000);
            const userPlan = plans[Math.floor(Math.random() * plans.length)];

            const member: User = {
                id: `user_${userIdCounter++}`,
                name: `${memberFirstName} ${memberLastName}`,
                email: `${memberFirstName.toLowerCase()}.${memberLastName.toLowerCase()}@${org.name.split(' ')[0].toLowerCase()}.com`,
                avatarUrl: `https://i.pravatar.cc/150?u=${userIdCounter}`,
                plan: userPlan,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                joinedDate: joinDate.toLocaleDateString(),
                renewalDate: new Date(joinDate.getTime() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                totalSimulations: 0, avgScore: 0, sessionHistory: [],
                organizationId: org.id, role: 'member',
            };
            const sessionHistory = generateSessionHistory(Math.floor(Math.random() * 30), member.id, manager.id);
            member.sessionHistory = sessionHistory;
            member.totalSimulations = sessionHistory.length;
            member.avgScore = Math.round(sessionHistory.reduce((acc, s) => acc + s.feedback.overallScore, 0) / (sessionHistory.length || 1));
            
            allCompletedSessions.push(...sessionHistory);
            users.push(member);
            membersOfOrg.push(member);

            // Generate transactions for this member
            const numTransactions = Math.floor(Math.random() * 12) + 1;
            for (let j = 0; j < numTransactions; j++) {
                const transactionDate = new Date(joinDate.getTime() + Math.random() * (Date.now() - joinDate.getTime()));
                transactions.push({
                    id: `txn_${transactionIdCounter++}`,
                    userId: member.id,
                    userName: member.name,
                    organizationId: org.id,
                    amount: org.monthlyAmount ? org.monthlyAmount / memberCount : (userPlan === 'Pro' ? 29 : userPlan === 'Basic' ? 19 : 299),
                    date: transactionDate.toISOString(),
                    status: Math.random() > 0.05 ? 'Completed' : 'Failed',
                });
            }
        }
        
        const managerSessionHistory = generateSessionHistory(Math.floor(Math.random() * 20) + 5, manager.id);
        manager.sessionHistory = managerSessionHistory;
        manager.totalSimulations = managerSessionHistory.length;
        manager.avgScore = Math.round(managerSessionHistory.reduce((acc, s) => acc + s.feedback.overallScore, 0) / (managerSessionHistory.length || 1));
        users.push(manager);
        allCompletedSessions.push(...managerSessionHistory);

        // Create coaching programs for the org
        if (membersOfOrg.length >= 2) {
            const program1: CoachingProgram = {
                id: `prog_${org.id}_1`,
                name: `Onboarding for ${org.name}`,
                description: `Essential scenarios for all new members of the ${org.name} sales team.`,
                organizationId: org.id,
                stages: [
                    { scenarioId: SCENARIOS[3].id, order: 0 }, // Discovery Call
                    { scenarioId: SCENARIOS[4].id, order: 1 }, // "Think about it"
                    { scenarioId: SCENARIOS[0].id, order: 2 }, // Price Objection
                ],
                assignedUserIds: [membersOfOrg[0].id, membersOfOrg[1].id],
            };
            coachingPrograms.push(program1);

            programProgress.push({
                programId: program1.id,
                userId: membersOfOrg[0].id,
                completedStageScenarioIds: [program1.stages[0].scenarioId]
            });
             programProgress.push({
                programId: program1.id,
                userId: membersOfOrg[1].id,
                completedStageScenarioIds: []
            });
        }
    });

    return { users, transactions, organizations, coachingPrograms, programProgress, completedSessions: allCompletedSessions };
};

let cachedData: { 
    users: User[], 
    transactions: Transaction[], 
    organizations: Organization[],
    coachingPrograms: CoachingProgram[],
    programProgress: UserProgramProgress[],
    completedSessions: CompletedSession[],
} | null = null;

export const getMockData = () => {
    if (!cachedData) {
        cachedData = generateAllData();
    }
    return cachedData;
};