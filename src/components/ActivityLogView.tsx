/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActivityLog } from '../types';
import { RefreshCw, Trash2, ShieldAlert, History } from 'lucide-react';

interface ActivityLogViewProps {
  logs: ActivityLog[];
  clearLogs: () => void;
}

export default function ActivityLogView({ logs, clearLogs }: ActivityLogViewProps) {
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + d.toLocaleDateString();
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 h-full custom-scrollbar" id="activity-log-view">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            System Timeline
          </div>
          <h2 className="text-lg font-bold text-slate-850 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            Workspace Activity Log
          </h2>
        </div>

        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            className="bg-white hover:bg-red-50 text-red-600 border border-slate-200 text-xs px-2.5 py-1.5 rounded flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
            id="clear-logs-btn"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Log Timeline
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden" id="logs-container">
        {logs.length === 0 ? (
          <div className="py-20 text-center">
            <ShieldAlert className="w-10 h-10 text-slate-350 mx-auto mb-3" />
            <div className="text-xs font-bold text-slate-705">Timeline Empty</div>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1">
              Events such as creating tasks, moving columns, or editing subtasks are recorded here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => {
              // Color helper depending on action
              let badgeColor = 'bg-slate-100 text-slate-700';
              if (log.action.includes('Create') || log.action.includes('Add')) {
                badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
              } else if (log.action.includes('Move') || log.action.includes('Column')) {
                badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-100';
              } else if (log.action.includes('Comment')) {
                badgeColor = 'bg-blue-50 text-blue-750 border-blue-100';
              } else if (log.action.includes('Delete') || log.action.includes('Clear')) {
                badgeColor = 'bg-red-50 text-red-700 border-red-100';
              } else if (log.action.includes('Subtask')) {
                badgeColor = 'bg-purple-50 text-purple-700 border-purple-100';
              }

              return (
                <div key={log.id} className="p-3.5 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${badgeColor}`}>
                      {log.action}
                    </span>
                    <div>
                      <div className="text-xs text-slate-800">
                        Task <span className="font-mono font-bold bg-slate-100 text-slate-600 px-1 rounded text-[10px]">{log.taskId}</span>:{' '}
                        <span className="font-semibold text-slate-750">{log.taskTitle}</span>
                      </div>
                      {log.details && (
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block">
                          {log.details}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 shrink-0 select-none text-right">
                    {formatTime(log.timestamp)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
