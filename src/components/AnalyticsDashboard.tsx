/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as Icons from 'lucide-react';

interface AnalyticsDashboardProps {
  workflowsCount: number;
  onClose: () => void;
  logs: any[];
}

export default function AnalyticsDashboard({ workflowsCount, onClose, logs }: AnalyticsDashboardProps) {
  const [activeRange, setActiveRange] = useState<'24h' | '7d' | '30d'>('7d');

  // Calculate stats from actual logs if available, otherwise fallback to premium seeded dashboard values
  const totalExecutionsCount = logs.length > 0 ? logs.length : 1420;
  const successLogsCount = logs.filter((l) => l.status === 'success').length;
  const successRate = logs.length > 0 ? Math.round((successLogsCount / logs.length) * 100) : 98.6;

  // Static high-fidelity dashboard metrics
  const stats = [
    {
      label: 'Total Workflows',
      value: workflowsCount,
      change: '+14% this month',
      icon: 'Layers',
      color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
    },
    {
      label: 'Executions Today',
      value: totalExecutionsCount,
      change: '+8.2% from yesterday',
      icon: 'PlayCircle',
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    },
    {
      label: 'Success Rate',
      value: `${successRate}%`,
      change: 'Constant high health',
      icon: 'Activity',
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    },
    {
      label: 'Running Jobs',
      value: logs.filter((l) => l.status === 'running').length || 2,
      change: 'Active background workers',
      icon: 'Cpu',
      color: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
    },
    {
      label: 'Total API Calls',
      value: '42,912',
      change: 'Rate limit: 100k/day',
      icon: 'Globe',
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
    },
    {
      label: 'Storage Usage',
      value: '24.8 MB',
      change: '0.4% of cloud quota',
      icon: 'HardDrive',
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
    },
  ];

  // Helper to render icons
  const getIconComponent = (iconName: string, className = 'w-5 h-5') => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className={className} /> : <Icons.HelpCircle className={className} />;
  };

  // Custom visual SVG graphics coordinates
  const areaChartPoints = '0,80 50,65 100,50 150,58 200,32 250,42 300,15 350,22 400,8 450,18 500,5';
  const lineChartPoints = '0,40 80,48 160,35 240,55 320,28 400,20 480,12';

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 overflow-y-auto custom-scrollbar flex flex-col h-full space-y-6 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Icons.LineChart className="w-5 h-5 text-indigo-400" />
            Performance & Analytics Dashboard
          </h2>
          <p className="text-xs text-slate-400">
            Real-time insights, execution metrics, and worker queue telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl gap-1">
            {(['24h', '7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setActiveRange(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeRange === r
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5"
          >
            <Icons.LayoutGrid className="w-4 h-4" />
            Back to Canvas
          </button>
        </div>
      </div>

      {/* Grid KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className={`p-4 border rounded-2xl flex flex-col justify-between hover:scale-[1.02] transition-all hover:shadow-xl duration-300 ${s.color}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {s.label}
              </span>
              <div className="p-1.5 rounded-lg">
                {getIconComponent(s.icon)}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                {s.value}
              </h3>
              <p className="text-[9px] text-slate-400 font-medium">
                {s.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Panels (Bento Layout) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Chart 1: Executions Today (Area Chart with linear gradient fill) */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col justify-between hover:shadow-2xl hover:border-slate-850 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs uppercase font-extrabold text-slate-300 tracking-wider">
                Executions Flow Activity
              </h4>
              <p className="text-[10px] text-slate-500">Hourly throughput load in the last 24h</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Icons.TrendingUp className="w-4 h-4" />
              +8.2%
            </span>
          </div>

          {/* SVG Custom Area Chart */}
          <div className="h-56 w-full relative group">
            <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Horizontal grid lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="0" y1="50" x2="500" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" />

              {/* Area path */}
              <path
                d={`M 0 100 L ${areaChartPoints} L 500 100 Z`}
                fill="url(#area-gradient)"
              />
              {/* Stroke line path */}
              <path
                d={`M ${areaChartPoints}`}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                style={{ filter: 'drop-shadow(0 0 6px rgba(99,102,241,0.6))' }}
              />
              {/* Points markers */}
              {areaChartPoints.split(' ').map((p, i) => {
                const [x, y] = p.split(',');
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#ffffff"
                    stroke="#4f46e5"
                    strokeWidth="2"
                    className="cursor-pointer hover:scale-125 transition-transform"
                  />
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold font-mono border-t border-slate-800/60 pt-3">
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>24:00</span>
          </div>
        </div>

        {/* Chart 2: Average Execution Time (Line Chart) */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col justify-between hover:shadow-2xl hover:border-slate-850 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs uppercase font-extrabold text-slate-300 tracking-wider">
                Average Execution Latency (ms)
              </h4>
              <p className="text-[10px] text-slate-500">Avg millisecond latency over the last 7 days</p>
            </div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full">
              Optimal (12ms)
            </span>
          </div>

          {/* SVG Line Chart */}
          <div className="h-56 w-full relative">
            <svg viewBox="0 0 480 80" className="w-full h-full overflow-visible">
              <line x1="0" y1="20" x2="480" y2="20" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1="40" x2="480" y2="40" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1="60" x2="480" y2="60" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />

              <path
                d={`M ${lineChartPoints}`}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                style={{ filter: 'drop-shadow(0 0 4px rgba(56,189,248,0.5))' }}
              />

              {lineChartPoints.split(' ').map((p, i) => {
                const [x, y] = p.split(',');
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#ffffff"
                    stroke="#0284c7"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold font-mono border-t border-slate-800/60 pt-3">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Bar Chart & Donut Chart Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 3: Node Class Distribution (Bar Chart) */}
        <div className="lg:col-span-2 p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col justify-between hover:shadow-2xl hover:border-slate-850 transition-all duration-300">
          <div>
            <h4 className="text-xs uppercase font-extrabold text-slate-300 tracking-wider mb-1">
              Popular Triggered Node Categories
            </h4>
            <p className="text-[10px] text-slate-500 mb-4">Total operations categorized by node classification type</p>
          </div>

          <div className="space-y-4 py-2">
            {[
              { category: 'Generative AI Workers', count: '18,480 runs', pct: 85, color: 'bg-blue-500' },
              { category: 'Triggers & Webhooks', count: '14,212 runs', pct: 68, color: 'bg-emerald-500' },
              { category: 'Communication channels', count: '9,410 runs', pct: 45, color: 'bg-pink-500' },
              { category: 'Databases & CRM logs', count: '6,102 runs', pct: 29, color: 'bg-purple-500' },
              { category: 'Custom JS scripts', count: '2,940 runs', pct: 14, color: 'bg-indigo-500' },
            ].map((bar, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">{bar.category}</span>
                  <span className="text-slate-400 font-mono">{bar.count}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                  <div
                    className={`h-full rounded-full ${bar.color} transition-all duration-1000`}
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Execution Status Donut Ring */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col justify-between hover:shadow-2xl hover:border-slate-850 transition-all duration-300">
          <div>
            <h4 className="text-xs uppercase font-extrabold text-slate-300 tracking-wider mb-1">
              Execution Health Ring
            </h4>
            <p className="text-[10px] text-slate-500 mb-4">Success vs Fail proportions of background workers</p>
          </div>

          {/* Concentric Donut Circle Graphic */}
          <div className="flex items-center justify-center py-4 relative">
            <svg width="140" height="140" viewBox="0 0 36 36" className="transform -rotate-90">
              {/* Gray Base */}
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1e293b" strokeWidth="3" />
              {/* Success Ring (98.6%) */}
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="3.2"
                strokeDasharray="98.6 1.4"
                strokeDashoffset="0"
                style={{ filter: 'drop-shadow(0 0 3px rgba(16,185,129,0.4))' }}
              />
              {/* Failure Ring segment (1.4%) */}
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="#ef4444"
                strokeWidth="3.2"
                strokeDasharray="1.4 98.6"
                strokeDashoffset="-98.6"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-lg font-extrabold text-white tracking-tight">98.6%</span>
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Health</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-semibold pt-4 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Success (1,401)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-300">Failure (19)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
