

// B2B Team structures
export type UserRole = 'manager' | 'member' | 'super-admin';

export interface Organization {
  id: string;
  name: string;
  licenseLimit?: number;
  billingStatus?: 'Active' | 'Past Due' | 'Canceled';
  monthlyAmount?: number;
  nextBillingDate?: string;
}

// Represents the data model for a user in the "database" (for admin/manager views)
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: 'Basic' | 'Pro' | 'Enterprise' | 'Trial';
  status: 'Active' | 'Inactive' | 'Trial';
  joinedDate: string;
  renewalDate: string;
  lastActivity: string;
  totalSimulations: number;
  avgScore: number;
  sessionHistory: CompletedSession[]; // Unified to CompletedSession
  organizationId: string;
  role: UserRole;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  organizationId: string;
  amount: number;
  date: string; // ISO String
  status: 'Completed' | 'Failed';
}

// Represents the state for the logged-in user in the CoachView
export interface UserProfile {
    subscriptionStatus: 'trial' | 'basic' | 'pro';
    creditsUsed: number;
    monthlySimulationsLimit: number | null;
    lastResetDate: string;
    hasCompletedOnboarding?: boolean;
    // Mirrored from User object for convenience
    id?: string;
    name?: string;
    email?: string;
    avatarUrl?: string;
    organizationId?: string;
    role?: UserRole;
}

export enum AppState {
  DASHBOARD = 'DASHBOARD',
  PRE_ROLEPLAY = 'PRE_ROLEPLAY',
  ROLEPLAY = 'ROLEPLAY',
  FEEDBACK = 'FEEDBACK',
  HISTORY = 'HISTORY',
  LIVE_ASSIST = 'LIVE_ASSIST',
  ACCOUNT = 'ACCOUNT',
  UPGRADE = 'UPGRADE',
}

export enum MessageSender {
  USER = 'USER',
  AI = 'AI',
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  systemInstruction: string;
  lang: string; // e.g., 'en-US', 'fr-FR', 'es-ES'
  category: string;
  prospect: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  details: {
    duration: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    personality: string;
  };
  settings?: {
    coachingStyleModifier?: string;
    ambientSound: string;
  };
  translations?: {
    [key: string]: {
      title: string;
      description: string;
      systemInstruction: string;
      prospect: {
        name: string;
        role: string;
      };
      details: {
        personality: string;
      };
    }
  };
}

export interface ChatMessage {
  sender: MessageSender;
  text: string;
}

export interface ContextualFeedbackItem {
  messageIndex: number;
  comment: string;
  type: 'strength' | 'improvement';
}

export interface Feedback {
  overallScore: number;
  pacingWPM: number;
  clarityScore: number;
  inferredTonality: 'Confident' | 'Hesitant' | 'Empathetic' | 'Assertive' | 'Neutral';
  strengths: string[];
  areasForImprovement: string[];
  summary: string;
  contextualFeedback: ContextualFeedbackItem[];
  talkToListenRatio: {
    user: number;
    prospect: number;
  };
  discourseStructure: {
    openingEffectiveness: number;
    discoveryQuestions: number;
    callToActionStrength: number;
  };
  skillScores: {
    rapportBuilding: number;
    objectionHandling: number;
    closing: number;
  };
}


export interface CompletedSession {
  id: string;
  userId: string; // Added userId to link session to user
  customTitle?: string;
  completedAt: string;
  scenario: Scenario;
  chatHistory: ChatMessage[];
  feedback: Feedback;
  managerFeedback?: string;
  reviewedByManagerId?: string;
  reviewedAt?: string;
}

export interface UserStats {
  totalXp: number;
  streak: {
    count: number;
    lastCompletedDate: string | null;
  };
}

export interface GeneratedResponse {
  response: string;
}

export interface ActionPlanItem {
  suggestion: string;
  relevantScenarioId: string;
}

export interface CoachingStyle {
  id: string;
  name: string;
  title: string;
  philosophy: string;
  techniques: string[];
  systemInstructionModifier: string;
  translations?: {
    [key: string]: {
      name: string;
      title: string;
      philosophy: string;
      techniques: string[];
      systemInstructionModifier: string;
    }
  };
}

export interface CoPilotTurn {
  id: string;
  prospectSays: string;
  copilotSuggests: string;
  timestamp: string;
}

export interface CoPilotSession {
    id: string;
    timestamp: string;
    customTitle?: string;
    turns: CoPilotTurn[];
}

export interface CoachingProgramStage {
  scenarioId: string;
  order: number;
}

export interface CoachingProgram {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  stages: CoachingProgramStage[];
  assignedUserIds: string[];
}

export interface UserProgramProgress {
  programId: string;
  userId: string;
  completedStageScenarioIds: string[];
}