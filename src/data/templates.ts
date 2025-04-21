
import { Template } from '../types';

export const templates: Template[] = [
  {
    id: 'template-1',
    name: 'Team Morale Assessment',
    description: 'Measure team morale, wellbeing, and satisfaction',
    questions: [
      {
        id: 'q1',
        text: 'How would you rate your overall job satisfaction?',
        type: 'scale',
        required: true,
      },
      {
        id: 'q2',
        text: 'How well are team members collaborating?',
        type: 'scale',
        required: true,
      },
      {
        id: 'q3',
        text: 'Do you feel your ideas are valued by the team?',
        type: 'scale',
        required: true,
      },
      {
        id: 'q4',
        text: 'How would you rate your work-life balance?',
        type: 'scale',
        required: true,
      },
      {
        id: 'q5',
        text: 'What could we improve to make our team more effective?',
        type: 'text',
        required: false,
      }
    ]
  },
  {
    id: 'template-2',
    name: 'Agile Process Health',
    description: 'Evaluate the effectiveness of your agile practices',
    questions: [
      {
        id: 'q1',
        text: 'How effective are our sprint planning meetings?',
        type: 'scale',
        required: true,
      },
      {
        id: 'q2',
        text: 'Are we delivering value to customers in each sprint?',
        type: 'scale',
        required: true,
      },
      {
        id: 'q3',
        text: 'How well are we addressing technical debt?',
        type: 'scale',
        required: true,
      },
      {
        id: 'q4',
        text: 'How would you rate our daily standups?',
        type: 'scale',
        required: true,
      },
      {
        id: 'q5',
        text: 'What is one process improvement you would suggest?',
        type: 'text',
        required: false,
      }
    ]
  },
  {
    id: 'template-3',
    name: 'Communication Effectiveness',
    description: 'Assess team communication and information flow',
    questions: [
      {
        id: 'q1',
        text: 'How clear is communication within our team?',
        type: 'scale',
        required: true,
      },
      {
        id: 'q2',
        text: 'Do you receive the information you need to do your job effectively?',
        type: 'scale',
        required: true,
      },
      {
        id: 'q3',
        text: 'How would you rate cross-team communication?',
        type: 'scale',
        required: true,
      },
      {
        id: 'q4',
        text: 'Are meetings productive and necessary?',
        type: 'scale',
        required: true,
      },
      {
        id: 'q5',
        text: 'What communication challenges is the team facing?',
        type: 'text',
        required: false,
      }
    ]
  }
];
