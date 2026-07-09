/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';

// --- MOCK SEED DATA (MIRRORS SERVER.TS) ---

const DEFAULT_PROVIDERS = [
  {
    id: 'prov-gemini',
    name: 'Google Gemini (Official)',
    type: 'gemini',
    apiKey: 'AI_STUDIO_INJECTED_KEY',
    models: ['gemini-3.5-flash', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite', 'gemini-embedding-2-preview'],
    isActive: true
  },
  {
    id: 'prov-openai',
    name: 'OpenAI Cloud API',
    type: 'openai',
    apiKey: '',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo', 'text-embedding-3-small'],
    isActive: false
  },
  {
    id: 'prov-anthropic',
    name: 'Anthropic Claude Engine',
    type: 'anthropic',
    apiKey: '',
    models: ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest', 'claude-3-opus-latest'],
    isActive: false
  },
  {
    id: 'prov-deepseek',
    name: 'DeepSeek Cloud API',
    type: 'deepseek',
    apiKey: '',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    isActive: false
  },
  {
    id: 'prov-mistral',
    name: 'Mistral AI Cloud',
    type: 'mistral',
    apiKey: '',
    models: ['mistral-large-latest', 'mistral-small-latest', 'codestral-latest', 'open-mixtral-8b'],
    isActive: false
  },
  {
    id: 'prov-cohere',
    name: 'Cohere AI Platform',
    type: 'cohere',
    apiKey: '',
    models: ['command-r-plus', 'command-r', 'embed-english-v3.0'],
    isActive: false
  },
  {
    id: 'prov-ollama',
    name: 'Ollama (Local Host)',
    type: 'ollama',
    baseUrl: 'http://localhost:11434',
    models: ['llama3:8b', 'mistral:7b', 'phi3:mini', 'gemma:7b'],
    isActive: true
  },
  {
    id: 'prov-groq',
    name: 'Groq Cloud Platform',
    type: 'groq',
    apiKey: '',
    models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    isActive: false
  },
  {
    id: 'prov-xai',
    name: 'xAI Grok Platform',
    type: 'xai',
    apiKey: '',
    models: ['grok-2-1212', 'grok-2-vision-1212', 'grok-beta'],
    isActive: false
  },
  {
    id: 'prov-lmstudio',
    name: 'LM Studio (Local Host)',
    type: 'lmstudio',
    baseUrl: 'http://localhost:1234',
    models: ['llama-3-8b', 'mistral-7b'],
    isActive: true
  },
  {
    id: 'prov-openrouter',
    name: 'OpenRouter Aggregator',
    type: 'openrouter',
    apiKey: '',
    models: ['meta-llama/llama-3.1-70b-instruct', 'gryphe/mythomax-l2-13b'],
    isActive: false
  },
  {
    id: 'prov-custom',
    name: 'Custom API Endpoint',
    type: 'custom',
    baseUrl: 'https://api.your-custom-endpoint.com/v1',
    apiKey: '',
    models: ['custom-model-v1', 'custom-model-v2'],
    isActive: false,
    isCustom: true
  }
];

const DEFAULT_WORKFLOWS = [
  {
    id: 'template-lead-logger',
    name: 'Omni Lead Capture & Notion Logger',
    description: 'Trigger on Google Forms, record in Google Sheets, broadcast message to Telegram, generate AI review summary, and log into Notion.',
    isActive: true,
    nodes: [
      {
        id: 'node-1',
        type: 'webhook_trigger',
        label: 'Google Form Submission',
        category: 'trigger',
        position: { x: 50, y: 150 },
        properties: { path: 'google-form-intake', method: 'POST' },
      },
      {
        id: 'node-2',
        type: 'google_drive_file',
        label: 'Google Sheets Record',
        category: 'file',
        position: { x: 300, y: 150 },
        properties: { operation: 'upload', folderName: 'Client-Intakes-2026' },
      },
      {
        id: 'node-3',
        type: 'telegram_communication',
        label: 'Send Telegram Alert',
        category: 'communication',
        position: { x: 550, y: 50 },
        properties: { chatId: '123456789', message: '📢 New client signed up!\nName: {{input.name}}\nEmail: {{input.email}}' },
      },
      {
        id: 'node-4',
        type: 'ai_chat',
        label: 'Generate Gemini Summary',
        category: 'ai',
        position: { x: 550, y: 250 },
        properties: {
          prompt: 'Form submission details: {{input}}\n\nProvide a short lead summary.',
          systemInstruction: 'You are a professional assistant.',
          temperature: 0.7,
        },
      },
      {
        id: 'node-5',
        type: 'notion_db',
        label: 'Log inside Notion',
        category: 'database',
        position: { x: 800, y: 250 },
        properties: { databaseId: 'notion_leads_db', title: 'Qualified lead review: {{input}}' },
      },
    ],
    connections: [
      {
        id: 'conn-1-2',
        sourceNodeId: 'node-1',
        sourceOutputIndex: 0,
        targetNodeId: 'node-2',
        targetInputIndex: 0,
      },
      {
        id: 'conn-2-3',
        sourceNodeId: 'node-2',
        sourceOutputIndex: 0,
        targetNodeId: 'node-3',
        targetInputIndex: 0,
      },
      {
        id: 'conn-2-4',
        sourceNodeId: 'node-2',
        sourceOutputIndex: 0,
        targetNodeId: 'node-4',
        targetInputIndex: 0,
      },
      {
        id: 'conn-4-5',
        sourceNodeId: 'node-4',
        sourceOutputIndex: 0,
        targetNodeId: 'node-5',
        targetInputIndex: 0,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  },
  {
    id: 'template-smart-responder',
    name: 'AI Smart Auto-Responder',
    description: 'Listen on Email / Webhook triggers, categorize sentiment with Google Gemini, draft response and send SMTP email automatically.',
    isActive: false,
    nodes: [
      {
        id: 'node-e1',
        type: 'webhook_trigger',
        label: 'Email Ingest Webhook',
        category: 'trigger',
        position: { x: 100, y: 150 },
        properties: { path: 'email-ingest', method: 'POST' },
      },
      {
        id: 'node-e2',
        type: 'ai_chat',
        label: 'Analyze Sentiment & Draft Response',
        category: 'ai',
        position: { x: 380, y: 150 },
        properties: {
          prompt: 'Customer email contents:\n"{{input}}"\n\nEvaluate customer mood and draft response.',
          systemInstruction: 'You are a warm support rep.',
          temperature: 0.5,
        },
      },
      {
        id: 'node-e3',
        type: 'email_communication',
        label: 'Send Draft Email',
        category: 'communication',
        position: { x: 680, y: 150 },
        properties: {
          to: 'customer@example.com',
          subject: 'FlowForge Assistance Response',
          body: '{{input}}',
        },
      },
    ],
    connections: [
      {
        id: 'conn-e1-e2',
        sourceNodeId: 'node-e1',
        sourceOutputIndex: 0,
        targetNodeId: 'node-e2',
        targetInputIndex: 0,
      },
      {
        id: 'conn-e2-e3',
        sourceNodeId: 'node-e2',
        sourceOutputIndex: 0,
        targetNodeId: 'node-e3',
        targetInputIndex: 0,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  },
];

// --- INITIALIZE LOCAL STORAGE ROUTER DATA ---

function initLocalStorage() {
  if (!localStorage.getItem('flowforge_workflows')) {
    localStorage.setItem('flowforge_workflows', JSON.stringify(DEFAULT_WORKFLOWS));
  }
  if (!localStorage.getItem('flowforge_ai_providers')) {
    localStorage.setItem('flowforge_ai_providers', JSON.stringify(DEFAULT_PROVIDERS));
  }
  if (!localStorage.getItem('flowforge_fallback_rules')) {
    localStorage.setItem('flowforge_fallback_rules', JSON.stringify([]));
  }
  if (!localStorage.getItem('flowforge_logs')) {
    localStorage.setItem('flowforge_logs', JSON.stringify([]));
  }
}

// Ensure pre-seeds exist
initLocalStorage();

// --- CLIENT-SIDE AI GENERATOR FALLBACK ---

async function generateWorkflowClientSide(prompt: string): Promise<any> {
  const p = prompt.toLowerCase();
  
  // Custom heuristics based on user query to generate a relevant workflow
  const nodes: any[] = [];
  const connections: any[] = [];
  let name = 'AI Forged Automation';
  let description = `Automated flow triggered by prompt: "${prompt}"`;

  if (p.includes('slack') || p.includes('notion') || p.includes('lead') || p.includes('sales')) {
    name = 'Sales Lead Capture pipeline';
    description = 'Automatically capture form leads, summarize client profiles via Gemini, and log details in Slack + Notion.';
    nodes.push(
      { id: 'n1', type: 'webhook_trigger', label: 'Inbound Webhook Intake', category: 'trigger', position: { x: 80, y: 150 }, properties: { path: 'sales-intake', method: 'POST' } },
      { id: 'n2', type: 'gemini_ai', label: 'Gemini Client Insights', category: 'ai', position: { x: 350, y: 150 }, properties: { prompt: 'Analyze lead: {{input}}\nFormat summary.', systemInstruction: 'You are an elite research analyst.', temperature: 0.7 } },
      { id: 'n3', type: 'notion_db', label: 'Notion CRM Log', category: 'database', position: { x: 620, y: 80 }, properties: { databaseId: 'sales_crm', title: 'New lead: {{input}}' } },
      { id: 'n4', type: 'telegram_communication', label: 'Telegram Sales Alert', category: 'communication', position: { x: 620, y: 250 }, properties: { chatId: 'sales-alerts', message: '🚀 New lead analyzed:\n{{input}}' } }
    );
    connections.push(
      { id: 'c1', sourceNodeId: 'n1', sourceOutputIndex: 0, targetNodeId: 'n2', targetInputIndex: 0 },
      { id: 'c2', sourceNodeId: 'n2', sourceOutputIndex: 0, targetNodeId: 'n3', targetInputIndex: 0 },
      { id: 'c3', sourceNodeId: 'n2', sourceOutputIndex: 0, targetNodeId: 'n4', targetInputIndex: 0 }
    );
  } else if (p.includes('email') || p.includes('support') || p.includes('ticket') || p.includes('respond')) {
    name = 'Smart Support Inbox Auto-Responder';
    description = 'Parse inbound email support requests, perform sentiment classification via AI, and auto-draft customer email replies.';
    nodes.push(
      { id: 'n1', type: 'webhook_trigger', label: 'Inbound Support Ingest', category: 'trigger', position: { x: 80, y: 150 }, properties: { path: 'support-emails', method: 'POST' } },
      { id: 'n2', type: 'gemini_ai', label: 'Gemini Sentiment Categorizer', category: 'ai', position: { x: 350, y: 150 }, properties: { prompt: 'Classify sentiment of ticket: {{input}}\nRespond appropriately.', systemInstruction: 'You are a warm support agent.', temperature: 0.5 } },
      { id: 'n3', type: 'email_communication', label: 'Send Smart Auto-Reply', category: 'communication', position: { x: 650, y: 150 }, properties: { to: 'user@client.com', subject: 'Support Ticket Received', body: '{{input}}' } }
    );
    connections.push(
      { id: 'c1', sourceNodeId: 'n1', sourceOutputIndex: 0, targetNodeId: 'n2', targetInputIndex: 0 },
      { id: 'c2', sourceNodeId: 'n2', sourceOutputIndex: 0, targetNodeId: 'n3', targetInputIndex: 0 }
    );
  } else if (p.includes('social') || p.includes('twitter') || p.includes('linkedin') || p.includes('post') || p.includes('content')) {
    name = 'AI Social Scheduler & Multi-Poster';
    description = 'Generate rich content drafts using Gemini model, and queue them across social platform webhook endpoints.';
    nodes.push(
      { id: 'n1', type: 'cron_trigger', label: 'Every Monday 9 AM', category: 'trigger', position: { x: 80, y: 150 }, properties: { schedule: '0 9 * * 1' } },
      { id: 'n2', type: 'gemini_ai', label: 'Gemini Copywriter', category: 'ai', position: { x: 350, y: 150 }, properties: { prompt: 'Write 3 professional posts about marketing tech trend based on {{input}}.', systemInstruction: 'You are a social marketing genius.', temperature: 0.8 } },
      { id: 'n3', type: 'telegram_communication', label: 'Post to Telegram Channel', category: 'communication', position: { x: 650, y: 150 }, properties: { chatId: 'social-feed', message: '{{input}}' } }
    );
    connections.push(
      { id: 'c1', sourceNodeId: 'n1', sourceOutputIndex: 0, targetNodeId: 'n2', targetInputIndex: 0 },
      { id: 'c2', sourceNodeId: 'n2', sourceOutputIndex: 0, targetNodeId: 'n3', targetInputIndex: 0 }
    );
  } else {
    // Generic Flow
    name = 'Custom Forged AI Pipeline';
    description = `AI assistant generated pipeline for: "${prompt}"`;
    nodes.push(
      { id: 'n1', type: 'webhook_trigger', label: 'API Ingest Webhook', category: 'trigger', position: { x: 80, y: 150 }, properties: { path: 'custom-ingest', method: 'POST' } },
      { id: 'n2', type: 'gemini_ai', label: 'Gemini Assistant Core', category: 'ai', position: { x: 350, y: 150 }, properties: { prompt: `Handle prompt task: ${prompt}\nInput details: {{input}}`, systemInstruction: 'You are a general problem-solving model.', temperature: 0.7 } },
      { id: 'n3', type: 'notion_db', label: 'Saved Outputs Log', category: 'database', position: { x: 650, y: 150 }, properties: { databaseId: 'data-lake', title: 'Task results: {{input}}' } }
    );
    connections.push(
      { id: 'c1', sourceNodeId: 'n1', sourceOutputIndex: 0, targetNodeId: 'n2', targetInputIndex: 0 },
      { id: 'c2', sourceNodeId: 'n2', sourceOutputIndex: 0, targetNodeId: 'n3', targetInputIndex: 0 }
    );
  }

  return { name, description, nodes, connections };
}

// --- MONKEY PATCH FETCH FOR CLIENT-SIDE OPERATION ---

const originalFetch = window.fetch;

const customFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const urlStr = typeof input === 'string' ? input : (input instanceof URL ? input.href : input.url);
  
  // Only intercept /api/ requests
  if (urlStr.includes('/api/')) {
    try {
      // First, try the real network request (in case the server is running)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200); // Fail fast if unreachable

      const response = await originalFetch(urlStr, { ...init, signal: controller.signal });
      clearTimeout(timeoutId);

      // If the server returns a valid API response (not 404, not server errors), use it!
      if (response.ok || (response.status !== 404 && response.status < 500)) {
        return response;
      }
    } catch (e) {
      console.warn(`Local development API server not reachable at ${urlStr}. Activating static client fallback router.`);
    }

    // --- CLIENT-SIDE LOCAL STORAGE API ROUTING ---
    const method = init?.method?.toUpperCase() || 'GET';
    const bodyData = init?.body ? JSON.parse(init.body as string) : null;

    // A helper to construct a mock Response object
    const makeResponse = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    // Routing Logic
    // 1. Workflows
    if (urlStr.match(/\/api\/workflows$/)) {
      const workflows = JSON.parse(localStorage.getItem('flowforge_workflows') || '[]');
      if (method === 'GET') {
        return makeResponse(workflows);
      }
      if (method === 'POST') {
        const wf = bodyData;
        if (!wf.id) {
          wf.id = 'wf_' + Math.random().toString(36).substr(2, 9);
          wf.createdAt = new Date().toISOString();
          wf.updatedAt = new Date().toISOString();
          wf.version = 1;
          workflows.push(wf);
        } else {
          const index = workflows.findIndex((w: any) => w.id === wf.id);
          wf.updatedAt = new Date().toISOString();
          wf.version = (wf.version || 1) + 1;
          if (index !== -1) {
            workflows[index] = wf;
          } else {
            workflows.push(wf);
          }
        }
        localStorage.setItem('flowforge_workflows', JSON.stringify(workflows));
        return makeResponse(wf);
      }
    }

    const workflowIdMatch = urlStr.match(/\/api\/workflows\/([a-zA-Z0-9_-]+)$/);
    if (workflowIdMatch && method === 'DELETE') {
      const id = workflowIdMatch[1];
      let workflows = JSON.parse(localStorage.getItem('flowforge_workflows') || '[]');
      workflows = workflows.filter((w: any) => w.id !== id);
      localStorage.setItem('flowforge_workflows', JSON.stringify(workflows));
      return makeResponse({ success: true });
    }

    // 2. Logs
    if (urlStr.includes('/api/logs')) {
      if (method === 'GET') {
        const logs = JSON.parse(localStorage.getItem('flowforge_logs') || '[]');
        return makeResponse(logs.slice(-100).reverse());
      }
    }

    // 3. AI Providers
    if (urlStr.match(/\/api\/ai-providers$/)) {
      const providers = JSON.parse(localStorage.getItem('flowforge_ai_providers') || '[]');
      if (method === 'GET') {
        return makeResponse(providers);
      }
      if (method === 'POST') {
        const prov = bodyData;
        if (!prov.id) {
          prov.id = 'prov-' + Math.random().toString(36).substr(2, 9);
          providers.push(prov);
        } else {
          const index = providers.findIndex((p: any) => p.id === prov.id);
          if (index !== -1) {
            providers[index] = prov;
          } else {
            providers.push(prov);
          }
        }
        localStorage.setItem('flowforge_ai_providers', JSON.stringify(providers));
        return makeResponse(prov);
      }
    }

    const providerIdMatch = urlStr.match(/\/api\/ai-providers\/([a-zA-Z0-9_-]+)$/);
    if (providerIdMatch && method === 'DELETE') {
      const id = providerIdMatch[1];
      let providers = JSON.parse(localStorage.getItem('flowforge_ai_providers') || '[]');
      providers = providers.filter((p: any) => p.id !== id);
      localStorage.setItem('flowforge_ai_providers', JSON.stringify(providers));
      return makeResponse({ success: true });
    }

    // 4. Fallback Rules
    if (urlStr.includes('/api/fallback-rules')) {
      if (method === 'GET') {
        const rules = JSON.parse(localStorage.getItem('flowforge_fallback_rules') || '[]');
        return makeResponse(rules);
      }
      if (method === 'POST') {
        localStorage.setItem('flowforge_fallback_rules', JSON.stringify(bodyData));
        return makeResponse(bodyData);
      }
    }

    // 5. Connection Test & Discover
    if (urlStr.includes('/api/ai-providers/test')) {
      const latency = Math.floor(Math.random() * 120) + 30;
      return makeResponse({
        success: true,
        latency,
        message: 'Client connected successfully to simulated mock cloud endpoints.',
      });
    }

    if (urlStr.includes('/api/ai-providers/discover')) {
      return makeResponse({
        success: true,
        discovered: ['Ollama Localhost', 'LM Studio Socket'],
      });
    }

    // 6. Workflow Generative AI (Gemini prompt generator)
    if (urlStr.includes('/api/workflows/generate-ai')) {
      try {
        const result = await generateWorkflowClientSide(bodyData.prompt);
        return makeResponse(result);
      } catch (err: any) {
        return makeResponse({ error: 'Failed to generate', message: err.message }, 500);
      }
    }

    return makeResponse({ error: 'Endpoint Mock Not Found' }, 404);
  }

  // Not an API call, use original fetch
  return originalFetch(input, init);
};

try {
  Object.defineProperty(window, 'fetch', {
    value: customFetch,
    writable: true,
    configurable: true
  });
} catch (e) {
  console.warn('Could not override window.fetch with Object.defineProperty, falling back to direct property assignment.', e);
  try {
    (window as any).fetch = customFetch;
  } catch (err) {
    console.error('Failed to override window.fetch:', err);
  }
}

console.log('FlowForge AI Client Mock Router Active');
