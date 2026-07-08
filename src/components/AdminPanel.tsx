/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as Icons from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'billing' | 'marketplace' | 'audit'>('users');

  // Seeded admin data
  const users = [
    { name: 'Sravan Kumar', email: 'bommanaboinasravankumar2@gmail.com', role: 'Owner', status: 'Active', plan: 'Enterprise Pro', fa: '2FA Enabled' },
    { name: 'Sarah Connor', email: 'sarah.c@sky.net', role: 'Developer', status: 'Active', plan: 'Free Tier', fa: 'SMS Fallback' },
    { name: 'John Doe', email: 'john@acme.org', role: 'Editor', status: 'Suspended', plan: 'Developer', fa: 'Disabled' },
    { name: 'Alice Cooper', email: 'alice.c@music.co', role: 'Billing Admin', status: 'Active', plan: 'Enterprise', fa: 'Authenticator App' },
  ];

  const plans = [
    { name: 'Sandbox Starter', price: '$0', desc: 'Perfect for local workflows prototyping', features: ['5 Active Workflows', '1,000 runs/mo', '1-minute execution delay', 'Community Support'] },
    { name: 'Developer Premium', price: '$29/mo', desc: 'For independent developers and consultants', features: ['Unlimited Workflows', '50,000 runs/mo', 'Real-time executions', 'Encrypted Secret variables', '14-day logs persistence', 'Priority SLA'] },
    { name: 'Enterprise Pro', price: '$199/mo', desc: 'Scale automated pipelines with white label limits', features: ['Unlimited Executions', 'Multi-tenant Workspaces', 'Custom White Label Branding', 'SAML SSO Integration', 'Encrypted Secret vaults', 'Dedicated database clustering', 'Premium 24/7 Phone Support'], isPremium: true },
  ];

  const pendingNodes = [
    { name: 'Shopify Checkout Webhook v2', author: 'EcomBuilders', version: '2.1.0', desc: 'Optimized triggers capturing shopify draft cart payment sessions.', approved: false },
    { name: 'OpenSearch Query Node', author: 'ClusterOps', version: '1.0.4', desc: 'Execute elastic search requests with instant memory vector indexing.', approved: false },
  ];

  const [nodesList, setNodesList] = useState(pendingNodes);

  const handleApproveNode = (idx: number) => {
    const updated = [...nodesList];
    updated[idx].approved = true;
    setNodesList(updated);
  };

  const auditLogs = [
    { timestamp: '2026-07-08 10:42:01', action: 'API Key Rotated', actor: 'Sravan Kumar', ip: '192.168.1.114', status: 'Success' },
    { timestamp: '2026-07-08 09:12:35', action: 'Webhook Trigger Fired', actor: 'System Worker', ip: '10.244.0.12', status: 'Info' },
    { timestamp: '2026-07-08 08:00:00', action: 'Database Backup Generated', actor: 'Cron Exec', ip: 'localhost', status: 'Success' },
    { timestamp: '2026-07-07 23:14:10', action: 'Failed Login Attempt', actor: 'unknown@attacker.net', ip: '45.12.89.201', status: 'Warning' },
  ];

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 overflow-y-auto custom-scrollbar flex flex-col h-full space-y-6 select-none">
      {/* Admin Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Icons.ShieldCheck className="w-5 h-5 text-indigo-400" />
            FlowForge Admin Management Panel
          </h2>
          <p className="text-xs text-slate-400">
            Control subscriptions, manage user accounts, review community modules, and inspect security audit events.
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

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-800 gap-1">
        {[
          { id: 'users', label: 'User Management', icon: 'Users' },
          { id: 'billing', label: 'Subscription Plans', icon: 'CreditCard' },
          { id: 'marketplace', label: 'Node Submissions', icon: 'ShoppingBag' },
          { id: 'audit', label: 'Security Audit Logs', icon: 'History' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-indigo-500 text-white bg-indigo-500/[0.03]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {React.createElement((Icons as any)[tab.icon], { className: 'w-4 h-4' })}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">
                Workspace Members (<strong>{users.length}</strong> active)
              </span>
              <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-lg transition-all flex items-center gap-1">
                <Icons.UserPlus className="w-4 h-4" />
                Invite User
              </button>
            </div>

            <div className="overflow-hidden border border-slate-800 rounded-xl bg-slate-900/40">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">User Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Plan Class</th>
                    <th className="p-3">Security (2FA)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((user, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/30">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        {user.name}
                      </td>
                      <td className="p-3 text-slate-400">{user.email}</td>
                      <td className="p-3 font-semibold">{user.role}</td>
                      <td className="p-3">
                        <span className="bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full text-indigo-300">
                          {user.plan}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-400">{user.fa}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2 py-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Select Workspace Infrastructure Tiers
              </h3>
              <p className="text-xs text-slate-400">
                Provision high-performance background workers, dedicated Redis queues, and custom brand capabilities instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plans.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-6 border rounded-2xl flex flex-col justify-between hover:shadow-2xl transition-all relative ${
                    p.isPremium
                      ? 'border-indigo-500 bg-indigo-500/[0.02] shadow-[0_0_20px_rgba(99,102,241,0.05)]'
                      : 'border-slate-800 bg-slate-900/30'
                  }`}
                >
                  {p.isPremium && (
                    <span className="absolute -top-3 right-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-[9px] font-extrabold uppercase px-3 py-1 rounded-full text-white shadow-md tracking-wider">
                      ★ Active Plan
                    </span>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-100">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">{p.desc}</p>
                    </div>

                    <div className="flex items-baseline gap-1.5 border-b border-slate-800/60 pb-4">
                      <span className="text-2xl font-black text-white">{p.price}</span>
                      {p.price !== '$0' && <span className="text-xs text-slate-400">/ user</span>}
                    </div>

                    <ul className="space-y-2 text-[11px] text-slate-300">
                      {p.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-center gap-2">
                          <Icons.Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    disabled={p.isPremium}
                    className={`mt-6 w-full py-2.5 text-xs font-bold rounded-xl transition-all ${
                      p.isPremium
                        ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:scale-[1.02]'
                    }`}
                  >
                    {p.isPremium ? 'Currently Active' : `Upgrade to ${p.name}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              Pending Community Node Pull Requests
            </h3>

            <div className="space-y-3">
              {nodesList.map((node, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-white">{node.name}</span>
                      <span className="bg-slate-800 text-[10px] font-bold text-indigo-300 px-2 py-0.5 rounded-full">
                        v{node.version}
                      </span>
                      <span className="text-[10px] text-slate-400">by {node.author}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">{node.desc}</p>
                  </div>

                  <div className="flex gap-2">
                    {node.approved ? (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1 border border-emerald-500/20">
                        <Icons.Check className="w-3.5 h-3.5" />
                        Approved & Live
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleApproveNode(idx)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Icons.Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setNodesList(nodesList.filter((_, i) => i !== idx));
                          }}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-rose-500/20 text-xs font-bold text-slate-400 hover:text-rose-400 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Icons.X className="w-3.5 h-3.5" />
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {nodesList.length === 0 && (
                <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs italic">
                  All community node extensions reviewed and cleared. Node marketplace queue is empty!
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              System Audit Event Log
            </h3>

            <div className="overflow-hidden border border-slate-800 rounded-xl bg-slate-900/40">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Action Event</th>
                    <th className="p-3">Authorized Actor</th>
                    <th className="p-3">Container IP Address</th>
                    <th className="p-3">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {auditLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/20">
                      <td className="p-3 text-slate-400">{log.timestamp}</td>
                      <td className="p-3 text-white font-bold">{log.action}</td>
                      <td className="p-3 font-semibold text-indigo-300">{log.actor}</td>
                      <td className="p-3 text-slate-400">{log.ip}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            log.status === 'Success'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : log.status === 'Warning'
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'bg-blue-500/10 text-blue-400'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
