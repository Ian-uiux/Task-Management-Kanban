/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Task } from '../types';
import { MessageSquare, CheckSquare, Calendar, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface TaskCardProps {
  key?: string | number;
  task: Task;
  onEdit: (task: Task) => void;
  onMove?: (taskId: string, targetColumn: 'backlog' | 'in-progress' | 'review' | 'done') => void;
}

export default function TaskCard({ task, onEdit, onMove }: TaskCardProps) {
  const isDone = task.columnId === 'done';

  // Subtask completed ratio
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0;

  // Render tag styles
  const tagStyles: Record<string, { bg: string; text: string }> = {
    Feature: { bg: 'bg-blue-100', text: 'text-blue-700' },
    Bug: { bg: 'bg-red-100', text: 'text-red-700' },
    Dev: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    API: { bg: 'bg-orange-100', text: 'text-orange-700' },
    Security: { bg: 'bg-purple-100', text: 'text-purple-700' },
    Docs: { bg: 'bg-green-100', text: 'text-green-700' },
    'UI/UX': { bg: 'bg-pink-100', text: 'text-pink-700' },
  };

  const defaultTagStyle = { bg: 'bg-slate-100', text: 'text-slate-700' };
  const currentTagStyle = tagStyles[task.type] || defaultTagStyle;

  // Priority indicator styles
  const priorityStyles: Record<string, { indicator: string; bg: string }> = {
    Critical: { indicator: 'bg-red-500', bg: 'bg-red-50/50 text-red-700 border-red-100' },
    High: { indicator: 'bg-orange-500', bg: 'bg-orange-50/50 text-orange-700 border-orange-105' },
    Medium: { indicator: 'bg-indigo-500', bg: 'bg-indigo-50/50 text-indigo-700 border-indigo-100' },
    Low: { indicator: 'bg-slate-400', bg: 'bg-slate-50 text-slate-600 border-slate-100' },
  };
  const currentPriorityStyle = priorityStyles[task.priority] || priorityStyles.Medium;

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    // Highlight dragging
    if (e.currentTarget) {
      e.currentTarget.classList.add('opacity-40');
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget) {
      e.currentTarget.classList.remove('opacity-40');
    }
  };

  // Quick move handlers for touch or accessibility
  const handleQuickMove = (direction: 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onMove) return;

    const pipeline: Array<'backlog' | 'in-progress' | 'review' | 'done'> = ['backlog', 'in-progress', 'review', 'done'];
    const curIdx = pipeline.indexOf(task.columnId);

    if (direction === 'left' && curIdx > 0) {
      onMove(task.id, pipeline[curIdx - 1]);
    } else if (direction === 'right' && curIdx < pipeline.length - 1) {
      onMove(task.id, pipeline[curIdx + 1]);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onEdit(task)}
      className={`group bg-white border border-slate-200 p-3 rounded shadow-xs hover:border-indigo-400/80 cursor-pointer transition-all duration-150 relative select-none ${
        isDone ? 'opacity-65 border-slate-100 hover:opacity-100' : ''
      }`}
      id={`task-card-${task.id}`}
    >
      {/* Card Header Tag & Key */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className={`${currentTagStyle.bg} ${currentTagStyle.text} text-[9px] font-bold px-1.5 py-0.2 rounded uppercase truncate shrink-0`}>
            {task.type}
          </span>
          <span className="text-slate-400 font-mono text-[9px] font-semibold shrink-0">
            {task.id}
          </span>
        </div>

        {/* Priority indicator badge */}
        <div className={`flex items-center gap-1 text-[9px] font-mono font-medium px-1.5 py-0.2 rounded-full border border-slate-100/80 ${currentPriorityStyle.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${currentPriorityStyle.indicator}`} />
          <span className="text-[9px] shrink-0">{task.priority}</span>
        </div>
      </div>

      {/* Task Title */}
      <h4 className={`text-xs font-bold text-slate-800 leading-snug mb-2 group-hover:text-indigo-650 transition-colors capitalize ${isDone ? 'line-through text-slate-400' : ''}`}>
        {task.title}
      </h4>

      {/* Description Snippet (High-density design) */}
      {task.description && (
        <p className={`text-[10.5px] text-slate-500 leading-normal mb-2 px-0.5 line-clamp-2 ${isDone ? 'text-slate-400/80 line-through' : ''}`}>
          {task.description}
        </p>
      )}

      {/* Due Date Indicator */}
      {task.dueDate && (
        <div className="flex items-center gap-1 text-[9.5px] font-mono text-slate-405 mb-2 px-0.5">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>Due: {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
        </div>
      )}

      {/* Progress & Bottom Bar elements */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-2 gap-2">
        {/* Progress or Completion metrics */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {isDone ? (
            <span className="text-emerald-600 font-bold text-[9px] uppercase tracking-wide flex items-center gap-0.5">
              ✓ Resolved
            </span>
          ) : (
            <div className="flex items-center gap-1.5 w-full">
              {/* Progress Slider Display */}
              <div className="w-12 bg-slate-100 h-1 rounded-full overflow-hidden shrink-0">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${task.progress}%` }} />
              </div>
              <span className="text-[9.5px] text-slate-500 font-medium whitespace-nowrap">
                {task.progress}%
              </span>
            </div>
          )}
        </div>

        {/* Icons status (Subtasks completed, Comments count) */}
        <div className="flex items-center gap-2 text-slate-400">
          {totalSubtasks > 0 && (
            <div className="flex items-center gap-1 shrink-0" title={`${completedSubtasks}/${totalSubtasks} subtasks complete`}>
              <CheckSquare className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-mono font-medium text-slate-505">
                {completedSubtasks}/{totalSubtasks}
              </span>
            </div>
          )}

          {task.comments && task.comments.length > 0 && (
            <div className="flex items-center gap-1 shrink-0" title={`${task.comments.length} comments`}>
              <MessageSquare className="w-3 h-3" />
              <span className="text-[10px]">{task.comments.length}</span>
            </div>
          )}

          {/* User initials badge */}
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] text-slate-900 font-black border border-white shrink-0 shadow-xs"
            style={{ backgroundColor: task.assignee?.avatarColor }}
            title={task.assignee?.name}
          >
            {task.assignee?.initials}
          </div>
        </div>
      </div>

      {/* Quick Move Overlay Trigger (for touch navigation, shows on hover or always on mobile) */}
      <div className="absolute top-2.5 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded border border-slate-200 p-0.5 shadow-sm gap-0.5">
        <button
          onClick={(e) => handleQuickMove('left', e)}
          className="hover:bg-slate-100 hover:text-indigo-600 text-slate-400 rounded p-0.5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
          disabled={task.columnId === 'backlog'}
          title="Move Left"
          id={`move-left-${task.id}`}
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => handleQuickMove('right', e)}
          className="hover:bg-slate-100 hover:text-indigo-600 text-slate-400 rounded p-0.5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
          disabled={task.columnId === 'done'}
          title="Move Right"
          id={`move-right-${task.id}`}
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
