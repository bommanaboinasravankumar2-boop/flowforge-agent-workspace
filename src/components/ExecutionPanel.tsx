/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { ExecutionLog } from '../types';

interface ExecutionPanelProps {
  logs: any[];
  activeExecution: any | null;
  onExecute: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  executionStatus: 'idle' | 'running' | 'success' | 'failed' | 'paused';
  executionSpeed: number; // 1 = 1x, 2 = 2x, etc.
  setExecutionSpeed: (speed: number) => void;
}

export default function ExecutionPanel({
  logs,
  activeExecution,
  onExecute,
  onPause,
  onResume,
  onCancel,
  executionStatus,
  executionSpeed,
  setExecutionSpeed,
}: ExecutionPanelProps) {
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [showRawStep, setShowRawStep] = useState<{ nodeId: string; type: 'input' | 'output' } | null>(null);

  // Helper for status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return (
          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Icons.Loader2 className="w-3 h-3 animate-spin" />
            Active
          </span>
        );
      case 'success':
        return (
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Icons.CheckCircle2 className="w-3 h-3" />
            Success
          </span>
        );
      case 'failed':
        return (
          <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Icons.AlertCircle className="w-3 h-3" />
            Failed
          </span>
        );
      case 'paused':
        return (
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Icons.Pause className="w-3 h-3" />
            Paused
          </span>
        );
      default:
        return (
          <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Idle
          </span>
        );
    }
  };

  return (
    <div className="h-64 border-t border-zinc-800 bg-[#0c0c0e]/95 backdrop-blur-xl flex text-zinc-100 relative select-none">
      {/* 1. Execution Control Panel (Left column) */}
      <div className="w-72 border-r border-zinc-800 p-4 flex flex-col justify-between shrink-0 bg-zinc-950/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Workflow Engine
            </span>
            {getStatusBadge(executionStatus)}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            {executionStatus === 'idle' || executionStatus === 'success' || executionStatus === 'failed' ? (
              <button
                onClick={onExecute}
                className="col-span-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold rounded-xl text-white shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02]"
              >
                <Icons.Play className="w-3.5 h-3.5 fill-white" />
                Execute Flow
              </button>
            ) : (
              <>
                {executionStatus === 'running' ? (
                  <button
                    onClick={onPause}
                    className="py-2.5 bg-amber-600 hover:bg-amber-500 text-xs font-bold rounded-xl text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <Icons.Pause className="w-3.5 h-3.5 fill-white" />
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={onResume}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold rounded-xl text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <Icons.Play className="w-3.5 h-3.5 fill-white" />
                    Resume
                  </button>
                )}

                <button
                  onClick={onCancel}
                  className="py-2.5 bg-zinc-900 hover:bg-rose-600/25 border border-zinc-800 text-zinc-300 hover:text-rose-400 hover:border-rose-500/20 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Icons.Square className="w-3.5 h-3.5 fill-current" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Speed Modifier controls */}
        <div className="space-y-2 border-t border-zinc-800/60 pt-3">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400">
            <span>Execution Speed</span>
            <span className="font-mono text-blue-400">{executionSpeed}x Delay</span>
          </div>
          <div className="flex bg-zinc-900 border border-zinc-800/80 p-0.5 rounded-lg gap-0.5">
            {[0.5, 1, 2, 5].map((sp) => (
              <button
                key={sp}
                onClick={() => setExecutionSpeed(sp)}
                className={`flex-1 py-1 text-[9px] font-extrabold rounded-md transition-all ${
                  executionSpeed === sp
                    ? 'bg-zinc-800 text-blue-400 shadow'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Active Run Logs Scrolling Stream (Middle column) */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col min-w-0 custom-scrollbar">
        <h3 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2.5">
          {activeExecution ? 'Live Execution Stream Logs' : 'Select Historic Execution Run to Inspect'}
        </h3>

        {/* If executing, show active logging steps */}
        {activeExecution ? (
          <div className="space-y-1.5 font-mono text-[11px] leading-relaxed">
            <div className="text-zinc-500">
              [{new Date(activeExecution.startedAt).toLocaleTimeString()}] Starting FlowForge thread workers...
            </div>

            {activeExecution.steps.map((step: any, idx: number) => (
              <div key={idx} className="flex flex-col border-b border-zinc-800/40 pb-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-bold">
                    {step.status === 'running' && <Icons.Loader2 className="w-3 h-3 text-blue-400 animate-spin" />}
                    {step.status === 'success' && <Icons.Check className="w-3 h-3 text-emerald-400" />}
                    {step.status === 'failed' && <Icons.X className="w-3 h-3 text-rose-400" />}
                    <span className="text-zinc-200">{step.nodeLabel}</span>
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowRawStep({ nodeId: step.nodeId, type: 'input' })}
                      className="text-[9px] text-blue-400 hover:underline font-bold"
                    >
                      [View Input]
                    </button>
                    <button
                      onClick={() => setShowRawStep({ nodeId: step.nodeId, type: 'output' })}
                      className="text-[9px] text-blue-400 hover:underline font-bold"
                    >
                      [View Output]
                    </button>
                  </div>
                </div>

                {step.error && (
                  <div className="text-rose-400 text-[10px] mt-0.5 bg-rose-500/5 px-2 py-1 rounded border border-rose-500/10">
                    Error: {step.error}
                  </div>
                )}
              </div>
            ))}

            {activeExecution.status === 'success' && (
              <div className="text-emerald-400 font-bold mt-2 flex items-center gap-1.5 text-xs">
                <Icons.CheckCircle2 className="w-4 h-4" />
                Workflow completed successfully in 12ms. All endpoints committed.
              </div>
            )}
            {activeExecution.status === 'failed' && (
              <div className="text-rose-400 font-bold mt-2 flex items-center gap-1.5 text-xs animate-pulse">
                <Icons.AlertTriangle className="w-4 h-4" />
                Workflow halted due to execution exception. Rolled back state.
              </div>
            )}
          </div>
        ) : (
          /* Show table of past execution histories */
          <div className="overflow-x-auto min-h-0 flex-1">
            {logs.length > 0 ? (
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950/40 text-zinc-400 font-bold uppercase text-[9px] tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="p-2">Log ID</th>
                    <th className="p-2">Timestamp</th>
                    <th className="p-2">Workflow ID</th>
                    <th className="p-2">Overall Status</th>
                    <th className="p-2">Steps Run</th>
                    <th className="p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-2 font-mono text-zinc-400">{log.id}</td>
                      <td className="p-2 text-[10px] text-zinc-400">
                        {new Date(log.startedAt).toLocaleString()}
                      </td>
                      <td className="p-2 text-zinc-300 font-mono text-[10px]">{log.workflowId}</td>
                      <td className="p-2">{getStatusBadge(log.status)}</td>
                      <td className="p-2 font-semibold">{log.steps?.length || 0} nodes</td>
                      <td className="p-2 text-right">
                        <button
                          onClick={() => {
                            setSelectedLog(log);
                            setShowRawStep(null);
                          }}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-blue-600 hover:text-white rounded text-[10px] font-bold transition-all"
                        >
                          Inspect Run
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 border border-dashed border-zinc-800/80 rounded-xl text-zinc-500 text-xs italic">
                No historic executions logged yet. Click "Execute Flow" to trigger a background worker test.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Drill-down JSON Inspector (Right column) */}
      {(selectedLog || showRawStep) && (
        <div className="w-80 border-l border-zinc-800 p-4 shrink-0 flex flex-col justify-between bg-zinc-950/40 overflow-y-auto custom-scrollbar">
          <div className="space-y-3 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                {showRawStep ? `${showRawStep.type.toUpperCase()} Payload` : 'Log Inspector'}
              </span>
              <button
                onClick={() => {
                  setSelectedLog(null);
                  setShowRawStep(null);
                }}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            {showRawStep ? (
              /* View step JSON input/output payload */
              <div className="flex-1 min-h-0 bg-zinc-950/80 border border-zinc-800/60 rounded-xl p-3 font-mono text-[10px] text-blue-300 overflow-y-auto custom-scrollbar">
                <pre>
                  {(() => {
                    const activeLog = activeExecution || selectedLog;
                    const step = activeLog?.steps?.find((s: any) => s.nodeId === showRawStep.nodeId);
                    if (!step) return '// No data found';
                    return JSON.stringify(step[showRawStep.type], null, 2);
                  })()}
                </pre>
              </div>
            ) : (
              /* View workflow steps summarize */
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-2">
                <h4 className="text-xs font-bold text-zinc-200">
                  Run ID: <span className="font-mono text-zinc-400">{selectedLog.id}</span>
                </h4>
                <div className="space-y-1.5 text-[11px] font-mono leading-relaxed">
                  {selectedLog.steps?.map((step: any, sIdx: number) => (
                    <div key={sIdx} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-zinc-200 truncate">{step.nodeLabel}</span>
                        <span className={step.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}>
                          {step.status}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => setShowRawStep({ nodeId: step.nodeId, type: 'input' })}
                          className="text-[9px] text-blue-400 hover:underline"
                        >
                          [Input]
                        </button>
                        <button
                          onClick={() => setShowRawStep({ nodeId: step.nodeId, type: 'output' })}
                          className="text-[9px] text-blue-400 hover:underline"
                        >
                          [Output]
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
