import { getMockData } from './mockAdminData';
import { SCENARIOS } from '../constants';
import { Scenario, User, CompletedSession } from '../types';

interface InitialData {
    scenarios: Scenario[];
    users: User[];
    completedSessions: CompletedSession[];
}

// Simulate a network request to fetch all initial data for the app
export const getInitialData = (): Promise<InitialData> => {
    return new Promise((resolve) => {
        // In a real app, this would be a fetch call to a backend API.
        // Here, we're simulating it with mock data.
        setTimeout(() => {
            const { users, completedSessions } = getMockData();
            // The SCENARIOS constant is separate from the mock user data
            const allScenarios = SCENARIOS; 
            
            resolve({
                scenarios: allScenarios,
                users: users,
                completedSessions: completedSessions,
            });
        }, 500); // 500ms delay to simulate network latency
    });
};