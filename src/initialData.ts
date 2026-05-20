/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, Assignee, Board, ActivityLog } from './types';

export const ASSIGNEES: Assignee[] = [
  { id: '1', name: 'John Developer', initials: 'JD', avatarColor: '#F59E0B' }, // amber
  { id: '2', name: 'Alice Smith', initials: 'AS', avatarColor: '#10B981' }, // emerald
  { id: '3', name: 'Bob Johnson', initials: 'BJ', avatarColor: '#8B5CF6' }, // violet
  { id: '4', name: 'Charlie Code', initials: 'CC', avatarColor: '#6366F1' }, // indigo
];

export const INITIAL_BOARDS: Board[] = [
  { id: 'sprint-24', name: 'Engineering Sprint #24', keyPrefix: 'KAN' },
  { id: 'backlog-board', name: 'Product Backlog', keyPrefix: 'PROD' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'KAN-102',
    title: 'Implement Webhook verification logic',
    description: 'Ensure inbound webhooks are properly verified using secure HMAC secret signing keys before scheduling internal background worker jobs.',
    columnId: 'backlog',
    type: 'Feature',
    priority: 'High',
    progress: 0,
    assignee: ASSIGNEES[0], // JD
    subtasks: [
      { id: 'sub-1', title: 'Verify HMAC signatures', completed: false },
      { id: 'sub-2', title: 'Write unit tests for invalid hashes', completed: false },
      { id: 'sub-3', title: 'Add test metrics logger', completed: false }
    ],
    comments: [
      { id: 'c1', author: 'Bob Johnson', text: 'Please ensure signing key is loaded from secret manager.', createdAt: '2026-05-19T10:30:00Z' },
      { id: 'c2', author: 'John Developer', text: 'Already configured in our development environment profile.', createdAt: '2026-05-19T11:45:00Z' },
      { id: 'c3', author: 'Alice Smith', text: 'Let s coordinate with DevOps on rotational deployment.', createdAt: '2026-05-20T01:15:00Z' },
      { id: 'c4', author: 'John Developer', text: 'Will submit PR by tomorrow afternoon.', createdAt: '2026-05-20T05:30:00Z' }
    ],
    createdAt: '2026-05-18T08:00:00Z'
  },
  {
    id: 'KAN-105',
    title: 'Memory leak in task persistence layer',
    description: 'Investigate leak patterns inside node memory heap. DB connection pool does not seem to release active client reference locks.',
    columnId: 'backlog',
    type: 'Bug',
    priority: 'Critical',
    progress: 0,
    assignee: ASSIGNEES[3], // CC (Indigo/blue avatar in mock is Charlie)
    subtasks: [
      { id: 'sub-4', title: 'Profile memory heap on stress environment', completed: false },
      { id: 'sub-5', title: 'Add connection heartbeat timeout handlers', completed: false }
    ],
    comments: [
      { id: 'c5', author: 'John Developer', text: 'Heap dumps show pool capacity exhausting in 3 hours.', createdAt: '2026-05-19T14:40:00Z' }
    ],
    createdAt: '2026-05-18T09:20:00Z'
  },
  {
    id: 'KAN-108',
    title: 'Refactor Kanban column virtualization',
    description: 'Optimize high-frequency render triggers on columns. Virtual list viewport should display up to 1000 total items in rapid viewport scroll.',
    columnId: 'in-progress',
    type: 'Dev',
    priority: 'Medium',
    progress: 65,
    assignee: ASSIGNEES[3], // CC indigo
    subtasks: [
      { id: 'sub-6', title: 'Setup intersection observer anchors', completed: true },
      { id: 'sub-7', title: 'Cache pre-rendered dimensions', completed: true },
      { id: 'sub-8', title: 'Connect drag-and-drop boundary zones', completed: false }
    ],
    comments: [
      { id: 'c6', author: 'John Developer', text: 'This will drastically improve scroll rendering speeds.', createdAt: '2026-05-20T02:00:00Z' }
    ],
    createdAt: '2026-05-18T10:15:00Z'
  },
  {
    id: 'KAN-110',
    title: 'OAuth2 Provider Integration',
    description: 'Integrate external client authorization structures safely backing token generation keys.',
    columnId: 'in-progress',
    type: 'API',
    priority: 'High',
    progress: 40,
    assignee: ASSIGNEES[1], // AS emerald
    subtasks: [
      { id: 'sub-9', title: 'Configure redirect callback endpoints', completed: true },
      { id: 'sub-10', title: 'Store cryptographically secure cookies', completed: false }
    ],
    comments: [],
    createdAt: '2026-05-18T11:00:00Z'
  },
  {
    id: 'KAN-098',
    title: 'Sanitize task description HTML output',
    description: 'Verify and scrub markup tags safely before binding task detail previews, avoiding standard XSS injection pathways.',
    columnId: 'review',
    type: 'Security',
    priority: 'Critical',
    progress: 100,
    assignee: ASSIGNEES[2], // violet/purple
    subtasks: [
      { id: 'sub-11', title: 'Install sanitizing parser filter', completed: true },
      { id: 'sub-12', title: 'Create automated exploit checklist tests', completed: true }
    ],
    comments: [
      { id: 'c7', author: 'Charlie Code', text: 'Waiting for custom security checker to pass on branch.', createdAt: '2026-05-20T06:00:00Z' }
    ],
    createdAt: '2026-05-17T12:00:00Z'
  },
  {
    id: 'KAN-091',
    title: 'Initial PRD and v1 Architecture Design',
    description: 'Draft the original technical implementation plan, layout aesthetics, high density components structure, and schema interfaces.',
    columnId: 'done',
    type: 'Docs',
    priority: 'Low',
    progress: 100,
    assignee: ASSIGNEES[0], // JD
    subtasks: [
      { id: 'sub-13', title: 'Align draft scope with specifications', completed: true },
      { id: 'sub-14', title: 'Publish initial architecture v1 diagram', completed: true }
    ],
    comments: [],
    createdAt: '2026-05-15T09:00:00Z'
  },
  {
    id: 'KAN-092',
    title: 'Setup TurboRepo for scale',
    description: 'Build local monorepo caching structure to speed up compile tasks pipelines significantly.',
    columnId: 'done',
    type: 'Dev',
    priority: 'Medium',
    progress: 100,
    assignee: ASSIGNEES[2],
    subtasks: [
      { id: 'sub-15', title: 'Configure workspace routing and turborepo.json', completed: true }
    ],
    comments: [],
    createdAt: '2026-05-15T15:30:00Z'
  }
];

export const INITIAL_ACTIVITY: ActivityLog[] = [
  { id: 'a1', action: 'Created Task', taskId: 'KAN-102', taskTitle: 'Implement Webhook verification logic', timestamp: '2026-05-18T08:00:00Z' },
  { id: 'a2', action: 'Move Column', taskId: 'KAN-108', taskTitle: 'Refactor Kanban column virtualization', timestamp: '2026-05-19T13:45:00Z', details: 'Moved from Backlog to In Progress' },
  { id: 'a3', action: 'Completed Subtask', taskId: 'KAN-110', taskTitle: 'OAuth2 Provider Integration', timestamp: '2026-05-20T04:30:00Z', details: 'Completed "Configure redirect callback endpoints"' }
];
