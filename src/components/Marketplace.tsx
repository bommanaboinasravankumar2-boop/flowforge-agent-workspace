/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as Icons from 'lucide-react';

interface MarketplaceProps {
  onClose: () => void;
  onInstallTemplate: (template: any) => void;
}

export default function Marketplace({ onClose, onInstallTemplate }: MarketplaceProps) {
  const [filter, setFilter] = useState<'all' | 'nodes' | 'themes' | 'templates'>('all');
  const [search, setSearch] = useState('');

  // Seeds marketplace listings
  const items = [
    { id: 'm-1', name: 'WooCommerce Order Sync', category: 'nodes', desc: 'Sync customer payments, refunds, and inventories between WooCommerce and Sheets.', author: 'WooDevs', rating: '4.9', installs: '2,940', icon: 'ShoppingBag', color: 'text-amber-400 bg-amber-500/10' },
    { id: 'm-2', name: 'OpenSearch Search Index', category: 'nodes', desc: 'A node to dynamically query, index, and manage OpenSearch vector document vectors.', author: 'SearchLabs', rating: '4.7', installs: '1,280', icon: 'Database', color: 'text-blue-400 bg-blue-500/10' },
    { id: 'm-3', name: 'Retro Cyberpunk Neon Glow', category: 'themes', desc: 'Transform your infinite canvas and nodes with dark neon lasers and glow grid lines.', author: 'HexStyles', rating: '4.8', installs: '840', icon: 'Palette', color: 'text-pink-400 bg-pink-500/10' },
    { id: 'm-4', name: 'Stripe webhook auto CRM logger', category: 'templates', desc: 'A blueprint matching stripe payments to customer records, storing in PostgreSQL and logging in Notion.', author: 'FinOps Team', rating: '5.0', installs: '4,101', icon: 'CreditCard', color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 'm-5', name: 'ElevenLabs Speech Synthesizer', category: 'nodes', desc: 'Convert text results to ultra-realistic AI spoken voices in custom accents.', author: 'VoiceAI', rating: '4.9', installs: '3,212', icon: 'Sparkles', color: 'text-purple-400 bg-purple-500/10' },
    { id: 'm-6', name: 'Swiss Modern Minimalist Slate', category: 'themes', desc: 'An eye-safe, bright slate theme centered around professional margins and crisp text.', author: 'StudioSwiss', rating: '4.5', installs: '320', icon: 'Palette', color: 'text-indigo-400 bg-indigo-500/10' },
  ];

  const [installedIds, setInstalledIds] = useState<string[]>(['m-4']);

  const handleInstall = (itemId: string) => {
    if (installedIds.includes(itemId)) return;
    setInstalledIds([...installedIds, itemId]);
  };

  const filteredItems = items.filter(
    (item) =>
      (filter === 'all' || item.category === filter) &&
      (item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 overflow-y-auto custom-scrollbar flex flex-col h-full space-y-6 select-none">
      {/* Marketplace Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Icons.ShoppingBag className="w-5 h-5 text-indigo-400" />
            FlowForge Community Marketplace
          </h2>
          <p className="text-xs text-slate-400">
            Install custom community node connectors, developer extensions, visual themes, and certified automation blueprints.
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5"
        >
          <Icons.LayoutGrid className="w-4 h-4" />
          Back to Canvas
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Icons.Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search custom nodes, themes, templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500 transition-colors"
          />
        </div>

        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl gap-1 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'nodes', label: 'Nodes & Plugins' },
            { id: 'themes', label: 'Canvas Themes' },
            { id: 'templates', label: 'Templates' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === btn.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Marketplace */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isInstalled = installedIds.includes(item.id);
          const iconComp = React.createElement((Icons as any)[item.icon] || Icons.HelpCircle, {
            className: 'w-5 h-5',
          });

          return (
            <div
              key={item.id}
              className="p-5 bg-slate-900/40 border border-slate-800 hover:border-slate-750 rounded-2xl flex flex-col justify-between hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Icons.Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <strong>{item.rating}</strong>
                    <span className="text-slate-600">•</span>
                    {item.installs} installs
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 ${item.color}`}>
                    {iconComp}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-extrabold text-slate-100 truncate">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium">by {item.author}</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                  <Icons.ShieldCheck className="w-4 h-4 text-emerald-400" />
                  FlowForge Certified
                </span>

                <button
                  onClick={() => handleInstall(item.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    isInstalled
                      ? 'bg-slate-800 text-slate-400 border border-slate-850 cursor-not-allowed flex items-center gap-1.5'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:scale-[1.02] flex items-center gap-1.5'
                  }`}
                >
                  {isInstalled ? (
                    <>
                      <Icons.Check className="w-4 h-4 text-emerald-400" />
                      <span>Installed</span>
                    </>
                  ) : (
                    <>
                      <Icons.Plus className="w-4 h-4" />
                      <span>Install Item</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
