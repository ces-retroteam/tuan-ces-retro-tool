
export interface Template {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'scale' | 'text' | 'multiple-choice';
  options?: string[];
  required: boolean;
  description?: string;
  score?: number;
  trend?: 'up' | 'down' | 'steady';
  comments?: {
    id: string;
    author: string;
    content: string;
  }[];
  actions?: {
    id: string;
    description: string;
    completed: boolean;
  }[];
}

export interface Session {
  id: string;
  name: string;
  description?: string;
  template: Template;
  facilitatorId: string;
  dateCreated: string;
  status: 'draft' | 'active' | 'completed';
  currentPhase: 'welcome' | 'survey' | 'discuss' | 'review' | 'close';
  isAnonymous: boolean;
}

export interface Response {
  questionId: string;
  value: string | number;
}

export interface Participant {
  id: string;
  name: string;
  responses?: Response[];
  joinedAt: string;
  sessionId?: string; // Added sessionId to link participants to sessions
}

export interface Comment {
  id: string;
  questionId: string;
  sessionId: string;
  text: string;
  userId?: string;
  userName?: string;
  createdAt: string;
}

export interface Action {
  id: string;
  sessionId: string;
  questionId?: string;
  text: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  status: 'open' | 'in-progress' | 'completed';
  createdAt: string;
}
