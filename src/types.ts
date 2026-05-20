/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskType = 'Feature' | 'Bug' | 'Dev' | 'API' | 'Security' | 'Docs' | 'UI/UX';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Assignee {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string; // e.g. KAN-101
  title: string;
  description: string;
  columnId: 'backlog' | 'in-progress' | 'review' | 'done';
  type: TaskType;
  priority: TaskPriority;
  progress: number; // 0 - 100 percentage
  assignee: Assignee;
  subtasks: SubTask[];
  comments: Comment[];
  createdAt: string;
  dueDate?: string;
}

export interface Board {
  id: string;
  name: string;
  keyPrefix: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  taskId: string;
  taskTitle: string;
  timestamp: string;
  details?: string;
}
