/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Board, Task, Assignee, ActivityLog, TaskType, TaskPriority } from './types';
import { INITIAL_TASKS, INITIAL_BOARDS, ASSIGNEES, INITIAL_ACTIVITY } from './initialData';
import Sidebar from './components/Sidebar';
import TaskCard from './components/TaskCard';
import CreateEditTaskModal from './components/CreateEditTaskModal';
import AnalyticsView from './components/AnalyticsView';
import ActivityLogView from './components/ActivityLogView';
import TeamView from './components/TeamView';
import { Search, Plus, Filter, LayoutGrid, CheckCircle2, RefreshCw, Layers, SlidersHorizontal, AlertCircle, X, ShieldCheck } from 'lucide-react';

export default function App() {
  // 1. Core States (Synchronized with localStorage)
  const [boards, setBoards] = useState<Board[]>(() => {
    const saved = localStorage.getItem('kanban_boards');
    return saved ? JSON.parse(saved) : INITIAL_BOARDS;
  });

  const [selectedBoardId, setSelectedBoardId] = useState<string>(() => {
    const saved = localStorage.getItem('kanban_selected_board');
    return saved || INITIAL_BOARDS[0].id;
  });

  const [assignees, setAssignees] = useState<Assignee[]>(() => {
    const saved = localStorage.getItem('kanban_assignees');
    return saved ? JSON.parse(saved) : ASSIGNEES;
  });

  const [currentUser, setCurrentUser] = useState<Assignee>(() => {
    const saved = localStorage.getItem('kanban_current_user');
    return saved ? JSON.parse(saved) : ASSIGNEES[0];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('kanban_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('kanban_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY;
  });

  const [currentView, setCurrentView] = useState<'board' | 'analytics' | 'activity' | 'team'>('board');

  // 2. Filters & Searches
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TaskType | 'All'>('All');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'All'>('All');
  const [filterAssigneeId, setFilterAssigneeId] = useState<string | 'All'>('All');

  // 3. Modal Controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultInsertColumn, setDefaultInsertColumn] = useState<'backlog' | 'in-progress' | 'review' | 'done'>('backlog');

  // 4. Persistence Effects
  useEffect(() => {
    localStorage.setItem('kanban_boards', JSON.stringify(boards));
  }, [boards]);

  useEffect(() => {
    localStorage.setItem('kanban_selected_board', selectedBoardId);
  }, [selectedBoardId]);

  useEffect(() => {
    localStorage.setItem('kanban_assignees', JSON.stringify(assignees));
  }, [assignees]);

  useEffect(() => {
    localStorage.setItem('kanban_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('kanban_activity_logs', JSON.stringify(logs));
  }, [logs]);

  // Find Select Board structure
  const activeBoard = useMemo(() => {
    return boards.find((b) => b.id === selectedBoardId) || boards[0];
  }, [boards, selectedBoardId]);

  // Record actions in timeline logs
  const logActivity = (action: string, taskId: string, taskTitle: string, details?: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      action,
      taskId,
      taskTitle,
      timestamp: new Date().toISOString(),
      details,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // 5. Board Mutation and Identity Helpers
  const addNewBoard = (name: string, prefix: string) => {
    const cleanPrefix = prefix.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const newBoard: Board = {
      id: `board-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      keyPrefix: cleanPrefix || 'KAN',
    };
    setBoards([...boards, newBoard]);
    setSelectedBoardId(newBoard.id);
    logActivity('Workspace Setup', newBoard.keyPrefix + '-100', `Added New Board: ${name}`, `Initialized prefix keys with tracking token`);
  };

  const addNewAssignee = (name: string, initials: string, color: string) => {
    const newDev: Assignee = {
      id: `dev-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      initials: initials.toUpperCase(),
      avatarColor: color,
    };
    setAssignees([...assignees, newDev]);
    logActivity('Team Alignment', 'TEAM-DIR', `Welcomed team member: ${name}`, `Onboarded into assignable directory`);
  };

  // Automated incremental key generators (e.g. KAN-111, BUG-102)
  const generateNewTaskId = (boardPrefix: string) => {
    const prefixRegex = new RegExp(`^${boardPrefix}-\\d+$`);
    const boardTasks = tasks.filter((t) => prefixRegex.test(t.id));

    let maxNum = 100; // Start incremental keys at 100
    boardTasks.forEach((t) => {
      const parts = t.id.split('-');
      if (parts.length === 2) {
        const num = parseInt(parts[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    });
    return `${boardPrefix}-${maxNum + 1}`;
  };

  // Insert or edit task
  const handleSaveTask = (savedData: Omit<Task, 'createdAt'> & { createdAt?: string }) => {
    if (editingTask) {
      // Editing
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === editingTask.id) {
            const updatedTask = {
              ...t,
              title: savedData.title,
              description: savedData.description,
              columnId: savedData.columnId,
              type: savedData.type,
              priority: savedData.priority,
              progress: savedData.progress,
              assignee: savedData.assignee,
              subtasks: savedData.subtasks,
              comments: savedData.comments,
              dueDate: savedData.dueDate,
              updatedAt: new Date().toISOString(),
            };

            // Work out logs
            let details = `Assignee: ${savedData.assignee.name} | Progress: ${savedData.progress}%`;
            if (t.columnId !== savedData.columnId) {
              details += ` | Transferred: ${t.columnId.toUpperCase()} ➔ ${savedData.columnId.toUpperCase()}`;
            }
            logActivity('Updated Task', t.id, savedData.title, details);

            return updatedTask;
          }
          return t;
        })
      );
    } else {
      // Creating New Task
      const newId = generateNewTaskId(activeBoard.keyPrefix);
      const newTask: Task = {
        id: newId,
        title: savedData.title,
        description: savedData.description,
        columnId: savedData.columnId,
        type: savedData.type,
        priority: savedData.priority,
        progress: savedData.progress,
        assignee: savedData.assignee,
        subtasks: savedData.subtasks,
        comments: savedData.comments,
        dueDate: savedData.dueDate,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [...prev, newTask]);
      logActivity(
        'Created Task',
        newId,
        savedData.title,
        `Assigned to ${savedData.assignee.name} in state ${savedData.columnId.toUpperCase()}`
      );
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (!taskToDelete) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    logActivity('Deleted Task', taskId, taskToDelete.title, `Permanently dropped ticket from scope`);
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Fast drag & drop handler
  const handleMoveTask = (taskId: string, targetColumn: 'backlog' | 'in-progress' | 'review' | 'done') => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (task.columnId === targetColumn) return;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const original = t.columnId;
          const updatedProgress = targetColumn === 'done' ? 100 : t.progress;
          logActivity(
            'Move Column',
            t.id,
            t.title,
            `Transferred ${original.toUpperCase()} ➔ ${targetColumn.toUpperCase()}`
          );
          return { ...t, columnId: targetColumn, progress: updatedProgress };
        }
        return t;
      })
    );
  };

  // 6. Partition stats and limits
  const visibleTasks = useMemo(() => {
    const prefix = activeBoard.keyPrefix + '-';
    // Match current board tickets
    const boardSpecific = tasks.filter((t) => t.id.startsWith(prefix));

    return boardSpecific.filter((t) => {
      // 1. Text filter
      const matchesSearch =
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Type filter
      const matchesType = filterType === 'All' || t.type === filterType;

      // 3. Priority filter
      const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;

      // 4. Assignee filter
      const matchesAssignee = filterAssigneeId === 'All' || t.assignee.id === filterAssigneeId;

      return matchesSearch && matchesType && matchesPriority && matchesAssignee;
    });
  }, [tasks, activeBoard, searchTerm, filterType, filterPriority, filterAssigneeId]);

  // Sidebar dynamic badge counters
  const sidebarTaskCounts = useMemo(() => {
    const prefix = activeBoard.keyPrefix + '-';
    const boardSpecific = tasks.filter((t) => t.id.startsWith(prefix));
    return {
      board: boardSpecific.length,
      backlog: boardSpecific.filter((t) => t.columnId === 'backlog').length,
      inProgress: boardSpecific.filter((t) => t.columnId === 'in-progress').length,
      review: boardSpecific.filter((t) => t.columnId === 'review').length,
      done: boardSpecific.filter((t) => t.columnId === 'done').length,
    };
  }, [tasks, activeBoard]);

  // Categorize columns
  const columnSections = [
    { id: 'backlog', name: 'Backlog', colorStyle: 'text-slate-500 bg-slate-100', textColors: 'text-slate-500' },
    { id: 'in-progress', name: 'In Progress', colorStyle: 'text-indigo-600 bg-indigo-100', textColors: 'text-indigo-650' },
    { id: 'review', name: 'Review', colorStyle: 'text-amber-600 bg-amber-100', textColors: 'text-amber-650 font-semibold' },
    { id: 'done', name: 'Done', colorStyle: 'text-green-600 bg-green-100', textColors: 'text-green-650' },
  ] as const;

  // Open modal config
  const handleOpenCreateModal = (colId: 'backlog' | 'in-progress' | 'review' | 'done') => {
    setEditingTask(null);
    setDefaultInsertColumn(colId);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Helper clear all filter variables
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterType('All');
    setFilterPriority('All');
    setFilterAssigneeId('All');
  };

  // HTML5 Drop prevention handlers
  const handleDragOverHost = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: 'Backlog to Pre' | 'In-Progress Na' | 'E Review Pa' | 'Okay Na To') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      handleMoveTask(taskId, targetColumnId);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden" id="app-root-container">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        boards={boards}
        selectedBoardId={selectedBoardId}
        setSelectedBoardId={setSelectedBoardId}
        addNewBoard={addNewBoard}
        assignees={assignees}
        addNewAssignee={addNewAssignee}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        taskCounts={sidebarTaskCounts}
      />

      {/* 2. Main Content Frame */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Dynamic header depending on the active view */}
        <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-10 shadow-xs">
          <div className="flex items-center gap-4 min-w-0">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest truncate">
              {currentView === 'board' ? activeBoard.name : `${activeBoard.name} ➔ ${currentView}`}
            </h2>

            {/* Microavatar trackers */}
            <div className="hidden sm:flex -space-x-1.5 items-center">
              {assignees.slice(0, 4).map((a) => (
                <div
                  key={a.id}
                  className="w-6 h-6 rounded-full border-2 border-white text-[8px] font-bold flex items-center justify-center text-slate-900 select-none shadow-xs"
                  style={{ backgroundColor: a.avatarColor }}
                  title={a.name}
                >
                  {a.initials}
                </div>
              ))}
              {assignees.length > 4 && (
                <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                  +{assignees.length - 4}
                </div>
              )}
            </div>
          </div>

          {/* Search box and Action Button alignment */}
          <div className="flex items-center gap-4">
            {/* Quick search input */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Filter tasks by text uy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-8 py-1.5 bg-slate-100 border-none rounded text-xs w-52 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                id="header-search-input"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => handleOpenCreateModal('backlog')}
              className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black px-3.5 py-1.8 rounded-md flex items-center gap-1.5 shadow-sm shadow-indigo-600/10 cursor-pointer transition-all"
              id="header-create-task-btn"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Task
            </button>
          </div>
        </header>

        {/* 3. Sub-View Router */}
        <div className="flex-1 overflow-hidden h-full flex flex-col">
          {currentView === 'board' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header Filter Controls Bar */}
              <div className="bg-white border-b border-slate-150 px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 select-none">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <Filter className="w-3.5 h-3.5 text-indigo-505" />
                    <span>View Presets:</span>
                  </div>

                  {/* Category select filter */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Category:</span>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[11px] text-slate-705 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="All">All Types</option>
                      <option value="Feature">Feature</option>
                      <option value="Bug">Bug</option>
                      <option value="Dev">Dev</option>
                      <option value="API">API</option>
                      <option value="Security">Security</option>
                      <option value="Docs">Docs</option>
                      <option value="UI/UX">UI/UX</option>
                    </select>
                  </div>

                  {/* Priority filter */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Priority:</span>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value as any)}
                      className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[11px] text-slate-705 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="All">All Priorities</option>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  {/* Assignee filter */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Assignee:</span>
                    <select
                      value={filterAssigneeId}
                      onChange={(e) => setFilterAssigneeId(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[11px] text-slate-705 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="All">All Engineers</option>
                      {assignees.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mobile Search input overlay fallback */}
                  <div className="relative block md:hidden">
                    <input
                      type="text"
                      placeholder="Keyword check..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-6 pr-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[11px] focus:outline-none"
                    />
                    <Search className="w-3 h-3 absolute left-2 top-1.5 text-slate-400" />
                  </div>
                </div>

                {/* Clear Active Filters toggle */}
                {(searchTerm || filterType !== 'All' || filterPriority !== 'All' || filterAssigneeId !== 'All') && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[10.5px] text-indigo-600 font-bold hover:text-indigo-850 flex items-center gap-1 transition-colors bg-indigo-50 px-2 py-0.5 rounded cursor-pointer"
                  >
                    <span>Reset Filter Settings</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Kanban Column Lanes (High-density Grid viewports) */}
              <div className="flex-1 p-6 overflow-x-auto overflow-y-hidden flex gap-4 bg-[#F8FAFC] custom-scrollbar select-none" id="kanban-lanes-board">
                {columnSections.map((column) => {
                  // Segment subset tasks matching column designation
                  const columnTasks = visibleTasks.filter((t) => t.columnId === column.id);

                  return (
                    <div
                      key={column.id}
                      onDragOver={handleDragOverHost}
                      onDrop={(e) => handleDrop(e, column.id)}
                      className="flex flex-col w-[250px] sm:w-[270px] shrink-0 h-full"
                      id={`column-lane-${column.id}`}
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between mb-3.5 px-1.5 shrink-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-black uppercase tracking-widest ${column.textColors}`}>
                            {column.name}
                          </span>
                          <span className={`${column.colorStyle} text-[10px] px-2 py-0.2 rounded-full font-bold`}>
                            {columnTasks.length}
                          </span>
                        </div>

                        {/* Quick create ticket button in-situ within Column */}
                        <button
                          onClick={() => handleOpenCreateModal(column.id)}
                          className="hover:bg-slate-205 text-slate-400 hover:text-slate-600 rounded p-1 cursor-pointer transition-colors"
                          title={`Add Task into ${column.name}`}
                          id={`col-quick-add-${column.id}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Dropzone container target list */}
                      <div
                        className="flex-1 overflow-y-auto space-y-3 pb-6 pr-1 custom-scrollbar min-h-0 bg-slate-50/20 rounded p-1.5 border border-dashed border-slate-200/40"
                        id={`column-dropzone-${column.id}`}
                      >
                        {columnTasks.length === 0 ? (
                          <div className="py-12 border-2 border-dashed border-slate-200/40 rounded-lg text-center text-slate-400/80 flex flex-col items-center justify-center p-4">
                            <SlidersHorizontal className="w-5 h-5 text-slate-300 mb-1.5" />
                            <div className="text-[10px] font-bold uppercase tracking-wider">Empty State</div>
                            <p className="text-[9.5px] mt-0.5 leading-snug max-w-[150px] mx-auto text-slate-400">
                              No tickets found. Add or drag cards here.
                            </p>
                          </div>
                        ) : (
                          columnTasks.map((t) => (
                            <TaskCard
                              key={t.id}
                              task={t}
                              onEdit={handleOpenEditModal}
                              onMove={handleMoveTask}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentView === 'analytics' && (
            <AnalyticsView tasks={tasks.filter((t) => t.id.startsWith(activeBoard.keyPrefix + '-'))} boardName={activeBoard.name} />
          )}

          {currentView === 'activity' && (
            <ActivityLogView logs={logs} clearLogs={() => setLogs([])} />
          )}

          {currentView === 'team' && (
            <TeamView
              assignees={assignees}
              tasks={tasks}
              addNewAssignee={addNewAssignee}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          )}
        </div>
      </main>

      {/* 4. Global Creation & Detail Modification Modal Popup */}
      <CreateEditTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
        assignees={assignees}
        currentUser={currentUser}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        defaultColumn={defaultInsertColumn}
      />
    </div>
  );
}
