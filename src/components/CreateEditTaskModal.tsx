/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Task, Assignee, TaskType, TaskPriority, SubTask, Comment } from '../types';
import { X, Plus, Trash2, Send, MessageSquare, CheckSquare, Calendar, HelpCircle } from 'lucide-react';

interface CreateEditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  assignees: Assignee[];
  currentUser: Assignee;
  onSave: (task: Omit<Task, 'createdAt'> & { createdAt?: string }) => void;
  onDelete?: (taskId: string) => void;
  defaultColumn?: 'backlog' | 'in-progress' | 'review' | 'done';
}

export default function CreateEditTaskModal({
  isOpen,
  onClose,
  taskToEdit,
  assignees,
  currentUser,
  onSave,
  onDelete,
  defaultColumn = 'backlog',
}: CreateEditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState<'backlog' | 'in-progress' | 'review' | 'done'>(defaultColumn);
  const [type, setType] = useState<TaskType>('Feature');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [progress, setProgress] = useState(0);
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Subtasks State
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Comments State
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');

  // Pre-load data on editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setColumnId(taskToEdit.columnId);
      setType(taskToEdit.type);
      setPriority(taskToEdit.priority);
      setProgress(taskToEdit.progress);
      setAssigneeId(taskToEdit.assignee?.id || '');
      setDueDate(taskToEdit.dueDate || '');
      setSubtasks(taskToEdit.subtasks || []);
      setComments(taskToEdit.comments || []);
    } else {
      // Clear fields for new task
      setTitle('');
      setDescription('');
      setColumnId(defaultColumn);
      setType('Feature');
      setPriority('Medium');
      setProgress(0);
      setAssigneeId(assignees[0]?.id || '');
      setDueDate('');
      setSubtasks([]);
      setComments([]);
    }
  }, [taskToEdit, isOpen, defaultColumn, assignees]);

  // Handle column automatic overrides
  useEffect(() => {
    // IfDone -> progress is 100
    if (columnId === 'done') {
      setProgress(100);
    }
  }, [columnId]);

  if (!isOpen) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const item: SubTask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, item]);
    setNewSubtaskTitle('');
  };

  const toggleSubtask = (id: string) => {
    const updated = subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st));
    setSubtasks(updated);

    // Dynamic progress calculation based on subtasks
    if (updated.length > 0) {
      const completed = updated.filter((st) => st.completed).length;
      const pct = Math.round((completed / updated.length) * 100);
      setProgress(pct);
      // Auto upgrade columns to done or In Progress
      if (pct === 100 && columnId !== 'done') {
        // optionally update column to review or done based on preference
      }
    }
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const commentItem: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      author: currentUser.name,
      text: newCommentText.trim(),
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, commentItem]);
    setNewCommentText('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedAssignee = assignees.find((a) => a.id === assigneeId) || assignees[0];

    onSave({
      id: taskToEdit ? taskToEdit.id : '', // Handled by App.tsx (generates serial incremental keys)
      title: title.trim(),
      description: description.trim(),
      columnId,
      type,
      priority,
      progress,
      assignee: selectedAssignee,
      subtasks,
      comments,
      dueDate: dueDate || undefined,
      createdAt: taskToEdit?.createdAt,
    });
  };

  // Types list
  const taskTypes: TaskType[] = ['Feature', 'Bug', 'Dev', 'API', 'Security', 'Docs', 'UI/UX'];
  const taskPriorities: TaskPriority[] = ['Low', 'Medium', 'High', 'Critical'];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" id="task-modal-container">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded uppercase">
              {taskToEdit ? `Edit Task: ${taskToEdit.id}` : 'Create New Ticket'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200/50 cursor-pointer"
            id="close-task-modal-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200 custom-scrollbar">
          {/* Main Attributes */}
          <div className="flex-1 p-5 space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Ticket Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Describe this ticket briefly..."
                className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-250 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                required
                id="modal-title-input"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details of files, configurations, endpoints, or requirements..."
                rows={4}
                className="w-full text-xs text-slate-700 bg-white border border-slate-250 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                required
                id="modal-description-input"
              />
            </div>

            {/* Grid of properties */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Workflow Status</label>
                <select
                  value={columnId}
                  onChange={(e) => setColumnId(e.target.value as any)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-250 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
                  id="modal-column-input"
                >
                  <option value="backlog">Backlog</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done / Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Task Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TaskType)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-250 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
                  id="modal-type-input"
                >
                  {taskTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Priority Metric</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full text-xs text-slate-850 bg-white border border-slate-250 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-500 font-bold"
                  id="modal-priority-input"
                >
                  {taskPriorities.map((p) => (
                    <option key={p} value={p}>
                      {p} Priority
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Assignee</label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full text-xs text-slate-805 bg-white border border-slate-250 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-500"
                  id="modal-assignee-input"
                >
                  {assignees.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.initials})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                  id="modal-duedate-input"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Completion Progress: {progress}%
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    id="modal-progress-input"
                  />
                  <span className="text-[11px] font-mono font-bold text-slate-500">{progress}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subtasks and Comments Panel */}
          <div className="w-full md:w-[350px] bg-slate-50/50 p-5 flex flex-col space-y-5">
            {/* Subtasks Checklist */}
            <div>
              <div className="text-xs font-bold text-slate-705 uppercase mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                <span>Subtask Checklist ({subtasks.length})</span>
              </div>

              {/* Subtask input */}
              <div className="flex gap-1.5 mb-2.5">
                <input
                  type="text"
                  placeholder="Add actionable subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask(e))}
                  className="flex-1 text-[11px] text-slate-800 bg-white border border-slate-200 rounded px-2 py-1 placeholder-slate-400 focus:outline-none"
                  id="modal-subtask-add-input"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded p-1 cursor-pointer shrink-0"
                  id="modal-subtask-add-btn"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Subtask list */}
              <div className="max-h-36 overflow-y-auto space-y-1.5 custom-scrollbar bg-white p-2 rounded border border-slate-100">
                {subtasks.length === 0 ? (
                  <div className="text-[10px] text-slate-400 text-center py-4">No subtasks added yet.</div>
                ) : (
                  subtasks.map((st) => (
                    <div key={st.id} className="flex items-center justify-between text-[11px] text-slate-700 hover:bg-slate-50 px-1 py-0.5 rounded gap-1.5">
                      <label className="flex items-center gap-2 cursor-pointer truncate flex-1 select-none">
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => toggleSubtask(st.id)}
                          className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                        />
                        <span className={`truncate ${st.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                          {st.title}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeSubtask(st.id)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Comments Thread */}
            <div className="flex-1 flex flex-col min-h-[200px]">
              <div className="text-xs font-bold text-slate-705 uppercase mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                <span>Discussion Thread ({comments.length})</span>
              </div>

              {/* Comments scroll area */}
              <div className="flex-1 max-h-48 overflow-y-auto space-y-2.5 mb-2.5 custom-scrollbar bg-white p-2.5 rounded border border-slate-100">
                {comments.length === 0 ? (
                  <div className="text-[10px] text-slate-400 text-center py-8">No comments yet. Post the first update!</div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="text-[11px] leading-relaxed border-b border-slate-100/50 pb-2 last:border-none">
                      <div className="flex items-center justify-between text-[10px] mb-0.5">
                        <span className="font-bold text-slate-800">{c.author}</span>
                        <span className="text-slate-400 text-[9px] font-mono">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 whitespace-pre-wrap">{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add comment input */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddComment(e))}
                  className="flex-1 text-[11px] text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 placeholder-slate-400 focus:outline-none"
                  id="modal-comment-input"
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded p-1.5 cursor-pointer shrink-0 transition-colors"
                  id="modal-comment-submit-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
          <div>
            {taskToEdit && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(taskToEdit.id)}
                className="bg-white hover:bg-red-50 text-red-600 border border-slate-200 text-xs px-3 py-1.5 rounded flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
                id="modal-delete-task-btn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Ticket
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-white hover:bg-slate-100 text-slate-605 border border-slate-200 text-xs px-3.5 py-1.5 rounded font-bold cursor-pointer"
              id="modal-cancel-btn"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-1.5 rounded transition-all cursor-pointer shadow-sm"
              id="modal-save-btn"
            >
              {taskToEdit ? 'Apply Changes' : 'Publish Ticket'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
