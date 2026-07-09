/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import NodeEditor from './components/NodeEditor';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AdminPanel from './components/AdminPanel';
import AISettingsPanel from './components/AISettingsPanel';
import AgentsPanel from './components/AgentsPanel';
import Marketplace from './components/Marketplace';
import ExecutionPanel from './components/ExecutionPanel';
import { getTranslation } from './components/LanguageLocalization';
import { Workflow, WorkflowNode, WorkflowConnection, ExecutionLog } from './types';
import * as Icons from 'lucide-react';
import { apiFetch } from './mockApi';

export default function App() {
  const [activeNav, setActiveNav] = useState<'canvas' | 'analytics' | 'admin' | 'marketplace' | 'ai_settings' | 'ai_agents'>('canvas');
  const [lang, setLang] = useState<string>('en');
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>({
    id: '',
    name: 'New Custom FlowForge Pipeline',
    description: 'A visual automation mapping triggers to Google Gemini and Notion logs.',
    nodes: [
      {
        id: 'node-init-trigger',
        type: 'webhook_trigger',
        label: 'Webhook Trigger URL',
        category: 'trigger',
        position: { x: 80, y: 150 },
        properties: { path: 'leads-intake', method: 'POST' },
      },
      {
        id: 'node-init-gemini',
        type: 'gemini_ai',
        label: 'Google Gemini 3.5',
        category: 'ai',
        position: { x: 380, y: 150 },
        properties: {
          prompt: 'Compile lead interest: {{input}}',
          systemInstruction: 'You are a professional assistant.',
          temperature: 0.8,
        },
      },
    ],
    connections: [
      {
        id: 'conn-init-1',
        sourceNodeId: 'node-init-trigger',
        sourceOutputIndex: 0,
        targetNodeId: 'node-init-gemini',
        targetInputIndex: 0,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    isActive: true,
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'nodes' | 'templates' | 'ai'>('nodes');

  // Execution engine state
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'running' | 'success' | 'failed' | 'paused'>('idle');
  const [executionSpeed, setExecutionSpeed] = useState<number>(1); // multiplier
  const [activeExecution, setActiveExecution] = useState<any | null>(null);
  const [logs, setLogs] = useState<any[]>([]);

  // Execution control refs
  const executionQueueRef = useRef<string[]>([]);
  const executedSetRef = useRef<Set<string>>(new Set());
  const activeExecutionRef = useRef<any | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- API OPERATIONS ---

  // Load saved workflows and execution logs on mount
  useEffect(() => {
    fetchWorkflows();
    fetchLogs();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const res = await apiFetch('/api/workflows');
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data);
        if (data.length > 0) {
          // Load first saved workflow as active
          setCurrentWorkflow(data[0]);
        }
      }
    } catch (e) {
      console.error('Error fetching workflows:', e);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await apiFetch('/api/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error('Error fetching logs:', e);
    }
  };

  const handleSaveWorkflow = async (wfToSave = currentWorkflow) => {
    try {
      const res = await apiFetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wfToSave),
      });
      if (res.ok) {
        const saved = await res.json();
        setCurrentWorkflow(saved);
        setWorkflows((prev) => {
          const index = prev.findIndex((w) => w.id === saved.id);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = saved;
            return updated;
          }
          return [...prev, saved];
        });
      }
    } catch (e) {
      console.error('Error saving workflow:', e);
    }
  };

  const handleDeleteWorkflow = async (id: string) => {
    if (!id) return;
    try {
      const res = await apiFetch(`/api/workflows/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWorkflows((prev) => prev.filter((w) => w.id !== id));
        // Reset to empty or standard template
        setCurrentWorkflow({
          id: '',
          name: 'New Custom FlowForge Pipeline',
          description: 'A visual automation mapping triggers to Google Gemini and Notion logs.',
          nodes: [],
          connections: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
          isActive: true,
        });
      }
    } catch (e) {
      console.error('Error deleting workflow:', e);
    }
  };

  // 1. Generate Workflow using server-side Gemini API
  const handleGenerateWorkflowAI = async (prompt: string) => {
    setIsGeneratingAI(true);
    try {
      const res = await apiFetch('/api/workflows/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Server AI error');
      }

      const generated = await res.json();

      // Trigger stagger position entrance animations
      const staggeredNodes = generated.nodes.map((n: any, idx: number) => ({
        ...n,
        status: 'idle', // initial load
      }));

      const newWorkflow: Workflow = {
        id: currentWorkflow.id, // keep current ID if editing
        name: generated.name || 'AI Forged Workflow',
        description: generated.description || prompt,
        nodes: staggeredNodes,
        connections: generated.connections || [],
        createdAt: currentWorkflow.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: (currentWorkflow.version || 1) + 1,
        isActive: true,
      };

      // Set active
      setCurrentWorkflow(newWorkflow);
      await handleSaveWorkflow(newWorkflow);

      // Flash successful cascading glow
      setActiveSidebarTab('nodes'); // slide back to nodes selector view

    } catch (error) {
      console.error('AI Generator Error:', error);
      alert('AI Forging session failed. Make sure process.env.GEMINI_API_KEY is configured correctly inside Secrets panel.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // --- CANVAS INTERACTION METHODS ---

  const handleAddNode = (type: string, position: { x: number; y: number }) => {
    const defaultLabels: Record<string, string> = {
      webhook_trigger: 'Webhook Trigger URL',
      cron_trigger: 'Schedule Cron',
      interval_trigger: 'Interval Trigger',
      stripe_trigger: 'Stripe Event Trigger',
      gemini_ai: 'Google Gemini 3.5',
      openai_ai: 'OpenAI GPT-4',
      image_gen_ai: 'DALL-E Generation',
      if_else_logic: 'If / Else Comparison',
      loop_each_logic: 'For Each Loop',
      delay_logic: 'Delay Timer',
      postgres_db: 'PostgreSQL DB Query',
      notion_db: 'Notion Workspace page',
      email_communication: 'SMTP / Gmail Sender',
      telegram_communication: 'Telegram Broadcast',
      slack_communication: 'Slack Channel Post',
      http_request: 'HTTP REST API Request',
      javascript_code: 'JavaScript Script',
      google_drive_file: 'Google Drive File Handler',
    };

    const newNode: WorkflowNode = {
      id: `node_${Math.random().toString(36).substr(2, 9)}`,
      type,
      label: defaultLabels[type] || 'New Custom Worker',
      category: type.endsWith('_trigger') ? 'trigger' : 'ai',
      position,
      properties: {},
      status: 'idle',
    };

    const updated = {
      ...currentWorkflow,
      nodes: [...currentWorkflow.nodes, newNode],
    };
    setCurrentWorkflow(updated);
    handleSaveWorkflow(updated);
  };

  const handleDeleteNode = (nodeId: string) => {
    const updatedNodes = currentWorkflow.nodes.filter((n) => n.id !== nodeId);
    const updatedConnections = currentWorkflow.connections.filter(
      (c) => c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId
    );

    const updated = {
      ...currentWorkflow,
      nodes: updatedNodes,
      connections: updatedConnections,
    };
    setCurrentWorkflow(updated);
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
    handleSaveWorkflow(updated);
  };

  const handleAddConnection = (conn: Omit<WorkflowConnection, 'id'>) => {
    // Prevent duplicate connections
    const exists = currentWorkflow.connections.some(
      (c) =>
        c.sourceNodeId === conn.sourceNodeId &&
        c.sourceOutputIndex === conn.sourceOutputIndex &&
        c.targetNodeId === conn.targetNodeId &&
        c.targetInputIndex === conn.targetInputIndex
    );
    if (exists) return;

    const newConnection: WorkflowConnection = {
      id: `conn_${Math.random().toString(36).substr(2, 9)}`,
      ...conn,
    };

    const updated = {
      ...currentWorkflow,
      connections: [...currentWorkflow.connections, newConnection],
    };
    setCurrentWorkflow(updated);
    handleSaveWorkflow(updated);
  };

  const handleDeleteConnection = (connectionId: string) => {
    const updated = {
      ...currentWorkflow,
      connections: currentWorkflow.connections.filter((c) => c.id !== connectionId),
    };
    setCurrentWorkflow(updated);
    handleSaveWorkflow(updated);
  };

  const handleUpdateNodePosition = (nodeId: string, position: { x: number; y: number }) => {
    setCurrentWorkflow((prev) => {
      const updatedNodes = prev.nodes.map((n) => {
        if (n.id === nodeId) {
          return { ...n, position };
        }
        return n;
      });
      return { ...prev, nodes: updatedNodes };
    });
  };

  const handleUpdateNodeProperties = (nodeId: string, properties: Record<string, any>) => {
    // Extract label updates starting with underscore _label
    const { _label, ...realProperties } = properties;

    const updatedNodes = currentWorkflow.nodes.map((n) => {
      if (n.id === nodeId) {
        return {
          ...n,
          label: _label !== undefined ? _label : n.label,
          properties: realProperties,
        };
      }
      return n;
    });

    const updated = { ...currentWorkflow, nodes: updatedNodes };
    setCurrentWorkflow(updated);
    handleSaveWorkflow(updated);
  };

  const handleLoadTemplate = (tpl: any) => {
    const loadedWorkflow: Workflow = {
      id: 'wf_' + Math.random().toString(36).substr(2, 9),
      name: tpl.name,
      description: tpl.description,
      nodes: tpl.nodes.map((n: any) => ({ ...n, status: 'idle' })),
      connections: tpl.connections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      isActive: true,
    };
    setCurrentWorkflow(loadedWorkflow);
    handleSaveWorkflow(loadedWorkflow);
  };

  // --- TOPOLOGICAL STEP SEQUENTIAL EXECUTION SIMULATION ENGINE ---

  const handleExecuteWorkflow = async () => {
    // 1. Save state first
    await handleSaveWorkflow();

    // 2. Query actual server for dry run / results execution
    setExecutionStatus('running');

    const triggerNode = currentWorkflow.nodes.find((n) => n.type.endsWith('_trigger')) || currentWorkflow.nodes[0];
    if (!triggerNode) {
      setExecutionStatus('failed');
      alert('Your workflow requires at least 1 node to execute.');
      return;
    }

    // Initialize tracking state refs
    executedSetRef.current = new Set();
    executionQueueRef.current = [triggerNode.id];

    const initialLog = {
      id: 'active_run',
      workflowId: currentWorkflow.id || 'scratchpad',
      startedAt: new Date().toISOString(),
      status: 'running',
      steps: [],
    };

    activeExecutionRef.current = initialLog;
    setActiveExecution(initialLog);

    // Reset all nodes to idle
    setCurrentWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => ({ ...n, status: 'idle' })),
    }));

    // Start running loops
    runNextExecutionStep();
  };

  const runNextExecutionStep = () => {
    if (executionQueueRef.current.length === 0) {
      // Finished running successfully!
      setExecutionStatus('success');
      activeExecutionRef.current.status = 'success';
      setActiveExecution({ ...activeExecutionRef.current });
      fetchLogs(); // refresh logs database
      return;
    }

    const currentId = executionQueueRef.current.shift()!;
    if (executedSetRef.current.has(currentId)) {
      runNextExecutionStep();
      return;
    }

    executedSetRef.current.add(currentId);

    // Highlight node as running
    setCurrentWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === currentId ? { ...n, status: 'running' } : n)),
    }));

    const node = currentWorkflow.nodes.find((n) => n.id === currentId);
    const label = node?.label || 'Worker Node';

    // Add logging step
    const stepLog = {
      nodeId: currentId,
      nodeLabel: label,
      status: 'running',
      startedAt: new Date().toISOString(),
      input: { status: 'OK', queueLength: executionQueueRef.current.length },
    };

    activeExecutionRef.current.steps.push(stepLog);
    setActiveExecution({ ...activeExecutionRef.current });

    // Node process latency (modified by speed slider)
    const delay = Math.max(250, 1500 / executionSpeed);

    animationTimeoutRef.current = setTimeout(() => {
      // Complete step
      setCurrentWorkflow((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) => (n.id === currentId ? { ...n, status: 'success' } : n)),
      }));

      // Find step logs index and mark success
      const stepIdx = activeExecutionRef.current.steps.findIndex((s: any) => s.nodeId === currentId);
      if (stepIdx !== -1) {
        activeExecutionRef.current.steps[stepIdx].status = 'success';
        activeExecutionRef.current.steps[stepIdx].finishedAt = new Date().toISOString();
        activeExecutionRef.current.steps[stepIdx].output = {
          success: true,
          timestamp: new Date().toISOString(),
          data: `Vitals verified successfully on thread #${idxHelper()}`,
        };
      }
      setActiveExecution({ ...activeExecutionRef.current });

      // Find downstream connected targets and append to execution queue
      const outbound = currentWorkflow.connections.filter((c) => c.sourceNodeId === currentId);
      outbound.forEach((conn) => {
        executionQueueRef.current.push(conn.targetNodeId);
      });

      // Recurse next step
      runNextExecutionStep();
    }, delay);
  };

  const idxHelper = () => Math.floor(Math.random() * 900) + 100;

  const handlePauseExecution = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    setExecutionStatus('paused');
  };

  const handleResumeExecution = () => {
    setExecutionStatus('running');
    runNextExecutionStep();
  };

  const handleCancelExecution = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    setExecutionStatus('idle');
    setActiveExecution(null);
    setCurrentWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => ({ ...n, status: 'idle' })),
    }));
  };

  return (
    <div
      className="flex flex-col h-screen w-screen bg-[#09090b] text-zinc-100 overflow-hidden font-sans antialiased"
      style={{ direction: ['ar', 'ur', 'he'].includes(lang) ? 'rtl' : 'ltr' }}
    >
      {/* 1. Header Navigation Bar */}
      <header className="h-14 border-b border-zinc-800 bg-[#0c0c0e]/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0 relative z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/25">
            <Icons.Wand2 className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-cyan-300">
              FlowForge AI
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wide leading-none">
              Automation Workspace Studio
            </p>
          </div>
        </div>

        {/* Global Nav Menu */}
        <nav className="flex gap-1 bg-zinc-900/50 border border-zinc-800/80 p-1 rounded-xl overflow-x-auto custom-scrollbar">
          {[
            { id: 'canvas', label: getTranslation(lang, 'canvas'), icon: 'LayoutGrid' },
            { id: 'analytics', label: getTranslation(lang, 'analytics'), icon: 'BarChart' },
            { id: 'marketplace', label: getTranslation(lang, 'marketplace'), icon: 'ShoppingBag' },
            { id: 'ai_agents', label: getTranslation(lang, 'aiAgents'), icon: 'Bot' },
            { id: 'ai_settings', label: getTranslation(lang, 'aiSettings'), icon: 'Cpu' },
            { id: 'admin', label: getTranslation(lang, 'admin'), icon: 'ShieldCheck' },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => {
                setActiveNav(nav.id as any);
                setSelectedNodeId(null);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                activeNav === nav.id
                  ? 'bg-blue-600 text-white shadow shadow-blue-600/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {React.createElement((Icons as any)[nav.icon] || Icons.HelpCircle, { className: 'w-3.5 h-3.5' })}
              {nav.label}
            </button>
          ))}
        </nav>

        {/* Saved Workflows Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs text-zinc-300">
            <Icons.Folder className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={currentWorkflow.id}
              onChange={(e) => {
                const selected = workflows.find((w) => w.id === e.target.value);
                if (selected) {
                  setCurrentWorkflow(selected);
                  setSelectedNodeId(null);
                }
              }}
              className="bg-transparent text-zinc-200 text-xs font-bold focus:outline-none cursor-pointer"
            >
              {workflows.map((w) => (
                <option key={w.id} value={w.id} className="bg-zinc-950 text-zinc-200">
                  {w.name}
                </option>
              ))}
              {workflows.length === 0 && (
                <option value="">Scratchpad Flow</option>
              )}
            </select>
          </div>

          <button
            onClick={() => handleSaveWorkflow()}
            className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 rounded-xl transition-all text-zinc-300 hover:text-white"
            title="Save Blueprint"
          >
            <Icons.Save className="w-4 h-4" />
          </button>

          {currentWorkflow.id && (
            <button
              onClick={() => handleDeleteWorkflow(currentWorkflow.id)}
              className="p-2 bg-zinc-900/40 border border-rose-950/40 hover:bg-rose-950/10 rounded-xl transition-all text-rose-500"
              title="Delete Blueprint"
            >
              <Icons.Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Studio Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeNav === 'canvas' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar (Drag items catalog) */}
            <Sidebar
              onLoadTemplate={handleLoadTemplate}
              onGenerateWorkflowAI={handleGenerateWorkflowAI}
              isGeneratingAI={isGeneratingAI}
              activeTab={activeSidebarTab}
              setActiveTab={setActiveSidebarTab}
            />

            {/* Main workflow builder space */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
              <Canvas
                nodes={currentWorkflow.nodes}
                connections={currentWorkflow.connections}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
                onAddNode={handleAddNode}
                onDeleteNode={handleDeleteNode}
                onAddConnection={handleAddConnection}
                onDeleteConnection={handleDeleteConnection}
                onUpdateNodePosition={handleUpdateNodePosition}
                executionStatus={executionStatus}
              />

              {/* Bottom execution monitoring log panel */}
              <ExecutionPanel
                logs={logs}
                activeExecution={activeExecution}
                onExecute={handleExecuteWorkflow}
                onPause={handlePauseExecution}
                onResume={handleResumeExecution}
                onCancel={handleCancelExecution}
                executionStatus={executionStatus}
                executionSpeed={executionSpeed}
                setExecutionSpeed={setExecutionSpeed}
              />
            </div>

            {/* Node Parameter Editor (Slided Drawer) */}
            {selectedNodeId && (
              <NodeEditor
                node={currentWorkflow.nodes.find((n) => n.id === selectedNodeId) || null}
                onUpdateProperties={handleUpdateNodeProperties}
                onClose={() => setSelectedNodeId(null)}
              />
            )}
          </div>
        )}

        {/* 3. Full-screen views */}
        {activeNav === 'analytics' && (
          <AnalyticsDashboard
            workflowsCount={workflows.length}
            logs={logs}
            onClose={() => setActiveNav('canvas')}
          />
        )}

        {activeNav === 'admin' && (
          <AdminPanel onClose={() => setActiveNav('canvas')} />
        )}

        {activeNav === 'ai_settings' && (
          <AISettingsPanel onClose={() => setActiveNav('canvas')} />
        )}

        {activeNav === 'ai_agents' && (
          <AgentsPanel
            onClose={() => setActiveNav('canvas')}
            lang={lang}
            onLanguageChange={(newLang) => setLang(newLang)}
          />
        )}

        {activeNav === 'marketplace' && (
          <Marketplace
            onClose={() => setActiveNav('canvas')}
            onInstallTemplate={handleLoadTemplate}
          />
        )}
      </div>
    </div>
  );
}
