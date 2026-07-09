/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WorkflowNode, NodeDefinition } from '../types';
import { NODE_DEFINITIONS } from '../data/nodeDefinitions';
import * as Icons from 'lucide-react';
import { apiFetch } from '../mockApi';

interface NodeEditorProps {
  node: WorkflowNode | null;
  onUpdateProperties: (nodeId: string, properties: Record<string, any>) => void;
  onClose: () => void;
}

export default function NodeEditor({ node, onUpdateProperties, onClose }: NodeEditorProps) {
  const [providers, setProviders] = React.useState<any[]>([]);

  React.useEffect(() => {
    apiFetch('/api/ai-providers')
      .then((res) => {
        if (res.ok) return res.json();
        return [];
      })
      .then((data) => setProviders(data))
      .catch((err) => console.error(err));
  }, [node?.id]);

  if (!node) return null;

  const nodeDef = NODE_DEFINITIONS.find((n) => n.type === node.type);
  if (!nodeDef) return null;

  const handlePropertyChange = (propertyName: string, value: any) => {
    onUpdateProperties(node.id, {
      ...node.properties,
      [propertyName]: value,
    });
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : <Icons.HelpCircle className="w-5 h-5" />;
  };

  return (
    <div className="w-80 border-l border-zinc-800 bg-[#0c0c0e]/95 backdrop-blur-xl flex flex-col h-full text-zinc-100 shadow-2xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/80 bg-zinc-950/20">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="p-1.5 rounded-lg shrink-0"
            style={{
              backgroundColor: `${nodeDef.color}20`,
              color: nodeDef.color,
            }}
          >
            {getIconComponent(nodeDef.icon)}
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-zinc-100 truncate">
              {node.label}
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono tracking-tight truncate">
              ID: {node.id}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <Icons.X className="w-4 h-4" />
        </button>
      </div>

      {/* Configuration Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        {/* Node Metadata (Label editor) */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Node Label
          </label>
          <input
            type="text"
            value={node.label}
            onChange={(e) => onUpdateProperties(node.id, { ...node.properties, _label: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-medium transition-colors"
            placeholder="Name your node"
          />
        </div>

        {/* Dynamic Properties */}
        <div className="space-y-4 pt-4 border-t border-zinc-800/60">
          <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Node Settings
          </h4>

          {nodeDef.properties.map((prop) => {
            const currentVal = node.properties[prop.name] ?? prop.defaultValue ?? '';

            return (
              <div key={prop.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-200">
                    {prop.label}
                    {prop.required && <span className="text-rose-500 ml-0.5">*</span>}
                  </label>
                </div>

                {prop.type === 'string' && (
                  <input
                    type="text"
                    value={currentVal}
                    onChange={(e) => handlePropertyChange(prop.name, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                  />
                )}

                {prop.type === 'number' && (
                  <input
                    type="number"
                    value={currentVal}
                    onChange={(e) => handlePropertyChange(prop.name, Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                  />
                )}

                {prop.type === 'select' && (
                  <select
                    value={currentVal}
                    onChange={(e) => handlePropertyChange(prop.name, e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    {prop.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {prop.type === 'textarea' && (
                  <textarea
                    rows={4}
                    value={currentVal}
                    onChange={(e) => handlePropertyChange(prop.name, e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 leading-relaxed transition-colors resize-none"
                  />
                )}

                {prop.type === 'code' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                      <span>JavaScript ES6 environment</span>
                      <Icons.Terminal className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <textarea
                      rows={12}
                      value={currentVal}
                      onChange={(e) => handlePropertyChange(prop.name, e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[11px] font-mono text-blue-200 focus:outline-none focus:border-blue-500 leading-normal transition-colors resize-y custom-scrollbar"
                    />
                  </div>
                )}

                {prop.description && (
                  <p className="text-[10px] text-zinc-400 leading-normal">
                    {prop.description}
                  </p>
                )}
              </div>
            );
          })}
          
          {/* AI Specific routing options if node is an AI node */}
          {(node.type === 'gemini_ai' || node.type === 'openai_ai' || node.type.startsWith('ai_')) && (
            <div className="space-y-4 pt-4 border-t border-zinc-800/60">
              <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                AI Execution Routing
              </h4>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-200">
                  Target AI Provider
                </label>
                <select
                  value={node.properties.provider || 'gemini'}
                  onChange={(e) => {
                    const provId = e.target.value;
                    const matchedProv = providers.find(p => p.id === provId || p.type === provId);
                    const defaultModel = matchedProv?.models[0] || '';
                    onUpdateProperties(node.id, {
                      ...node.properties,
                      provider: provId,
                      model: defaultModel,
                    });
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.isActive ? '(Active)' : '(Inactive)'}
                    </option>
                  ))}
                  {providers.length === 0 && (
                    <option value="prov-gemini">Google Gemini</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-200">
                  Target Model Tag
                </label>
                <select
                  value={node.properties.model || ''}
                  onChange={(e) => handlePropertyChange('model', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  {(providers.find(p => p.id === (node.properties.provider || 'gemini') || p.type === (node.properties.provider || 'gemini'))?.models || ['gemini-3.5-flash', 'gemini-3.1-pro-preview']).map((m: string) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced info helper */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/20 text-[10px] text-zinc-400 leading-relaxed flex items-start gap-2">
        <Icons.ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          Variables inside double braces (e.g. <code>{"{{input}}"}</code>) are compiled and interpolated automatically at runtime using downstream data nodes.
        </span>
      </div>
    </div>
  );
}
