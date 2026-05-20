/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LayoutGrid, BarChart2, Bell, Users, Plus, UserCheck, X, RefreshCw } from 'lucide-react';
import { Board, Assignee } from '../types';

interface SidebarProps {
  currentView: 'board' | 'analytics' | 'activity' | 'team';
  setCurrentView: (view: 'board' | 'analytics' | 'activity' | 'team') => void;
  boards: Board[];
  selectedBoardId: string;
  setSelectedBoardId: (id: string) => void;
  addNewBoard: (name: string, prefix: string) => void;
  assignees: Assignee[];
  addNewAssignee: (name: string, initials: string, color: string) => void;
  currentUser: Assignee;
  setCurrentUser: (user: Assignee) => void;
  taskCounts: {
    board: number;
    backlog: number;
    inProgress: number;
    review: number;
    done: number;
  };
}

export default function Sidebar({
  currentView,
  setCurrentView,
  boards,
  selectedBoardId,
  setSelectedBoardId,
  addNewBoard,
  assignees,
  addNewAssignee,
  currentUser,
  setCurrentUser,
  taskCounts,
}: SidebarProps) {
  const [showAddBoard, setShowAddBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardPrefix, setNewBoardPrefix] = useState('KAN');

  const [showAddAssignee, setShowAddAssignee] = useState(false);
  const [newName, setNewName] = useState('');
  const [newInitials, setNewInitials] = useState('');
  const [newColor, setNewColor] = useState('#6366F1');

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const colors = [
    '#6366F1', // indigo
    '#10B981', // emerald
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#F59E0B', // amber
    '#EF4444', // red
    '#3B82F6', // blue
    '#14B8A6', // teal
  ];

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    addNewBoard(newBoardName.trim(), newBoardPrefix.trim().toUpperCase() || 'KAN');
    setNewBoardName('');
    setNewBoardPrefix('KAN');
    setShowAddBoard(false);
  };

  const handleCreateAssignee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newInitials.trim()) return;
    addNewAssignee(newName.trim(), newInitials.trim().toUpperCase(), newColor);
    setNewName('');
    setNewInitials('');
    setShowAddAssignee(false);
  };

  return (
    <aside className="w-64 bg-[#0F172A] flex flex-col shrink-0 h-full border-r border-slate-800" id="app-sidebar">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center font-bold text-white text-xs shadow-md shadow-indigo-600/20">
            K
          </div>
          <h1 className="text-white font-bold tracking-tight uppercase text-xs">Kanban.v1</h1>
        </div>
        <span className="text-[9px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-indigo-400 font-semibold uppercase tracking-wider">
          v1.0.4-stb
        </span>
      </div>

      {/* Main Views Navigation */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-5 custom-scrollbar">
        <div>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-2.5 mb-2.5">
            System Views
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setCurrentView('board')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-all text-left text-xs ${
                currentView === 'board'
                  ? 'bg-indigo-600/15 text-indigo-400 font-medium border-l-2 border-indigo-500 bg-opacity-100'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
              id="view-board-btn"
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Active Board</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                currentView === 'board' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'
              }`}>
                {taskCounts.board}
              </span>
            </button>

            <button
              onClick={() => setCurrentView('analytics')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-all text-left text-xs ${
                currentView === 'analytics'
                  ? 'bg-indigo-600/15 text-indigo-400 font-medium border-l-2 border-indigo-500'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
              id="view-analytics-btn"
            >
              <div className="flex items-center gap-2.5">
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentView('activity')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-all text-left text-xs ${
                currentView === 'activity'
                  ? 'bg-indigo-600/15 text-indigo-400 font-medium border-l-2 border-indigo-500'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
              id="view-activity-btn"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-3.5 h-3.5" />
                <span>Activity Log</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentView('team')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-all text-left text-xs ${
                currentView === 'team'
                  ? 'bg-indigo-600/15 text-indigo-400 font-medium border-l-2 border-indigo-500'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
              id="view-team-btn"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-3.5 h-3.5" />
                <span>Team Database</span>
              </div>
              <span className="text-[10px] font-mono px-1 bg-slate-850 text-slate-500 rounded font-semibold">
                {assignees.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Boards Selector Section */}
        <div>
          <div className="flex items-center justify-between px-2.5 mb-2.5 text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-widest">Workspace Boards</span>
            <button
              onClick={() => setShowAddBoard(!showAddBoard)}
              className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
              title="Add New Board"
              id="add-board-trigger"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {showAddBoard && (
            <form onSubmit={handleCreateBoard} className="bg-slate-800/50 p-2.5 rounded-lg mb-3 border border-slate-700/50 space-y-2">
              <div className="text-[9.5px] font-bold text-slate-400 uppercase">New Board Details</div>
              <div>
                <input
                  type="text"
                  placeholder="e.g. Mobile App"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  className="w-full text-[11px] bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-1 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  required
                  id="new-board-name-input"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Prefix (e.g. MOB)"
                    value={newBoardPrefix}
                    onChange={(e) => setNewBoardPrefix(e.target.value)}
                    maxLength={4}
                    className="w-full text-[11px] bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-1 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                    required
                    id="new-board-prefix-input"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-2.5 py-1 text-[11px] font-bold cursor-pointer"
                  id="submit-board-btn"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          <div className="space-y-1">
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => {
                  setSelectedBoardId(board.id);
                  setCurrentView('board');
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left text-xs ${
                  selectedBoardId === board.id && currentView === 'board'
                    ? 'bg-slate-800 text-slate-200 font-medium border-l-2 border-indigo-500'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
                id={`board-tab-${board.id}`}
              >
                <div className="truncate flex items-center gap-2">
                  <span className="text-[9px] font-mono bg-slate-850 px-1 py-0.2 rounded text-slate-400">
                    {board.keyPrefix}
                  </span>
                  <span className="truncate">{board.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Assignees List */}
        <div>
          <div className="flex items-center justify-between px-2.5 mb-2 text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-widest">Team Members</span>
            <button
              onClick={() => setShowAddAssignee(!showAddAssignee)}
              className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
              title="Add Team Member"
              id="add-team-trigger"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {showAddAssignee && (
            <form onSubmit={handleCreateAssignee} className="bg-slate-800/50 p-2.5 rounded-lg mb-3 border border-slate-700/50 space-y-2">
              <div className="text-[9.5px] font-bold text-slate-400 uppercase">New Member</div>
              <div>
                <input
                  type="text"
                  placeholder="Full name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-[11px] bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-1 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  required
                  id="new-assignee-name"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Initials"
                  value={newInitials}
                  onChange={(e) => setNewInitials(e.target.value)}
                  maxLength={3}
                  className="w-20 text-[11px] bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-1 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-center font-bold"
                  required
                  id="new-assignee-initials"
                />
                <div className="flex items-center gap-1.5 overflow-x-auto self-center select-none py-0.5">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-3.5 h-3.5 rounded-full border cursor-pointer border-white shrink-0 transition-transform ${
                        newColor === c ? 'scale-125 border-slate-800 outline-1 outline-indigo-400' : 'opacity-80'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddAssignee(false)}
                  className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] px-2 py-0.5 font-bold cursor-pointer"
                  id="new-assignee-submit"
                >
                  Add
                </button>
              </div>
            </form>
          )}

          <div className="space-y-1">
            {assignees.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-slate-400 px-2.5 py-1 text-[11px] hover:bg-slate-800/20 rounded"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-900 border border-slate-800"
                    style={{ backgroundColor: item.avatarColor }}
                  >
                    {item.initials}
                  </div>
                  <span className="truncate">{item.name}</span>
                </div>
                {currentUser.id === item.id && (
                  <span className="text-[9px] text-indigo-400 font-semibold bg-indigo-500/10 px-1 rounded uppercase tracking-wide">
                    Active
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer User Widget */}
      <div className="p-4 border-t border-slate-800 relative bg-slate-900/60">
        <button
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className="w-full flex items-center justify-between p-2 bg-slate-800/80 rounded-lg hover:bg-slate-800 transition-all text-left group cursor-pointer"
          id="active-user-widget-btn"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] text-amber-950 font-black shadow-inner shrink-0"
              style={{ backgroundColor: currentUser.avatarColor }}
            >
              {currentUser.initials}
            </div>
            <div className="overflow-hidden">
              <div className="text-white text-xs font-bold truncate group-hover:text-indigo-300 transition-colors">
                {currentUser.name}
              </div>
              <div className="text-slate-500 text-[10px] truncate">Active User</div>
            </div>
          </div>
          <RefreshCw className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
        </button>

        {showUserDropdown && (
          <div className="absolute bottom-16 left-3 right-3 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1.5 z-50 text-xs">
            <div className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700/60 pb-1 mb-1">
              Switch Identity
            </div>
            <div className="max-h-40 overflow-y-auto custom-scrollbar">
              {assignees.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setCurrentUser(u);
                    setShowUserDropdown(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-slate-700/60 ${
                    currentUser.id === u.id ? 'text-indigo-400 bg-slate-700/30 font-medium' : 'text-slate-300'
                  }`}
                  id={`switch-user-btn-${u.id}`}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] text-slate-900 font-bold shrink-0"
                    style={{ backgroundColor: u.avatarColor }}
                  >
                    {u.initials}
                  </div>
                  <span className="truncate">{u.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
