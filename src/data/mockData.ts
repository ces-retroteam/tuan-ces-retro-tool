
import { Session, Participant, Comment, Action } from '../types';
import { templates } from './templates';

// Mock sessions
export const sessions: Session[] = [
  {
    id: 'session-1',
    name: 'Q2 Team Health Check',
    description: 'Quarterly assessment of team health and morale',
    template: templates[0],
    facilitatorId: 'user-1',
    dateCreated: '2025-04-15T10:00:00Z',
    status: 'active',
    currentPhase: 'survey',
    isAnonymous: true
  },
  {
    id: 'session-2',
    name: 'Sprint Retrospective',
    description: 'Evaluation of our agile processes',
    template: templates[1],
    facilitatorId: 'user-1',
    dateCreated: '2025-04-10T14:30:00Z',
    status: 'completed',
    currentPhase: 'close',
    isAnonymous: true
  }
];

// Mock participants
export const participants: Participant[] = [
  {
    id: 'participant-1',
    name: 'Anonymous User 1',
    joinedAt: '2025-04-15T10:05:00Z',
    responses: [
      { questionId: 'q1', value: 4 },
      { questionId: 'q2', value: 3 },
      { questionId: 'q3', value: 5 },
      { questionId: 'q4', value: 4 },
      { questionId: 'q5', value: 'More team building activities would help.' }
    ]
  },
  {
    id: 'participant-2',
    name: 'Anonymous User 2',
    joinedAt: '2025-04-15T10:07:00Z',
    responses: [
      { questionId: 'q1', value: 3 },
      { questionId: 'q2', value: 4 },
      { questionId: 'q3', value: 3 },
      { questionId: 'q4', value: 2 },
      { questionId: 'q5', value: 'Better communication channels needed.' }
    ]
  }
];

// Mock comments
export const comments: Comment[] = [
  {
    id: 'comment-1',
    questionId: 'q2',
    sessionId: 'session-1',
    text: 'We could improve collaboration by having more cross-functional team activities.',
    userName: 'Facilitator',
    createdAt: '2025-04-15T11:30:00Z'
  },
  {
    id: 'comment-2',
    questionId: 'q4',
    sessionId: 'session-1',
    text: 'Work-life balance has been challenging with the recent project deadlines.',
    createdAt: '2025-04-15T11:35:00Z'
  }
];

// Mock actions
export const actions: Action[] = [
  {
    id: 'action-1',
    sessionId: 'session-1',
    questionId: 'q2',
    text: 'Schedule a team building workshop in the next two weeks.',
    assignee: 'Team Lead',
    priority: 'medium',
    dueDate: '2025-05-01',
    status: 'open',
    createdAt: '2025-04-15T12:00:00Z'
  },
  {
    id: 'action-2',
    sessionId: 'session-1',
    questionId: 'q4',
    text: 'Review workload distribution and implement new WLB policies.',
    assignee: 'HR Manager',
    priority: 'high',
    dueDate: '2025-04-30',
    status: 'in-progress',
    createdAt: '2025-04-15T12:05:00Z'
  }
];
