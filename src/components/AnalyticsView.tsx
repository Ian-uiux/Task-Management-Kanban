/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Task, TaskPriority, TaskType } from '../types';
import { BarChart3, PieChart as PieIcon, Layers, TrendingUp, AlertTriangle, CheckSquare } from 'lucide-react';

interface AnalyticsViewProps {
  tasks: Task[];
  boardName: string;
}

export default function AnalyticsView({ tasks, boardName }: AnalyticsViewProps) {
  // 1. Metric calculations
  const metrics = useMemo(() => {
    const total = tasks.length;
    const backlog = tasks.filter((t) => t.columnId === 'backlog').length;
    const inProgress = tasks.filter((t) => t.columnId === 'in-progress').length;
    const review = tasks.filter((t) => t.columnId === 'review').length;
    const done = tasks.filter((t) => t.columnId === 'done').length;

    const criticalCount = tasks.filter((t) => t.priority === 'Critical' && t.columnId !== 'done').length;
    const totalSubtasks = tasks.reduce((sum, t) => sum + t.subtasks.length, 0);
    const completedSubtasks = tasks.reduce(
      (sum, t) => sum + t.subtasks.filter((s) => s.completed).length,
      0
    );

    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
    const subtaskCompletionRate = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

    return {
      total,
      backlog,
      inProgress,
      review,
      done,
      criticalCount,
      completionRate,
      totalSubtasks,
      completedSubtasks,
      subtaskCompletionRate,
    };
  }, [tasks]);

  // 2. Chart data for column distribution
  const statusChartData = useMemo(() => {
    return [
      { name: 'Backlog', count: metrics.backlog, color: '#64748B' }, // Slate
      { name: 'In Progress', count: metrics.inProgress, color: '#6366F1' }, // Indigo
      { name: 'Review', count: metrics.review, color: '#F59E0B' }, // Amber
      { name: 'Done', count: metrics.done, color: '#10B981' }, // Emerald
    ];
  }, [metrics]);

  // 3. Chart data for priorities
  const priorityChartData = useMemo(() => {
    const priorities: Record<TaskPriority, number> = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    };
    tasks.forEach((t) => {
      priorities[t.priority]++;
    });

    return [
      { name: 'Critical', value: priorities.Critical, color: '#EF4444' }, // Red
      { name: 'High', value: priorities.High, color: '#F97316' }, // Orange
      { name: 'Medium', value: priorities.Medium, color: '#6366F1' }, // Indigo
      { name: 'Low', value: priorities.Low, color: '#94A3B8' }, // Slate
    ].filter((item) => item.value > 0);
  }, [tasks]);

  // 4. Chart data for types
  const typeChartData = useMemo(() => {
    const types: Record<TaskType, number> = {
      Feature: 0,
      Bug: 0,
      Dev: 0,
      API: 0,
      Security: 0,
      Docs: 0,
      'UI/UX': 0,
    };

    tasks.forEach((t) => {
      types[t.type]++;
    });

    const typeColors: Record<TaskType, string> = {
      Feature: '#3B82F6', // Blue
      Bug: '#EF4444', // Red
      Dev: '#6366F1', // Indigo
      API: '#F97316', // Orange
      Security: '#8B5CF6', // Purple
      Docs: '#10B981', // Emerald
      'UI/UX': '#EC4899', // Pink
    };

    return Object.entries(types)
      .map(([name, count]) => ({
        name,
        count,
        color: typeColors[name as TaskType] || '#64748B',
      }))
      .filter((item) => item.count > 0);
  }, [tasks]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 h-full custom-scrollbar" id="analytics-view">
      {/* Title Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Metrics & Insights
          </div>
          <h2 className="text-lg font-bold text-slate-850">
            Analytics Overview for {boardName}
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded text-xs font-mono text-slate-500">
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          <span>Active Dataset: {tasks.length} Scope Elements</span>
        </div>
      </div>

      {/* Numerical Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 p-4 rounded shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Sprint Resolution</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">
            {metrics.completionRate}%
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            {metrics.done} of {metrics.total} Tasks Completed
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Unresolved Risks</span>
            <AlertTriangle className={`w-4 h-4 ${metrics.criticalCount > 0 ? 'text-red-500 animate-pulse' : 'text-slate-300'}`} />
          </div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">
            {metrics.criticalCount}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Active Critical Priority Tickets
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-red-500 h-full rounded-full transition-all duration-500"
              style={{ width: metrics.total > 0 ? `${(metrics.criticalCount / metrics.total) * 100}%` : '0%' }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Subtask Velocity</span>
            <CheckSquare className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">
            {metrics.subtaskCompletionRate}%
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            {metrics.completedSubtasks} of {metrics.totalSubtasks} Subtasks Resolved
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.subtaskCompletionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Loading</span>
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          </div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">
            {metrics.inProgress + metrics.review}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Tasks Currently in Dev or Review
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full"
              style={{
                width:
                  metrics.total > 0
                    ? `${((metrics.inProgress + metrics.review) / metrics.total) * 100}%`
                    : '0%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Recharts Graphical Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Volume Status Distribution */}
        <div className="bg-white border border-slate-200 p-5 rounded shadow-sm lg:col-span-7 flex flex-col min-h-[320px]">
          <div className="flex items-center gap-2 mb-4 text-slate-700">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Workflow Distribution (Task Vol.)</span>
          </div>
          <div className="flex-1 min-h-[220px]">
            {tasks.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No active tasks to visualize.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ fontSize: '11px', borderRadius: '4px', border: '1px solid #E2E8F0', padding: '6px' }}
                    cursor={{ fill: '#F1F5F9' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right: Pie Distribution Priorities */}
        <div className="bg-white border border-slate-200 p-5 rounded shadow-sm lg:col-span-5 flex flex-col min-h-[320px]">
          <div className="flex items-center gap-2 mb-4 text-slate-700">
            <PieIcon className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Priority Distribution</span>
          </div>
          <div className="flex-1 min-h-[220px] flex items-center justify-center relative">
            {priorityChartData.length === 0 ? (
              <div className="text-xs text-slate-400">No priority variables found.</div>
            ) : (
              <div className="w-full h-full flex flex-col sm:flex-row items-center justify-center">
                <div className="w-full h-[180px] sm:w-[60%] sm:h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priorityChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {priorityChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full sm:w-[40%] flex flex-col gap-1.5 px-2">
                  {priorityChartData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-[11px]">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-500 capitalize">{item.name}</span>
                      <span className="text-slate-800 font-bold ml-auto">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Categorization Breakdown (Detailed Horizontal Indicators) */}
      <div className="bg-white border border-slate-200 p-5 rounded shadow-sm mt-6">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-blue-500" />
          <span>Category Type Analytics Breakdown</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {typeChartData.map((type) => {
            const pct = metrics.total > 0 ? Math.round((type.count / metrics.total) * 100) : 0;
            return (
              <div key={type.name} className="border border-slate-100 p-3 rounded bg-slate-50/50">
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                    style={{ backgroundColor: `${type.color}15`, color: type.color }}
                  >
                    {type.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-800">{type.count} Task{type.count > 1 ? 's' : ''}</span>
                </div>
                <div className="text-[11px] text-slate-500 mb-1">{pct}% of overall scope</div>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: type.color }} />
                </div>
              </div>
            );
          })}
          {typeChartData.length === 0 && (
            <div className="col-span-full text-center py-6 text-xs text-slate-400">
              No categories mapped yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
