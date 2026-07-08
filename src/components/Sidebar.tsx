/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NODE_DEFINITIONS } from '../data/nodeDefinitions';
import { WORKFLOW_TEMPLATES } from '../data/templates';
import { NodeDefinition, Workflow } from '../types';
import * as Icons from 'lucide-react';

interface SidebarProps {
  onLoadTemplate: (template: any) => void;
  onGenerateWorkflowAI: (prompt: string) => Promise<void>;
  isGeneratingAI: boolean;
  activeTab: 'nodes' | 'templates' | 'ai';
  setActiveTab: (tab: 'nodes' | 'templates' | 'ai') => void;
}

export default function Sidebar({
  onLoadTemplate,
  onGenerateWorkflowAI,
  isGeneratingAI,
  activeTab,
  setActiveTab,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState(
    'When someone fills Google Form, record in Google Sheets, send Telegram alert, generate AI summary with Gemini, and log in Notion.'
  );

  const getIconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : <Icons.HelpCircle className="w-5 h-5" />;
  };

  // Group nodes by category
  const categories = [
    { id: 'trigger', label: 'Triggers', color: 'text-purple-400 bg-purple-500/10' },
    { id: 'ai', label: 'AI Nodes', color: 'text-blue-400 bg-blue-500/10' },
    { id: 'logic', label: 'Logic Nodes', color: 'text-amber-400 bg-amber-500/10' },
    { id: 'database', label: 'Database Nodes', color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 'communication', label: 'Communication Nodes', color: 'text-pink-400 bg-pink-500/10' },
    { id: 'developer', label: 'Developer Nodes', color: 'text-indigo-400 bg-indigo-500/10' },
    { id: 'file', label: 'File Nodes', color: 'text-cyan-400 bg-cyan-500/10' },
  ];

  const filteredNodes = NODE_DEFINITIONS.filter(
    (n) =>
      n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isGeneratingAI) return;
    onGenerateWorkflowAI(aiPrompt);
  };

  return (
    <div className="w-80 border-r border-zinc-800 bg-[#0c0c0e] flex flex-col h-full text-zinc-100 select-none">
      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-800 p-2 gap-1 bg-zinc-950/40">
        <button
          onClick={() => setActiveTab('nodes')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'nodes'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            <Icons.Box className="w-4 h-4" />
            Nodes
          </div>
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'templates'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            <Icons.Layers className="w-4 h-4" />
            Templates
          </div>
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all relative overflow-hidden ${
            activeTab === 'ai'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
          }`}
        >
          <div className="flex items-center justify-center gap-1 relative z-10">
            <Icons.Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            AI Builder
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'nodes' && (
          <div className="space-y-5">
            {/* Search Nodes */}
            <div className="relative">
              <Icons.Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search trigger, AI, DB nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 placeholder-zinc-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
                >
                  <Icons.X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Draggable Info message */}
            <div className="text-[10px] text-zinc-400 border border-zinc-800/60 bg-zinc-900/40 rounded-xl p-3 flex items-start gap-2">
              <Icons.Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Drag and drop</strong> any node onto the canvas to start constructing your automation. Connect nodes by drawing links from output ports to inputs.
              </span>
            </div>

            {/* List of categories and nodes */}
            <div className="space-y-4">
              {categories.map((cat) => {
                const catNodes = filteredNodes.filter((n) => n.category === cat.id);
                if (catNodes.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">
                        {cat.label}
                      </span>
                      <span className="text-[10px] bg-zinc-800/80 px-1.5 py-0.5 rounded-full text-zinc-400">
                        {catNodes.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {catNodes.map((node) => (
                        <div
                          key={node.type}
                          draggable
                          onDragStart={(e) => handleDragStart(e, node.type)}
                          className="group flex items-start gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-800/50 transition-all cursor-grab active:cursor-grabbing hover:shadow-lg hover:shadow-blue-500/[0.02]"
                        >
                          <div
                            className="p-2.5 rounded-xl shrink-0 text-white shadow-md transition-transform group-hover:scale-105"
                            style={{ backgroundColor: `${node.color}25`, border: `1px solid ${node.color}50`, color: node.color }}
                          >
                            {getIconComponent(node.icon)}
                          </div>
                          <div className="space-y-1 min-w-0">
                            <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                              {node.label}
                            </h4>
                            <p className="text-[10px] text-zinc-400 leading-relaxed truncate-2-lines">
                              {node.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-3">
              Standard Blueprints
            </div>

            <div className="space-y-3">
              {WORKFLOW_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-blue-500/50 hover:bg-zinc-900 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                        {tpl.category}
                      </span>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1 shrink-0">
                        <Icons.Download className="w-3 h-3" />
                        {tpl.downloads}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-zinc-200 group-hover:text-blue-300 transition-colors">
                      {tpl.name}
                    </h4>

                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onLoadTemplate(tpl)}
                    className="mt-4 w-full py-1.5 bg-zinc-800 hover:bg-blue-600 text-[11px] font-semibold rounded-lg text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <Icons.FolderPlus className="w-3.5 h-3.5" />
                    Load Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-5">
            <div className="text-center space-y-2 py-2">
              <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl border border-blue-500/30 text-blue-400 shadow-inner">
                <Icons.Wand2 className="w-7 h-7 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                AI Agentic Workflow Forging
              </h3>
              <p className="text-[10px] text-zinc-400 leading-relaxed max-w-[240px] mx-auto">
                Explain your system integrations in natural language, and Gemini will automatically lay out the nodes and draw custom connections.
              </p>
            </div>

            <form onSubmit={handleAISubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Describe Workflow
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. When someone buys a product on Stripe, write a row to PostgreSQL database, send an email confirmation and post on Slack..."
                  disabled={isGeneratingAI}
                  rows={6}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 placeholder-zinc-600 leading-relaxed resize-none focus:ring-1 focus:ring-blue-500/30"
                />
              </div>

              <button
                type="submit"
                disabled={isGeneratingAI || !aiPrompt.trim()}
                className={`w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-bold rounded-xl text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isGeneratingAI ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'
                }`}
              >
                {isGeneratingAI ? (
                  <>
                    <Icons.Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Forging Node Blueprint...</span>
                  </>
                ) : (
                  <>
                    <Icons.Wand2 className="w-4 h-4 text-amber-300" />
                    <span>Forge Workflow with AI</span>
                  </>
                )}
              </button>
            </form>

            <div className="space-y-3 pt-3 border-t border-zinc-800/80">
              <h5 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                Try these prompts:
              </h5>
              <div className="space-y-2">
                {[
                  'When database user signs up, trigger a Gemini sentiment check on bio, and alert Slack if suspicious.',
                  'Every Monday morning, pull metric rows from Postgres, and email me a formatted analytical report.',
                  'Webhook payment trigger, create a folder in Google Drive, download invoice PDF, and create Notion page.',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAiPrompt(prompt)}
                    disabled={isGeneratingAI}
                    className="w-full text-left p-2.5 bg-zinc-900/40 border border-zinc-800/60 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition-all text-[10px] text-zinc-400 hover:text-zinc-200 leading-relaxed"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="p-4 border-t border-zinc-800 text-center bg-zinc-950/20">
        <div className="flex items-center justify-center gap-1 text-zinc-500 text-[10px] font-medium font-mono">
          <span>FlowForge Engine</span>
          <span className="text-emerald-500 animate-pulse">●</span>
          <span>v1.2.0-Alpha</span>
        </div>
      </div>
    </div>
  );
}
