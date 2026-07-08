/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getTranslation, SUPPORTED_LANGUAGES } from './LanguageLocalization';

interface Agent {
  id: string;
  name: string;
  category: 'productivity' | 'support' | 'creative' | 'engineering' | 'professional';
  desc: string;
  icon: string;
  color: string;
  rating: string;
  installs: string;
  systemPrompt?: string;
  temperature?: number;
  model?: string;
  tools?: string[];
}

interface AgentsPanelProps {
  onClose: () => void;
  lang: string;
  onLanguageChange: (lang: string) => void;
}

export default function AgentsPanel({ onClose, lang, onLanguageChange }: AgentsPanelProps) {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'builder' | 'collab' | 'enterprise'>('marketplace');
  const [marketFilter, setMarketFilter] = useState<'all' | 'productivity' | 'support' | 'creative' | 'engineering' | 'professional'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Agent Builder state
  const [builderName, setBuilderName] = useState('');
  const [builderDesc, setBuilderDesc] = useState('');
  const [builderCategory, setBuilderCategory] = useState<'productivity' | 'support' | 'creative' | 'engineering' | 'professional'>('productivity');
  const [builderPrompt, setBuilderPrompt] = useState('You are a helpful AI Agent designed for specific corporate operations.');
  const [builderTemp, setBuilderTemp] = useState(0.7);
  const [builderModel, setBuilderModel] = useState('gemini-3.5-flash');
  const [builderAvatar, setBuilderAvatar] = useState('Cpu');
  const [builderColor, setBuilderColor] = useState('text-blue-400 bg-blue-500/10');
  const [builderTools, setBuilderTools] = useState<string[]>(['memory', 'web_search']);
  const [knowledgeFiles, setKnowledgeFiles] = useState<{ name: string; size: string }[]>([]);
  const [crawlUrl, setCrawlUrl] = useState('');
  
  // Custom installed list (seeds + newly built)
  const [installedAgents, setInstalledAgents] = useState<string[]>([
    'a-1', 'a-2', 'a-15', 'a-18', 'a-40' // default installs
  ]);

  // Collaboration state
  const [teamAgents, setTeamAgents] = useState<string[]>(['a-15', 'a-18', 'a-40']); // Selected agents for team
  const [supervisorId, setSupervisorId] = useState('a-15');
  const [plannerId, setPlannerId] = useState('a-18');
  const [sharedMemoryEnabled, setSharedMemoryEnabled] = useState(true);
  const [collabPrompt, setCollabPrompt] = useState('Analyze our database sales records, create a comprehensive marketing strategy, and write a localized LinkedIn post draft in English and Hindi.');
  const [collabLogs, setCollabLogs] = useState<{ sender: string; avatar: string; text: string; role?: string; time: string; pendingApproval?: boolean }[]>([]);
  const [isCollabRunning, setIsCollabRunning] = useState(false);

  // Enterprise tab mock states
  const [workspaceName, setWorkspaceName] = useState('FlowForge Enterprise HQ');
  const [domainName, setDomainName] = useState('forge.mycompany.com');
  const [brandingColor, setBrandingColor] = useState('#4f46e5');
  const [teamsList, setTeamsList] = useState([
    { name: 'Sravan Kumar (You)', email: 'bommanaboinasravankumar2@gmail.com', role: 'Owner', access: 'All Workspaces' },
    { name: 'John Doe', email: 'john@flowforge.ai', role: 'Admin', access: 'Marketing & Engineering' },
    { name: 'Jane Smith', email: 'jane@flowforge.ai', role: 'Developer', access: 'Sandbox Operations' }
  ]);
  const [auditLogs, setAuditLogs] = useState([
    { id: 'l-1', time: '11:10:55', user: 'Sravan Kumar', action: 'API Router Hook updated', status: 'Success' },
    { id: 'l-2', time: '11:08:42', user: 'Sravan Kumar', action: 'Failover Routing triggered: Ollama (Offline)', status: 'Warning' },
    { id: 'l-3', time: '10:45:12', user: 'John Doe', action: 'Workspace billing tier validated', status: 'Success' }
  ]);

  // PWA & Mobile Install trigger mock
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // 50 Pre-built AI Agents list
  const prebuiltAgents: Agent[] = [
    // Productivity (6)
    { id: 'a-1', name: 'Personal Assistant', category: 'productivity', desc: 'Manage agendas, draft replies, and summarize emails seamlessly.', icon: 'User', color: 'text-blue-400 bg-blue-500/10', rating: '4.9', installs: '18,240' },
    { id: 'a-34', name: 'Calendar Assistant', category: 'productivity', desc: 'Intelligently schedule meetings and identify calendar slot conflicts.', icon: 'Calendar', color: 'text-teal-400 bg-teal-500/10', rating: '4.8', installs: '9,120' },
    { id: 'a-35', name: 'Meeting Assistant', category: 'productivity', desc: 'Transcribe recordings, capture minutes, and automatically assign action tasks.', icon: 'Video', color: 'text-indigo-400 bg-indigo-500/10', rating: '4.7', installs: '8,430' },
    { id: 'a-32', name: 'Travel Planner', category: 'productivity', desc: 'Craft multi-destination travel itineraries, budget flight options, and map hotel stays.', icon: 'Map', color: 'text-amber-400 bg-amber-500/10', rating: '4.6', installs: '4,560' },
    { id: 'a-33', name: 'Shopping Assistant', category: 'productivity', desc: 'Compare retail prices, track historic coupons, and order corporate inventories.', icon: 'ShoppingBag', color: 'text-rose-400 bg-rose-500/10', rating: '4.5', installs: '3,890' },
    { id: 'a-36', name: 'Voice Assistant', category: 'productivity', desc: 'Process verbal instructions with customizable local voice configurations.', icon: 'Mic', color: 'text-violet-400 bg-violet-500/10', rating: '4.9', installs: '11,400' },

    // Support & Sales (5)
    { id: 'a-2', name: 'Customer Support Agent', category: 'support', desc: 'Provide continuous support with dynamic ticketing integrations.', icon: 'MessageSquareText', color: 'text-emerald-400 bg-emerald-500/10', rating: '4.8', installs: '15,820' },
    { id: 'a-3', name: 'Sales Agent', category: 'support', desc: 'Generate high-intent leads, qualify corporate contacts, and secure demo bookings.', icon: 'TrendingUp', color: 'text-sky-400 bg-sky-500/10', rating: '4.9', installs: '14,100' },
    { id: 'a-45', name: 'CRM Agent', category: 'support', desc: 'Maintain complete client profiles and log notes on Salesforce or HubSpot pipelines.', icon: 'Layers', color: 'text-indigo-400 bg-indigo-500/10', rating: '4.7', installs: '6,210' },
    { id: 'a-46', name: 'ERP Agent', category: 'support', desc: 'Coordinate resource planning, logistics, inventories, and manufacturing logs.', icon: 'Network', color: 'text-pink-400 bg-pink-500/10', rating: '4.6', installs: '4,150' },
    { id: 'a-13', name: 'Email Assistant', category: 'support', desc: 'Automate outbound sequences, handle newsletter bounces, and organize cold leads.', icon: 'Mail', color: 'text-orange-400 bg-orange-500/10', rating: '4.8', installs: '12,940' },

    // Marketing & Creative (13)
    { id: 'a-4', name: 'Marketing Agent', category: 'creative', desc: 'Devise optimized marketing campaigns and analyze competitor ad spending.', icon: 'Tv', color: 'text-pink-400 bg-pink-500/10', rating: '4.7', installs: '9,450' },
    { id: 'a-5', name: 'SEO Agent', category: 'creative', desc: 'Audit keyword volumes, optimize metadata tags, and generate backlinks directories.', icon: 'Search', color: 'text-purple-400 bg-purple-500/10', rating: '4.8', installs: '10,210' },
    { id: 'a-6', name: 'Content Writer', category: 'creative', desc: 'Draft long-form blog articles, whitepapers, and brand case studies.', icon: 'FileText', color: 'text-cyan-400 bg-cyan-500/10', rating: '4.9', installs: '19,550' },
    { id: 'a-7', name: 'Social Media Manager', category: 'creative', desc: 'Schedule social campaigns and track viral engagement across multiple hubs.', icon: 'Share2', color: 'text-yellow-400 bg-yellow-500/10', rating: '4.6', installs: '8,120' },
    { id: 'a-8', name: 'LinkedIn Assistant', category: 'creative', desc: 'Write targeted B2B industry updates and build personal thought-leadership.', icon: 'Linkedin', color: 'text-blue-500 bg-blue-500/10', rating: '4.8', installs: '14,230' },
    { id: 'a-9', name: 'YouTube Assistant', category: 'creative', desc: 'Create video scripts, design descriptions, and suggest high-CTR thumbnails.', icon: 'Youtube', color: 'text-rose-600 bg-rose-500/10', rating: '4.7', installs: '9,840' },
    { id: 'a-10', name: 'Instagram Assistant', category: 'creative', desc: 'Generate visually descriptive image prompts, hashtags arrays, and caption drafts.', icon: 'Instagram', color: 'text-fuchsia-400 bg-fuchsia-500/10', rating: '4.6', installs: '7,430' },
    { id: 'a-11', name: 'Facebook Assistant', category: 'creative', desc: 'Manage community posts, draft organic feed shares, and reply to page reviews.', icon: 'Facebook', color: 'text-blue-600 bg-blue-500/10', rating: '4.5', installs: '5,100' },
    { id: 'a-12', name: 'X (Twitter) Assistant', category: 'creative', desc: 'Formulate viral threads, punchy announcements, and monitor real-time trends.', icon: 'Twitter', color: 'text-sky-300 bg-sky-500/10', rating: '4.8', installs: '13,290' },
    { id: 'a-37', name: 'Image Generation Agent', category: 'creative', desc: 'Synthesize customized visuals, marketing banners, and illustrations.', icon: 'Image', color: 'text-violet-400 bg-violet-500/10', rating: '4.9', installs: '16,500' },
    { id: 'a-38', name: 'Video Generation Agent', category: 'creative', desc: 'Translate storyboards to cinematic video frames and edit promotional reels.', icon: 'PlaySquare', color: 'text-emerald-400 bg-emerald-500/10', rating: '4.7', installs: '7,120' },
    { id: 'a-28', name: 'Resume Builder', category: 'creative', desc: 'Audit CV layouts, optimize skills keywords, and craft custom cover letters.', icon: 'FileUser', color: 'text-teal-400 bg-teal-500/10', rating: '4.8', installs: '8,400' },
    { id: 'a-30', name: 'Translator', category: 'creative', desc: 'Translate content accurately across 40+ corporate system languages.', icon: 'Languages', color: 'text-blue-400 bg-blue-500/10', rating: '4.9', installs: '21,430' },

    // Engineering & Code (14)
    { id: 'a-15', name: 'Coding Assistant', category: 'engineering', desc: 'Generate scalable TypeScript, Python, and C++ code modules on instruction.', icon: 'Code2', color: 'text-blue-400 bg-blue-500/10', rating: '4.9', installs: '25,120' },
    { id: 'a-16', name: 'Debugging Agent', category: 'engineering', desc: 'Analyze stacktraces, fix security vulnerabilities, and resolve syntax errors.', icon: 'Bug', color: 'text-rose-400 bg-rose-500/10', rating: '4.8', installs: '18,450' },
    { id: 'a-17', name: 'Software Architect', category: 'engineering', desc: 'Design microservices architecture plans and coordinate database schemas.', icon: 'GitMerge', color: 'text-yellow-400 bg-yellow-500/10', rating: '4.9', installs: '11,890' },
    { id: 'a-18', name: 'Data Analyst', category: 'engineering', desc: 'Run math equations, index CSV spreadsheets, and generate interactive charts.', icon: 'BarChart3', color: 'text-purple-400 bg-purple-500/10', rating: '4.8', installs: '14,500' },
    { id: 'a-39', name: 'Automation Builder', category: 'engineering', desc: 'Assemble complex node structures and configure webhook routes.', icon: 'Workflow', color: 'text-indigo-400 bg-indigo-500/10', rating: '4.7', installs: '9,340' },
    { id: 'a-40', name: 'RAG Agent', category: 'engineering', desc: 'Index vector directories and retrieve context for accurate conversations.', icon: 'Compass', color: 'text-sky-400 bg-sky-500/10', rating: '4.8', installs: '13,500' },
    { id: 'a-41', name: 'Knowledge Base Agent', category: 'engineering', desc: 'Scan local directories, index wiki nodes, and build internal Q&A assets.', icon: 'BookOpen', color: 'text-emerald-400 bg-emerald-500/10', rating: '4.6', installs: '8,400' },
    { id: 'a-42', name: 'Document AI Agent', category: 'engineering', desc: 'Perform Optical Character Recognition (OCR) on forms, receipts, and invoices.', icon: 'ScanFace', color: 'text-pink-400 bg-pink-500/10', rating: '4.7', installs: '7,890' },
    { id: 'a-43', name: 'PDF Analysis Agent', category: 'engineering', desc: 'Parse extensive contracts, compare legal files, and highlight terms.', icon: 'FileJson', color: 'text-orange-400 bg-orange-500/10', rating: '4.8', installs: '11,120' },
    { id: 'a-44', name: 'Spreadsheet Agent', category: 'engineering', desc: 'Formulate complex Excel/Sheets expressions and organize grid matrices.', icon: 'Table', color: 'text-green-400 bg-green-500/10', rating: '4.7', installs: '10,950' },
    { id: 'a-47', name: 'GitHub Agent', category: 'engineering', desc: 'Monitor branch updates, audit open pull requests, and review commits.', icon: 'Github', color: 'text-slate-300 bg-slate-500/10', rating: '4.8', installs: '12,410' },
    { id: 'a-48', name: 'DevOps Agent', category: 'engineering', desc: 'Optimize CI/CD workflows, manage Dockerfiles, and monitor container deployments.', icon: 'Server', color: 'text-amber-400 bg-amber-500/10', rating: '4.7', installs: '8,920' },
    { id: 'a-49', name: 'Database Agent', category: 'engineering', desc: 'Write optimized SQL queries, manage database migrations, and trace latency.', icon: 'Database', color: 'text-violet-400 bg-violet-500/10', rating: '4.8', installs: '11,450' },
    { id: 'a-50', name: 'Cybersecurity Agent', category: 'engineering', desc: 'Audit application endpoints, test APIs for vulnerabilities, and trace security risks.', icon: 'ShieldCheck', color: 'text-red-400 bg-red-500/10', rating: '4.9', installs: '9,810' },

    // Professional & Industry (12)
    { id: 'a-19', name: 'Finance Agent', category: 'professional', desc: 'Track stock indexes, calculate business ROIs, and model cost projections.', icon: 'Wallet', color: 'text-emerald-400 bg-emerald-500/10', rating: '4.8', installs: '10,120' },
    { id: 'a-20', name: 'Accounting Agent', category: 'professional', desc: 'Automate tax filings, compute balance sheets, and audit business receipts.', icon: 'Receipt', color: 'text-blue-400 bg-blue-500/10', rating: '4.7', installs: '7,450' },
    { id: 'a-21', name: 'HR Agent', category: 'professional', desc: 'Coordinate onboard schedules, manage leave records, and explain payroll structures.', icon: 'Users', color: 'text-indigo-400 bg-indigo-500/10', rating: '4.6', installs: '6,120' },
    { id: 'a-22', name: 'Recruitment Agent', category: 'professional', desc: 'Source promising profiles, schedule interviews, and draft offer proposals.', icon: 'UserPlus', color: 'text-amber-400 bg-amber-500/10', rating: '4.8', installs: '9,230' },
    { id: 'a-23', name: 'Legal Assistant', category: 'professional', desc: 'Review active contracts, check local compliance, and note potential liability clauses.', icon: 'Scale', color: 'text-red-400 bg-red-500/10', rating: '4.7', installs: '5,940' },
    { id: 'a-24', name: 'Healthcare Assistant', category: 'professional', desc: 'Explain symptoms dictionaries and coordinate appointment calendars.', icon: 'HeartPulse', color: 'text-rose-400 bg-rose-500/10', rating: '4.8', installs: '6,810' },
    { id: 'a-25', name: 'Education Assistant', category: 'professional', desc: 'Create study guidelines, design lesson tests, and score paper answers.', icon: 'GraduationCap', color: 'text-purple-400 bg-purple-500/10', rating: '4.7', installs: '8,420' },
    { id: 'a-26', name: 'Tutor Agent', category: 'professional', desc: 'Explain advanced physics, calculus equations, and coding patterns directly.', icon: 'Award', color: 'text-teal-400 bg-teal-500/10', rating: '4.8', installs: '9,110' },
    { id: 'a-27', name: 'Student Assistant', category: 'professional', desc: 'Format citations indices, proofread essays, and synthesize lectures notes.', icon: 'BookOpenCheck', color: 'text-orange-400 bg-orange-500/10', rating: '4.6', installs: '11,400' },
    { id: 'a-29', name: 'Interview Coach', category: 'professional', desc: 'Conduct mock interviews, trace speech delays, and optimize resume stories.', icon: 'CheckSquare', color: 'text-yellow-400 bg-yellow-500/10', rating: '4.7', installs: '7,810' },
    { id: 'a-31', name: 'News Agent', category: 'professional', desc: 'Summarize major international events, monitor target tickers, and compile news updates.', icon: 'Globe', color: 'text-cyan-400 bg-cyan-500/10', rating: '4.6', installs: '8,950' },
    { id: 'a-14', name: 'Research Agent', category: 'professional', desc: 'Scrape academic engines, collect citations, and compile literature summaries.', icon: 'GlassWater', color: 'text-violet-400 bg-violet-500/10', rating: '4.9', installs: '14,120' }
  ];

  // Filter & Search Prebuilt Agents
  const filteredPrebuilt = prebuiltAgents.filter(agent => {
    const matchCat = marketFilter === 'all' || agent.category === marketFilter;
    const matchSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        agent.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleInstallAgent = (id: string) => {
    if (installedAgents.includes(id)) return;
    setInstalledAgents(prev => [...prev, id]);
  };

  const handleUninstallAgent = (id: string) => {
    setInstalledAgents(prev => prev.filter(x => x !== id));
    setTeamAgents(prev => prev.filter(x => x !== id));
  };

  // Add custom constructed agent to prebuilt array
  const handleSaveCustomAgent = () => {
    if (!builderName) return;
    const customId = 'custom-' + Math.random().toString(36).substring(2, 9);
    const newAgent: Agent = {
      id: customId,
      name: builderName,
      category: builderCategory,
      desc: builderDesc || 'Highly tailored enterprise agent optimized for custom prompts.',
      icon: builderAvatar,
      color: builderColor,
      rating: '5.0',
      installs: '1 (Local)',
      systemPrompt: builderPrompt,
      temperature: builderTemp,
      model: builderModel,
      tools: builderTools
    };

    // Auto-install newly built agent
    setInstalledAgents(prev => [...prev, customId]);
    prebuiltAgents.unshift(newAgent); // Add to local memory pool
    
    // Clear Builder Form
    setBuilderName('');
    setBuilderDesc('');
    setBuilderPrompt('You are a helpful AI Agent designed for specific corporate operations.');
    alert('Agent successfully saved, compiled, and registered into active workspace!');
    setActiveTab('marketplace');
  };

  // Run team collaboration simulation
  const handleTriggerCollab = async () => {
    if (teamAgents.length === 0) return;
    setIsCollabRunning(true);
    setCollabLogs([]);

    const selectedObjects = prebuiltAgents.filter(a => teamAgents.includes(a.id));
    const supervisorObj = prebuiltAgents.find(a => a.id === supervisorId) || selectedObjects[0];
    const plannerObj = prebuiltAgents.find(a => a.id === plannerId) || selectedObjects[1] || selectedObjects[0];
    
    // Staggered simulation
    setTimeout(() => {
      setCollabLogs(prev => [...prev, {
        sender: supervisorObj.name,
        avatar: supervisorObj.icon,
        role: 'Supervisor Agent',
        text: `[Task Delegation] Received request: "${collabPrompt}". Coordinating team collaboration. Initiating strategic breakdown...`,
        time: '11:18:31'
      }]);
    }, 800);

    setTimeout(() => {
      setCollabLogs(prev => [...prev, {
        sender: plannerObj.name,
        avatar: plannerObj.icon,
        role: 'Planner Agent',
        text: `[Execution Plan Formulation] Analyzed requirements. Steps plotted: (1) Query databases for latest numbers, (2) Outline core marketing trends, (3) Synthesize draft across localized translation buffers.`,
        time: '11:18:33'
      }]);
    }, 2000);

    setTimeout(() => {
      const execObj = selectedObjects.find(a => a.id !== supervisorId && a.id !== plannerId) || selectedObjects[0];
      setCollabLogs(prev => [...prev, {
        sender: execObj.name,
        avatar: execObj.icon,
        role: 'Executor Agent',
        text: `[Database Processing] Scanning tables. Success: identified $42,500 quarterly marketing pipelines. Generating localized summaries...`,
        time: '11:18:35'
      }]);
    }, 3200);

    setTimeout(() => {
      // Trigger human approval gate!
      setCollabLogs(prev => [...prev, {
        sender: 'Workflow Security Guard',
        avatar: 'ShieldCheck',
        role: 'Human Gatekeeper',
        text: `[Action Required] The agents have drafted the proposed marketing copy. FlowForge pipeline has triggered a strict Human Approval step. Please review and authorize the LinkedIn post.`,
        time: '11:18:37',
        pendingApproval: true
      }]);
      setIsCollabRunning(false);
    }, 4500);
  };

  const handleApproveStep = () => {
    setCollabLogs(prev => [
      ...prev.map(log => log.pendingApproval ? { ...log, pendingApproval: false } : log),
      {
        sender: 'FlowForge Automation',
        avatar: 'Check',
        role: 'Orchestrator Hub',
        text: `🟢 [Approved] LinkedIn post published, email summaries transmitted to team, and audit database successfully updated!`,
        time: '11:18:39'
      }
    ]);
  };

  return (
    <div className="flex-1 bg-zinc-950 text-zinc-100 p-6 overflow-y-auto custom-scrollbar flex flex-col h-full space-y-6 select-none" style={{ direction: ['ar', 'ur', 'he'].includes(lang) ? 'rtl' : 'ltr' }}>
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-800/80 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <Icons.Cpu className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                {getTranslation(lang, 'aiAgents')}
              </h2>
              <p className="text-xs text-zinc-400">
                {getTranslation(lang, 'subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Global Multi-Language Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-1.5">
            <Icons.Globe className="w-4 h-4 text-zinc-400" />
            <select
              value={lang}
              onChange={(e) => {
                onLanguageChange(e.target.value);
                const isRTL = ['ar', 'ur', 'he'].includes(e.target.value);
                document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
              }}
              className="bg-transparent border-none text-xs text-zinc-200 outline-none focus:ring-0 font-medium cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-zinc-900 text-zinc-100">
                  {l.native} ({l.name})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-750 transition-all rounded-xl text-xs font-bold text-zinc-200 flex items-center gap-1.5"
          >
            <Icons.LayoutGrid className="w-4 h-4" />
            {getTranslation(lang, 'backToCanvas')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-850/60 pb-px gap-1.5 overflow-x-auto">
        {[
          { id: 'marketplace', label: 'Agents Marketplace (50+ Prebuilt)', icon: 'ShoppingBag' },
          { id: 'builder', label: 'No-Code Agent Builder', icon: 'Wand2' },
          { id: 'collab', label: 'Multi-Agent Team Arena', icon: 'Network' },
          { id: 'enterprise', label: 'Enterprise & PWA Settings', icon: 'Building2' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x transition-all flex items-center gap-2 shrink-0 ${
              activeTab === tab.id
                ? 'bg-zinc-900 border-zinc-800 text-white shadow-lg'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
            }`}
          >
            {React.createElement((Icons as any)[tab.icon] || Icons.HelpCircle, { className: 'w-4 h-4' })}
            {tab.label}
          </button>
        ))}
      </div>

      {/* RENDER TAB CONTENTS */}

      {/* 1. AGENTS MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Icons.Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder={getTranslation(lang, 'searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 placeholder-zinc-500 transition-colors"
              />
            </div>

            {/* Categories */}
            <div className="flex bg-zinc-900 border border-zinc-800/80 p-1 rounded-xl gap-1 w-full sm:w-auto overflow-x-auto custom-scrollbar">
              {[
                { id: 'all', label: 'All Domains' },
                { id: 'productivity', label: 'Productivity' },
                { id: 'support', label: 'Support & Sales' },
                { id: 'creative', label: 'Marketing' },
                { id: 'engineering', label: 'Engineering' },
                { id: 'professional', label: 'Professional' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setMarketFilter(btn.id as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                    marketFilter === btn.id
                      ? 'bg-zinc-800 text-white shadow'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPrebuilt.map((agent) => {
              const isInstalled = installedAgents.includes(agent.id);
              const isCustom = agent.id.startsWith('custom-');
              const iconComp = React.createElement((Icons as any)[agent.icon] || Icons.Cpu, {
                className: 'w-5 h-5'
              });

              return (
                <div
                  key={agent.id}
                  className="p-5 bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 rounded-2xl flex flex-col justify-between hover:shadow-xl transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
                        {agent.category}
                      </span>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-mono">
                        <Icons.Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <strong>{agent.rating}</strong>
                        <span className="text-zinc-700">•</span>
                        {agent.installs} installs
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 ${agent.color}`}>
                        {iconComp}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-extrabold text-zinc-100 truncate">
                          {agent.name}
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-medium font-mono">
                          {isCustom ? 'Active Workspace Agent' : 'FlowForge Verified'}
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed min-h-12">
                      {agent.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Icons.ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                        Offline Safe
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isInstalled ? (
                        <>
                          <button
                            onClick={() => handleUninstallAgent(agent.id)}
                            className="p-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-rose-900/30 rounded-xl text-zinc-400 hover:text-rose-400 transition-colors"
                            title="Uninstall Agent"
                          >
                            <Icons.Trash2 className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-1">
                            <Icons.Check className="w-3.5 h-3.5" /> Installed
                          </span>
                        </>
                      ) : (
                        <button
                          onClick={() => handleInstallAgent(agent.id)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center gap-1.5"
                        >
                          <Icons.Download className="w-4 h-4" />
                          <span>Install Agent</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. NO-CODE AGENT BUILDER */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Builder Form Settings (Col 7) */}
          <div className="lg:col-span-7 bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <div className="border-b border-zinc-850 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Configure Autonomous Custom Agent</h3>
                <p className="text-[10px] text-zinc-500">Design agent characteristics, tools parameters, and memory settings.</p>
              </div>
              <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded uppercase">
                Interactive compiler
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Agent Identity Label</label>
                <input
                  type="text"
                  placeholder="e.g. Sales Forecast Analyst"
                  value={builderName}
                  onChange={(e) => setBuilderName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">System Classification</label>
                <select
                  value={builderCategory}
                  onChange={(e) => setBuilderCategory(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
                >
                  <option value="productivity">Core & Productivity</option>
                  <option value="support">Support & Sales</option>
                  <option value="creative">Marketing & Creative</option>
                  <option value="engineering">Engineering & Code</option>
                  <option value="professional">Professional & Industry</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Aesthetic Description</label>
                <input
                  type="text"
                  placeholder="e.g. Analyzes historical pipeline CSV files and constructs localized email drafts."
                  value={builderDesc}
                  onChange={(e) => setBuilderDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Autonomous System Instructions (Prompt)</label>
                <textarea
                  rows={4}
                  value={builderPrompt}
                  onChange={(e) => setBuilderPrompt(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700 font-mono"
                />
              </div>

              {/* Model & Temperature */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Core Language Model Model</label>
                <select
                  value={builderModel}
                  onChange={(e) => setBuilderModel(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
                >
                  <option value="gemini-3.5-flash">Google Gemini 3.5 Flash (Recommended)</option>
                  <option value="gemini-3.1-pro-preview">Google Gemini 3.1 Pro (Heavy Reasoning)</option>
                  <option value="gpt-4o-mini">OpenAI GPT-4o Mini</option>
                  <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                  <option value="llama3.2:3b">Llama 3.2 (Local Ollama Sandbox)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase flex justify-between">
                  <span>Creativity Temperature</span>
                  <span className="font-mono text-blue-400">{builderTemp}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1.2"
                  step="0.1"
                  value={builderTemp}
                  onChange={(e) => setBuilderTemp(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 my-3"
                />
              </div>
            </div>

            {/* Tool Selection */}
            <div className="space-y-2 border-t border-zinc-850 pt-4">
              <span className="text-[10px] font-bold text-zinc-400 uppercase block">Enable Agent Action Tools</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'memory', label: 'Long-term Memory Buffer', icon: 'Database' },
                  { id: 'web_search', label: 'RAG Web Scraper Engine', icon: 'Globe' },
                  { id: 'code_interpreter', label: 'Secure Sandbox Interpreter', icon: 'Code2' },
                  { id: 'file_reader', label: 'File & PDF Parser SDK', icon: 'FileText' },
                  { id: 'translation', label: 'Multi-Language Translator', icon: 'Languages' },
                  { id: 'image_gen', label: 'Image Synthesizer Tool', icon: 'Image' }
                ].map((tool) => {
                  const active = builderTools.includes(tool.id);
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setBuilderTools(prev => 
                          prev.includes(tool.id) ? prev.filter(x => x !== tool.id) : [...prev, tool.id]
                        );
                      }}
                      className={`p-2 rounded-xl border text-left text-[11px] transition-all flex items-center gap-1.5 ${
                        active 
                          ? 'bg-indigo-600/10 border-indigo-500 text-white font-semibold' 
                          : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {React.createElement((Icons as any)[tool.icon] || Icons.Settings, { className: 'w-3.5 h-3.5 shrink-0' })}
                      <span className="truncate">{tool.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Avatar Select */}
            <div className="space-y-2 border-t border-zinc-850 pt-4">
              <span className="text-[10px] font-bold text-zinc-400 uppercase block">Custom Identity Badge Design</span>
              <div className="flex gap-2.5 items-center">
                {/* Avatars */}
                <div className="flex gap-1 bg-zinc-950 p-1.5 rounded-xl border border-zinc-850">
                  {['Cpu', 'User', 'Bot', 'Wand2', 'Code2', 'BarChart3', 'ShieldCheck', 'TrendingUp'].map((iconName) => (
                    <button
                      key={iconName}
                      onClick={() => setBuilderAvatar(iconName)}
                      className={`p-1.5 rounded-lg transition-all ${
                        builderAvatar === iconName ? 'bg-zinc-800 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {React.createElement((Icons as any)[iconName] || Icons.HelpCircle, { className: 'w-4 h-4' })}
                    </button>
                  ))}
                </div>

                {/* Colors */}
                <div className="flex gap-1 bg-zinc-950 p-1.5 rounded-xl border border-zinc-850">
                  {[
                    { style: 'text-blue-400 bg-blue-500/10', label: 'Blue' },
                    { style: 'text-emerald-400 bg-emerald-500/10', label: 'Emerald' },
                    { style: 'text-pink-400 bg-pink-500/10', label: 'Rose' },
                    { style: 'text-purple-400 bg-purple-500/10', label: 'Violet' },
                    { style: 'text-amber-400 bg-amber-500/10', label: 'Gold' }
                  ].map((colorObj) => (
                    <button
                      key={colorObj.style}
                      onClick={() => setBuilderColor(colorObj.style)}
                      className={`w-4.5 h-4.5 rounded-full transition-all border ${
                        builderColor === colorObj.style ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: colorObj.style.includes('blue') ? '#3b82f6' : colorObj.style.includes('emerald') ? '#10b981' : colorObj.style.includes('pink') ? '#ec4899' : colorObj.style.includes('purple') ? '#8b5cf6' : '#f59e0b' }}
                      title={colorObj.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveCustomAgent}
                disabled={!builderName}
                className="px-5 py-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white rounded-xl shadow shadow-indigo-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.Cpu className="w-4 h-4 text-white" />
                Compile & Register Agent
              </button>
            </div>
          </div>

          {/* Builder Knowledge Upload & Web Crawling (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Knowledge Base Area */}
            <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-200 flex items-center gap-1.5">
                <Icons.Database className="w-4 h-4 text-emerald-400" />
                Knowledge Base (RAG Vault)
              </h4>
              <p className="text-[10px] text-zinc-500">
                Upload business knowledge assets, guidelines, PDF reports, or sheets to enable direct semantic citation grounding.
              </p>

              {/* Upload area */}
              <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl p-6 text-center space-y-2 cursor-pointer transition-all bg-zinc-950/20 group">
                <Icons.UploadCloud className="w-8 h-8 text-zinc-600 group-hover:text-zinc-400 mx-auto transition-colors" />
                <div>
                  <span className="text-xs font-bold text-zinc-300 block">Drag & Drop files or select</span>
                  <span className="text-[9px] text-zinc-500 block">Supports PDF, CSV, TXT, DOCX, XLSX (Max 100MB)</span>
                </div>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="knowledge-upload"
                  onChange={(e) => {
                    if (e.target.files) {
                      const list = Array.from(e.target.files).map((f: any) => ({ name: f.name, size: (f.size / 1024).toFixed(1) + ' KB' }));
                      setKnowledgeFiles(prev => [...prev, ...list]);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('knowledge-upload')?.click()}
                  className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-300"
                >
                  Browse Files
                </button>
              </div>

              {/* Uploaded Files list */}
              {knowledgeFiles.length > 0 && (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Indexed Assets ({knowledgeFiles.length})</span>
                  {knowledgeFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-zinc-950 border border-zinc-850/60 rounded-lg">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Icons.FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="text-[11px] text-zinc-300 font-mono truncate">{file.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">{file.size}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Website Crawler */}
              <div className="space-y-2 border-t border-zinc-850 pt-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block">Active Web Crawler</span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://docs.mycompany.com/api"
                    value={crawlUrl}
                    onChange={(e) => setCrawlUrl(e.target.value)}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!crawlUrl) return;
                      alert(`Initiated active crawl on ${crawlUrl}. Indexed 14 core subpaths.`);
                      setKnowledgeFiles(prev => [...prev, { name: `Crawl Hub: ${new URL(crawlUrl).hostname}`, size: '14 Webpages' }]);
                      setCrawlUrl('');
                    }}
                    className="px-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold text-zinc-200 rounded-xl transition-all"
                  >
                    Crawl
                  </button>
                </div>
              </div>
            </div>

            {/* Prompt testing playground */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                <Icons.HeartPulse className="w-4 h-4 text-blue-400" />
                Live Handshake Preview
              </h4>
              <div className="p-3 bg-zinc-950 border border-zinc-850/60 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Agent Response Draft</span>
                <p className="text-[11px] text-zinc-400 font-mono italic">
                  "{builderName || 'Unnamed Agent'} is compiled with {builderTools.length} tools. Grounded against {knowledgeFiles.length} documentation assets."
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 3. MULTI-AGENT TEAM ARENA */}
      {activeTab === 'collab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Team Configuration (Col 4) */}
          <div className="lg:col-span-4 bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-200 flex items-center gap-1.5">
              <Icons.ShieldCheck className="w-4 h-4 text-violet-400" />
              Team Configuration
            </h3>
            <p className="text-[10px] text-zinc-500">
              Select installed workspace agents and map their hierarchical roles to create a robust execution chain.
            </p>

            {/* Select Agents checkboxes */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase block">Installed Workspace Agents</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar p-2 bg-zinc-950 border border-zinc-850/60 rounded-xl">
                {prebuiltAgents.filter(a => installedAgents.includes(a.id)).map((agent) => {
                  const checked = teamAgents.includes(agent.id);
                  return (
                    <label key={agent.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-900 cursor-pointer text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setTeamAgents(prev =>
                              prev.includes(agent.id) ? prev.filter(x => x !== agent.id) : [...prev, agent.id]
                            );
                          }}
                          className="rounded border-zinc-800 text-indigo-600 focus:ring-0 bg-zinc-900 w-3.5 h-3.5"
                        />
                        <span className="truncate text-zinc-200 font-semibold">{agent.name}</span>
                      </div>
                      <span className="text-[9px] uppercase bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">
                        {agent.category}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Roles mapping */}
            {teamAgents.length > 0 && (
              <div className="space-y-3 border-t border-zinc-850 pt-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block">Map Orchestration Roles</span>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Supervisor Agent:</span>
                    <select
                      value={supervisorId}
                      onChange={(e) => setSupervisorId(e.target.value)}
                      className="bg-zinc-950 border border-zinc-850 rounded-lg p-1 text-[11px] text-zinc-200"
                    >
                      {prebuiltAgents.filter(a => teamAgents.includes(a.id)).map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Planner Agent:</span>
                    <select
                      value={plannerId}
                      onChange={(e) => setPlannerId(e.target.value)}
                      className="bg-zinc-950 border border-zinc-850 rounded-lg p-1 text-[11px] text-zinc-200"
                    >
                      {prebuiltAgents.filter(a => teamAgents.includes(a.id)).map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Long term memory toggle */}
                <label className="flex items-center gap-2 cursor-pointer text-xs pt-2">
                  <input
                    type="checkbox"
                    checked={sharedMemoryEnabled}
                    onChange={(e) => setSharedMemoryEnabled(e.target.checked)}
                    className="rounded border-zinc-850 text-indigo-600 bg-zinc-950 w-3.5 h-3.5"
                  />
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Icons.Cpu className="w-3.5 h-3.5 text-violet-400" />
                    <span>Enable Team Shared Memory Vault</span>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Execution & Chat Simulation Logs (Col 8) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Input Prompt Panel */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-zinc-300 block">Input Unified Multi-Agent Objective</span>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={collabPrompt}
                  onChange={(e) => setCollabPrompt(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <button
                  onClick={handleTriggerCollab}
                  disabled={isCollabRunning || teamAgents.length < 2}
                  className="px-5 py-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white rounded-xl shadow shadow-indigo-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isCollabRunning ? (
                    <>
                      <Icons.Loader2 className="w-4 h-4 animate-spin" />
                      Orchestrating...
                    </>
                  ) : (
                    <>
                      <Icons.Play className="w-4 h-4" />
                      Convene Team
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-zinc-500">Requires at least 2 active team agents to initiate supervisor-planner pipeline loops.</p>
            </div>

            {/* Chat Arena Canvas */}
            <div className="bg-zinc-950 border border-zinc-850 rounded-2xl h-96 flex flex-col justify-between overflow-hidden">
              <div className="bg-zinc-900/60 border-b border-zinc-850 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-extrabold text-zinc-200">Active Multi-Agent Sandbox Lounge</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase">
                  Trace execution pipeline
                </span>
              </div>

              {/* Chat Output area */}
              <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3.5">
                {collabLogs.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-zinc-500">
                    <Icons.Bot className="w-10 h-10 text-zinc-700 animate-bounce" />
                    <p className="text-xs italic">Assemble workspace agents and click "Convene Team" to begin the pipeline simulation.</p>
                  </div>
                )}

                {collabLogs.map((log, lIdx) => (
                  <div key={lIdx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-zinc-900 border border-zinc-800 rounded text-indigo-400">
                          {React.createElement((Icons as any)[log.avatar] || Icons.Bot, { className: 'w-3.5 h-3.5' })}
                        </div>
                        <span className="text-xs font-bold text-white">{log.sender}</span>
                        {log.role && (
                          <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono px-1.5 py-0.5 rounded">
                            {log.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-600 font-mono">{log.time}</span>
                    </div>

                    <div className="pl-8 text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-900">
                      {log.text}
                    </div>

                    {/* Human Approval Step Banner */}
                    {log.pendingApproval && (
                      <div className="mt-3 pl-8">
                        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-3">
                          <div className="flex items-center gap-2">
                            <Icons.AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                            <span className="text-xs font-bold text-amber-400">Manual Validation Gate Activated</span>
                          </div>
                          <p className="text-[11px] text-zinc-400">Review LinkedIn newsletter copy buffer: "FlowForge marks $42k quarterly growth pipeline under universal redundancy rules. Offline mode fully safe."</p>
                          <div className="flex gap-2">
                            <button
                              onClick={handleApproveStep}
                              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs rounded-lg transition-all"
                            >
                              Approve & Publish
                            </button>
                            <button
                              onClick={() => {
                                setCollabLogs(prev => [
                                  ...prev.map(l => l.pendingApproval ? { ...l, pendingApproval: false } : l),
                                  { sender: 'System Guard', avatar: 'X', role: 'Security Node', text: '🔴 Manual approval rejected by supervisor owner Sravan Kumar.', time: '11:18:38' }
                                ]);
                              }}
                              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 rounded-lg transition-all"
                            >
                              Reject Draft
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 4. ENTERPRISE & PWA SETTINGS */}
      {activeTab === 'enterprise' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Organization & White label (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Workspaces & Team members */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-200 flex items-center gap-1.5">
                <Icons.Building2 className="w-4 h-4 text-indigo-400" />
                Organizations & Active Teams (RBAC)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Enterprise Workspace Name</label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">White-Label Custom Domain</label>
                  <input
                    type="text"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Members Table */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Role-Based Access Members</span>
                <div className="overflow-hidden border border-zinc-850/60 rounded-xl bg-zinc-950/40 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase text-[9px] tracking-wider border-b border-zinc-850">
                      <tr>
                        <th className="p-3">Member Name</th>
                        <th className="p-3">Role Type</th>
                        <th className="p-3">Permissions Scope</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850/40 text-zinc-300">
                      {teamsList.map((m, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/10 font-mono text-[11px]">
                          <td className="p-3">
                            <span className="text-white font-bold block">{m.name}</span>
                            <span className="text-[10px] text-zinc-500 block">{m.email}</span>
                          </td>
                          <td className="p-3 text-indigo-400 font-semibold">{m.role}</td>
                          <td className="p-3 text-zinc-400">{m.access}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-200 flex items-center gap-1.5">
                <Icons.Activity className="w-4 h-4 text-emerald-400" />
                Real-time Corporate Security Audit Logs
              </h3>

              <div className="space-y-2 font-mono text-[11px] p-4 bg-zinc-950 rounded-xl border border-zinc-850/60 max-h-48 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex justify-between items-start gap-4 p-1.5 hover:bg-zinc-900/30 rounded border-b border-zinc-900">
                    <div className="flex gap-2">
                      <span className="text-zinc-500 shrink-0">[{log.time}]</span>
                      <span className="text-white font-bold shrink-0">{log.user}:</span>
                      <span className="text-zinc-300">{log.action}</span>
                    </div>
                    <span className={`px-1.5 rounded text-[10px] ${
                      log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* PWA & Billing Tier (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* PWA Installer */}
            <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-200 flex items-center gap-1.5">
                <Icons.Smartphone className="w-4 h-4 text-rose-400" />
                Mobile & Progressive Web App (PWA)
              </h4>
              <p className="text-[10px] text-zinc-500">
                Configure FlowForge on your mobile home-screen. Enabling offline syncing indexes schemas into standard IndexedDB.
              </p>

              <div className="p-4 bg-zinc-950/40 border border-zinc-850 rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
                    <Icons.Download className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-white block">Download FlowForge PWA</span>
                    <span className="text-[10px] text-zinc-500 block">Offline Mode, background execution logs, and push notification handshakes.</span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      setPwaInstalled(true);
                      alert('FlowForge installed successfully on your dashboard app drawer!');
                    }}
                    disabled={pwaInstalled}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 rounded-xl transition-all disabled:opacity-50"
                  >
                    {pwaInstalled ? 'FlowForge Installed (IndexedDB Active)' : 'Install Desktop / Mobile App'}
                  </button>
                </div>
              </div>

              {/* Simulated Offline Switch */}
              <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-850/60">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Simulate Offline Environment</span>
                  <span className="text-[9px] text-zinc-500 block">Test IndexedDB schema queues.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOffline}
                    onChange={(e) => {
                      setIsOffline(e.target.checked);
                      if (e.target.checked) {
                        alert('System Offline! Diverting write queries into localized localForage storage buffers.');
                      } else {
                        alert('System back Online! Syncing client logs queue to central PostgreSQL DB.');
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>
            </div>

            {/* Metered billing */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-200 flex items-center gap-1.5">
                <Icons.CreditCard className="w-4 h-4 text-emerald-400" />
                Metered Billing & API Quotas
              </h4>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-400">Monthly Shared Tokens:</span>
                    <span className="text-zinc-200 font-mono">1.4M / 10M Limit</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-900">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '14%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-400">Total Run Executions:</span>
                    <span className="text-zinc-200 font-mono">428 / 5,000 Limit</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-900">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '8.5%' }} />
                  </div>
                </div>

                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-850/60 text-[10px] text-zinc-500 flex justify-between items-center">
                  <span>Current Subscription Tier: <strong>PRO (Workspace)</strong></span>
                  <span className="text-indigo-400 font-bold">$49/month billed</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
