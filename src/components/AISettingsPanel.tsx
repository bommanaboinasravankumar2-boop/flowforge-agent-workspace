/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { AIProvider, AIFallbackRule } from '../types';
import { apiFetch } from '../mockApi';

interface AISettingsPanelProps {
  onClose: () => void;
}

export default function AISettingsPanel({ onClose }: AISettingsPanelProps) {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [rules, setRules] = useState<AIFallbackRule[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null);
  
  // Loading and testing states
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string; latency?: number }>>({});
  const [discoveringId, setDiscoveringId] = useState<string | null>(null);

  // New Rule Form State
  const [triggerProvId, setTriggerProvId] = useState('');
  const [fallbackProvId, setFallbackProvId] = useState('');
  const [fallbackModel, setFallbackModel] = useState('');

  // Fetch Providers and Rules
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [provRes, ruleRes] = await Promise.all([
        apiFetch('/api/ai-providers'),
        apiFetch('/api/fallback-rules')
      ]);
      
      if (provRes.ok) {
        const provs = await provRes.json();
        setProviders(provs);
        if (provs.length > 0) {
          setSelectedProvider(provs[0]);
        }
      }
      
      if (ruleRes.ok) {
        const fallbackRules = await ruleRes.json();
        setRules(fallbackRules);
      }
    } catch (e) {
      console.error('Error fetching AI configurations:', e);
    } finally {
      setLoading(false);
    }
  };

  // Save Provider
  const handleSaveProvider = async (prov: AIProvider) => {
    try {
      const res = await apiFetch('/api/ai-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prov),
      });
      if (res.ok) {
        const updated = await res.json();
        setProviders(prev => prev.map(p => p.id === updated.id ? updated : p));
        setSelectedProvider(updated);
        // Show success animation or toast
      }
    } catch (e) {
      console.error('Error saving provider:', e);
    }
  };

  // Test Connection
  const handleTestConnection = async (prov: AIProvider) => {
    setTestingId(prov.id);
    try {
      const res = await apiFetch('/api/ai-providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: prov }),
      });
      if (res.ok) {
        const data = await res.json();
        setTestResults(prev => ({
          ...prev,
          [prov.id]: {
            success: data.success,
            message: data.message,
            latency: data.latency
          }
        }));
      }
    } catch (e) {
      setTestResults(prev => ({
        ...prev,
        [prov.id]: {
          success: false,
          message: 'Failed to contact verification endpoint.'
        }
      }));
    } finally {
      setTestingId(null);
    }
  };

  // Discover Models
  const handleDiscoverModels = async (prov: AIProvider) => {
    setDiscoveringId(prov.id);
    try {
      const res = await apiFetch('/api/ai-providers/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: prov }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.models) {
          const updated = { ...prov, models: data.models };
          await handleSaveProvider(updated);
        }
      }
    } catch (e) {
      console.error('Model discovery failed:', e);
    } finally {
      setDiscoveringId(null);
    }
  };

  // Add Fallback Rule
  const handleAddRule = async () => {
    if (!triggerProvId || !fallbackProvId || !fallbackModel) return;
    
    const newRule: AIFallbackRule = {
      id: 'rule-' + Math.random().toString(36).substr(2, 9),
      triggerProviderId: triggerProvId,
      fallbackProviderId: fallbackProvId,
      fallbackModel: fallbackModel
    };

    const updatedRules = [...rules, newRule];
    setRules(updatedRules);

    try {
      await apiFetch('/api/fallback-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRules),
      });
      // Clear form
      setTriggerProvId('');
      setFallbackProvId('');
      setFallbackModel('');
    } catch (e) {
      console.error('Error saving fallback rules:', e);
    }
  };

  // Delete Fallback Rule
  const handleDeleteRule = async (ruleId: string) => {
    const updatedRules = rules.filter(r => r.id !== ruleId);
    setRules(updatedRules);

    try {
      await apiFetch('/api/fallback-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRules),
      });
    } catch (e) {
      console.error('Error deleting fallback rule:', e);
    }
  };

  const handleAddCustomProvider = async () => {
    const name = prompt('Enter a friendly label for your custom AI provider (e.g. Together AI, Perplexity, DeepSeek-Custom):');
    if (!name) return;
    
    const newProv: AIProvider = {
      id: 'prov-' + Math.random().toString(36).substr(2, 9),
      name: name,
      type: 'custom',
      baseUrl: 'https://api.together.xyz/v1',
      apiKey: '',
      models: ['custom-model-tag-1'],
      isActive: true,
      isCustom: true
    };

    try {
      const res = await apiFetch('/api/ai-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProv),
      });
      if (res.ok) {
        const saved = await res.json();
        setProviders(prev => [...prev, saved]);
        setSelectedProvider(saved);
      }
    } catch (e) {
      console.error('Error adding custom provider:', e);
    }
  };

  const handleDeleteProvider = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom provider?')) return;
    try {
      const res = await apiFetch(`/api/ai-providers/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProviders(prev => prev.filter(p => p.id !== id));
        if (selectedProvider?.id === id) {
          setSelectedProvider(providers.find(p => p.id !== id) || null);
        }
      }
    } catch (e) {
      console.error('Error deleting provider:', e);
    }
  };

  return (
    <div className="flex-1 bg-zinc-950 text-zinc-100 p-6 overflow-y-auto custom-scrollbar flex flex-col h-full space-y-6 select-none">
      
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Icons.Cpu className="w-5 h-5 text-blue-400" />
            Universal AI Model Support Workspace
          </h2>
          <p className="text-xs text-zinc-400">
            Configure enterprise cloud models, connect local models (Ollama, LM Studio), discover tags, test latency, and coordinate automatic failover rules.
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all rounded-xl text-xs font-bold text-zinc-200 flex items-center gap-1.5"
        >
          <Icons.LayoutGrid className="w-4 h-4" />
          Back to Canvas
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-20">
          <Icons.Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-xs text-zinc-400 font-mono">Loading active AI network infrastructure...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Provider List (Col 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">AI Model Providers</span>
              <button
                onClick={handleAddCustomProvider}
                className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[10px] font-bold text-blue-400 flex items-center gap-1.5 rounded-lg transition-all"
              >
                <Icons.Plus className="w-3 h-3" />
                Add Custom
              </button>
            </div>

            <div className="space-y-2">
              {providers.map((p) => {
                const test = testResults[p.id];
                const isSelected = selectedProvider?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProvider(p)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 relative overflow-hidden ${
                      isSelected
                        ? 'bg-zinc-900 border-zinc-700 shadow-lg shadow-blue-500/[0.02]'
                        : 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/60'
                    }`}
                  >
                    {/* Status Glow Indicator */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${p.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                        <h3 className="text-xs font-bold text-white tracking-wide">{p.name}</h3>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {p.isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProvider(p.id);
                            }}
                            className="p-1 hover:bg-rose-950/30 text-zinc-500 hover:text-rose-400 rounded transition-colors"
                            title="Remove Custom Endpoint"
                          >
                            <Icons.Trash className="w-3 h-3" />
                          </button>
                        )}
                        <span className="text-[9px] font-mono uppercase bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                          {p.type}
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-zinc-500 font-mono truncate">
                      {p.type === 'ollama' || p.type === 'lmstudio' || p.type === 'custom' ? (p.baseUrl || 'No Endpoint URL') : 'Secure Cloud API'}
                    </p>

                    <div className="flex items-center justify-between border-t border-zinc-800/60 pt-2 mt-1">
                      <div className="flex items-center gap-1.5">
                        <Icons.Compass className="w-3 h-3 text-zinc-400" />
                        <span className="text-[10px] text-zinc-400">{p.models.length} Models available</span>
                      </div>
                      
                      {/* Latency result badge */}
                      {test && (
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                          test.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {test.success ? `${test.latency || 42}ms` : 'offline'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Provider Editor and Fallback Rules (Col 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Selected Provider Panel */}
            {selectedProvider && (
              <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Icons.Settings className="w-4 h-4 text-blue-400" />
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-200">
                      Edit Provider Settings: {selectedProvider.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-[10px] text-zinc-400 font-bold cursor-pointer flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={selectedProvider.isActive}
                        onChange={(e) => {
                          const updated = { ...selectedProvider, isActive: e.target.checked };
                          handleSaveProvider(updated);
                        }}
                        className="rounded border-zinc-700 text-blue-600 focus:ring-0 bg-zinc-950 w-3.5 h-3.5"
                      />
                      Active In Pipeline
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Provider Label</label>
                    <input
                      type="text"
                      value={selectedProvider.name}
                      onChange={(e) => {
                        setSelectedProvider({ ...selectedProvider, name: e.target.value });
                      }}
                      onBlur={() => handleSaveProvider(selectedProvider)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  {/* Type select */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Architecture Type</label>
                    <select
                      value={selectedProvider.type}
                      disabled={!selectedProvider.isCustom}
                      onChange={(e) => {
                        setSelectedProvider({ ...selectedProvider, type: e.target.value as any });
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
                    >
                      <option value="gemini">Google Gemini (Official)</option>
                      <option value="openai">OpenAI Cloud API</option>
                      <option value="anthropic">Anthropic Claude</option>
                      <option value="ollama">Ollama (Local Server)</option>
                      <option value="groq">Groq Cloud Platform</option>
                      <option value="lmstudio">LM Studio (Local Server)</option>
                      <option value="openrouter">OpenRouter API</option>
                      <option value="deepseek">DeepSeek Cloud API</option>
                      <option value="mistral">Mistral AI Cloud</option>
                      <option value="cohere">Cohere AI Platform</option>
                      <option value="custom">Custom (OpenAI-Compatible)</option>
                    </select>
                  </div>

                  {/* Base URL (only relevant for local/custom) */}
                  {(selectedProvider.type === 'ollama' || selectedProvider.type === 'lmstudio' || selectedProvider.type === 'openrouter' || selectedProvider.type === 'custom') && (
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Target Endpoint Base URL</label>
                      <input
                        type="text"
                        value={selectedProvider.baseUrl || ''}
                        onChange={(e) => {
                          setSelectedProvider({ ...selectedProvider, baseUrl: e.target.value });
                        }}
                        onBlur={() => handleSaveProvider(selectedProvider)}
                        placeholder="e.g. http://localhost:11434"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
                      />
                    </div>
                  )}

                  {/* API Key (Cloud providers) */}
                  {selectedProvider.type !== 'ollama' && selectedProvider.type !== 'lmstudio' && (
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase flex justify-between items-center">
                        <span>Secret API Key</span>
                        {selectedProvider.type === 'gemini' && (
                          <span className="text-[8px] bg-blue-500/15 text-blue-400 px-1 py-0.5 rounded font-mono">
                            Auto-Injected from Secrets
                          </span>
                        )}
                      </label>
                      <input
                        type="password"
                        value={selectedProvider.apiKey || ''}
                        placeholder={selectedProvider.type === 'gemini' ? '••••••••••••••••••••••••••••••••••••' : 'Paste API authentication token'}
                        onChange={(e) => {
                          setSelectedProvider({ ...selectedProvider, apiKey: e.target.value });
                        }}
                        onBlur={() => handleSaveProvider(selectedProvider)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
                      />
                    </div>
                  )}
                </div>

                {/* Available Models List & Tag Fetcher */}
                <div className="space-y-2 border-t border-zinc-800 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase block">Model Tag Directory</span>
                      <span className="text-[9px] text-zinc-500">Models registered for workflow mappings</span>
                    </div>

                    <button
                      onClick={() => handleDiscoverModels(selectedProvider)}
                      disabled={discoveringId === selectedProvider.id}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg text-[10px] font-bold text-zinc-300 flex items-center gap-1 transition-all"
                    >
                      {discoveringId === selectedProvider.id ? (
                        <>
                          <Icons.Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                          Querying tags...
                        </>
                      ) : (
                        <>
                          <Icons.RefreshCw className="w-3 h-3 text-zinc-400" />
                          Auto-Discover Models
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 p-3 bg-zinc-950 rounded-xl border border-zinc-800/50 min-h-12">
                    {selectedProvider.models.map((model, mIdx) => (
                      <span
                        key={mIdx}
                        className="text-[10px] font-mono px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 flex items-center gap-1"
                      >
                        {model}
                        <button
                          onClick={async () => {
                            const updatedModels = selectedProvider.models.filter(m => m !== model);
                            const updated = { ...selectedProvider, models: updatedModels };
                            setSelectedProvider(updated);
                            await handleSaveProvider(updated);
                          }}
                          className="hover:text-rose-400 transition-colors"
                        >
                          <Icons.X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                    
                    {/* Add model tag manually */}
                    <button
                      onClick={async () => {
                        const mName = prompt('Enter manual model tag identifier (e.g. llama3.2:1b):');
                        if (mName && !selectedProvider.models.includes(mName)) {
                          const updated = { ...selectedProvider, models: [...selectedProvider.models, mName] };
                          setSelectedProvider(updated);
                          await handleSaveProvider(updated);
                        }
                      }}
                      className="text-[10px] px-2 py-1 bg-zinc-900 border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white rounded flex items-center gap-1 transition-all"
                    >
                      <Icons.Plus className="w-3 h-3" /> Add Model Tag
                    </button>
                  </div>
                </div>

                {/* Test Connection Button */}
                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 mt-2">
                  <div className="text-xs text-zinc-400">
                    {testResults[selectedProvider.id] ? (
                      <div className="flex items-center gap-2">
                        {testResults[selectedProvider.id].success ? (
                          <Icons.CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Icons.AlertTriangle className="w-4 h-4 text-rose-500" />
                        )}
                        <span className={testResults[selectedProvider.id].success ? 'text-emerald-400' : 'text-rose-400'}>
                          {testResults[selectedProvider.id].message}
                        </span>
                      </div>
                    ) : (
                      <span>Not verified during this session.</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleTestConnection(selectedProvider)}
                    disabled={testingId === selectedProvider.id}
                    className="px-4 py-2 bg-gradient-to-tr from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-bold text-white rounded-xl transition-all shadow shadow-blue-500/20 flex items-center gap-1.5"
                  >
                    {testingId === selectedProvider.id ? (
                      <>
                        <Icons.Loader2 className="w-4 h-4 animate-spin text-white" />
                        Pinging Endpoint...
                      </>
                    ) : (
                      <>
                        <Icons.Play className="w-3.5 h-3.5 text-white/90 fill-white" />
                        Test Live Handshake
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 2. Failover Policy Rules Section */}
            <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-4">
              <div className="border-b border-zinc-800/80 pb-3">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-200 flex items-center gap-2">
                  <Icons.Workflow className="w-4 h-4 text-violet-400" />
                  Dynamic AI Failover & Redundancy Rules
                </h3>
                <p className="text-[10px] text-zinc-500">
                  Ensure zero pipeline down-time. If an active cloud provider experiences rate limits, outage, or missing credentials, traffic is automatically routed to fallbacks.
                </p>
              </div>

              {/* Rules List Table */}
              {rules.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-xs italic">
                  No redundancy rules mapped yet. Add a rule below to safeguard pipeline executions.
                </div>
              ) : (
                <div className="overflow-hidden border border-zinc-800/60 rounded-xl bg-zinc-950/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase text-[9px] tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="p-3">Primary Trigger Provider</th>
                        <th className="p-3">Route Failover Path</th>
                        <th className="p-3">Target Fallback Provider</th>
                        <th className="p-3">Fallback Model Tag</th>
                        <th className="p-3 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      {rules.map((rule) => {
                        const trigProv = providers.find(p => p.id === rule.triggerProviderId);
                        const fallProv = providers.find(p => p.id === rule.fallbackProviderId);
                        return (
                          <tr key={rule.id} className="hover:bg-zinc-900/20 font-mono text-[11px]">
                            <td className="p-3 font-bold text-white">
                              {trigProv?.name || 'Unknown Primary'}
                            </td>
                            <td className="p-3 text-violet-400 flex items-center gap-1">
                              <Icons.ArrowRightLeft className="w-3 h-3" />
                              <span>Failover</span>
                            </td>
                            <td className="p-3 font-semibold text-zinc-300">
                              {fallProv?.name || 'Unknown Fallback'}
                            </td>
                            <td className="p-3">
                              <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-blue-300">
                                {rule.fallbackModel}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDeleteRule(rule.id)}
                                className="p-1 bg-zinc-900 border border-zinc-800 rounded hover:border-rose-900/50 hover:bg-rose-950/10 text-zinc-400 hover:text-rose-400 transition-colors"
                              >
                                <Icons.Trash className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add Redundancy Rule Form */}
              <div className="p-4 bg-zinc-950/50 border border-zinc-850 rounded-xl space-y-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Add New Pipeline Redundancy Target
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase">If Primary Fails</label>
                    <select
                      value={triggerProvId}
                      onChange={(e) => setTriggerProvId(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="">Select Trigger...</option>
                      {providers.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase">Fallback Destination</label>
                    <select
                      value={fallbackProvId}
                      onChange={(e) => {
                        setFallbackProvId(e.target.value);
                        const prov = providers.find(p => p.id === e.target.value);
                        if (prov && prov.models.length > 0) {
                          setFallbackModel(prov.models[0]);
                        }
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="">Select Fallback...</option>
                      {providers.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase">Target Fallback Model Tag</label>
                    <select
                      value={fallbackModel}
                      onChange={(e) => setFallbackModel(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="">Select Model...</option>
                      {(providers.find(p => p.id === fallbackProvId)?.models || []).map((m, idx) => (
                        <option key={idx} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleAddRule}
                    disabled={!triggerProvId || !fallbackProvId || !fallbackModel}
                    className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 rounded-lg text-xs font-bold text-white flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icons.Plus className="w-3.5 h-3.5" />
                    Register Redundancy Rule
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
