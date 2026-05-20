/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Assignee, Task } from '../types';
import { Users, Plus, UserPlus, Info } from 'lucide-react';

interface TeamViewProps {
  assignees: Assignee[];
  tasks: Task[];
  addNewAssignee: (name: string, initials: string, color: string) => void;
  currentUser: Assignee;
  setCurrentUser: (user: Assignee) => void;
}

export default function TeamView({
  assignees,
  tasks,
  addNewAssignee,
  currentUser,
  setCurrentUser,
}: TeamViewProps) {
  const [name, setName] = useState('');
  const [initials, setInitials] = useState('');
  const [color, setColor] = useState('#6366F1');

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

  // Calculate workloads
  const developerWorkloads = assignees.map((dev) => {
    const devTasks = tasks.filter((t) => t.assignee.id === dev.id);
    const completed = devTasks.filter((t) => t.columnId === 'done').length;
    const active = devTasks.length - completed;
    return {
      ...dev,
      totalTaskCount: devTasks.length,
      activeTaskCount: active,
      completedTaskCount: completed,
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !initials.trim()) return;
    addNewAssignee(name.trim(), initials.trim().toUpperCase(), color);
    setName('');
    setInitials('');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 h-full custom-scrollbar" id="team-database-view">
      <div className="mb-6">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          Identity Directory
        </div>
        <h2 className="text-lg font-bold text-slate-850 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          Workspace Developers Database
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form to add developer */}
        <div className="bg-white border border-slate-200 p-5 rounded shadow-sm h-fit">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-indigo-500" />
            <span>Maglagay ng Bagong Team Pre!</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Rachel Green"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                required
                id="teamform-name"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Initials (Max 3)</label>
              <input
                type="text"
                placeholder="e.g. RG"
                value={initials}
                onChange={(e) => setInitials(e.target.value)}
                maxLength={3}
                className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded px-3 py-2 uppercase font-bold focus:outline-none focus:border-indigo-500"
                required
                id="teamform-initials"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Branding Avatar Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-full border border-white cursor-pointer hover:scale-110 transition-transform ${
                      color === c ? 'scale-115 ring-2 ring-indigo-500 ring-offset-1' : 'opacity-85'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-xs transition-colors cursor-pointer"
              id="teamform-submit"
            >
              Add to Workspace Directory
            </button>
          </form>

          <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-500 flex gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Adding developers exposes them as potential assignees when creating/modifying tasks across the boards.</span>
          </div>
        </div>

        {/* Directory listing & Workloads */}
        <div className="bg-white border border-slate-200 p-5 rounded shadow-sm lg:col-span-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
            Active Directory & Workload Indicators
          </div>

          <div className="divide-y divide-slate-100">
            {developerWorkloads.map((item) => (
              <div key={item.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-slate-900 border border-slate-150"
                    style={{ backgroundColor: item.avatarColor }}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      {item.name}
                      {currentUser.id === item.id && (
                        <span className="text-[8px] bg-indigo-50 text-indigo-600 border border-indigo-100 font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded-full">
                          Logged In (Active)
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500">ID: dev-00{item.id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right self-stretch sm:self-auto justify-between sm:justify-start">
                  <div className="text-left sm:text-right">
                    <div className="text-xs font-mono font-bold text-slate-800">
                      {item.activeTaskCount} Active / {item.totalTaskCount} Total
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Completed {item.completedTaskCount} items successfully
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentUser(item)}
                    disabled={currentUser.id === item.id}
                    className={`text-[10px] font-bold px-2.5 py-1.5 rounded transition-all cursor-pointer ${
                      currentUser.id === item.id
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : 'bg-white hover:bg-indigo-50 text-indigo-600 border border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    Set Identity
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
