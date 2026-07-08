/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkflowTemplate } from '../types';

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'google-forms-sheet-telegram-ai',
    name: 'Omni Lead Capture & Notion Logger',
    description: 'Trigger on Google Forms, record in Google Sheets, broadcast message to Telegram, generate AI review summary, and log into Notion.',
    category: 'Lead Capture',
    author: 'FlowForge Team',
    downloads: 1482,
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
        properties: { chatId: '123456789', message: '📢 New client signed up!\nName: {{input.name}}\nEmail: {{input.email}}\nSource: Google Forms' },
      },
      {
        id: 'node-4',
        type: 'gemini_ai',
        label: 'Generate Gemini Summary',
        category: 'ai',
        position: { x: 550, y: 250 },
        properties: {
          prompt: 'Form submission details: {{input}}\n\nProvide a short, elegant, professional lead qualification summary.',
          systemInstruction: 'You are a warm, helpful sales qualification expert.',
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
  },
  {
    id: 'ai-email-responder',
    name: 'AI Smart Auto-Responder',
    description: 'Listen on Email / Webhook triggers, categorize sentiment with Google Gemini, draft response and send SMTP email automatically.',
    category: 'Customer Success',
    author: 'FlowForge Team',
    downloads: 943,
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
        type: 'gemini_ai',
        label: 'Analyze Sentiment & Draft Response',
        category: 'ai',
        position: { x: 380, y: 150 },
        properties: {
          prompt: 'Customer email contents:\n"{{input}}"\n\nEvaluate customer mood. Draft a courteous, helpful email response addressing their concerns.',
          systemInstruction: 'You are a compassionate, super-support lead representative.',
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
  },
  {
    id: 'weekly-postgres-slack',
    name: 'Database Health Slack Broadcaster',
    description: 'Poll database metrics periodically using Cron, process status checks with JS code, and announce outcomes via Slack.',
    category: 'DevOps / Database',
    author: 'Admin Ops',
    downloads: 512,
    nodes: [
      {
        id: 'node-d1',
        type: 'cron_trigger',
        label: 'Weekly Health Poll',
        category: 'trigger',
        position: { x: 100, y: 150 },
        properties: { cron: '0 9 * * 1' },
      },
      {
        id: 'node-d2',
        type: 'postgres_db',
        label: 'Fetch Core Stats',
        category: 'database',
        position: { x: 350, y: 150 },
        properties: {
          queryType: 'SELECT',
          tableName: 'health_metrics',
          sql: 'SELECT count(*), avg(latency) FROM health_metrics WHERE created_at > now() - interval \'7 days\';',
        },
      },
      {
        id: 'node-d3',
        type: 'javascript_code',
        label: 'Verify Thresholds',
        category: 'developer',
        position: { x: 600, y: 150 },
        properties: {
          code: 'const stats = inputData || { avg: 45, count: 2000 };\nconst threshold = 150; // ms\n\nreturn {\n  healthy: stats.avg < threshold,\n  weeklyAverage: stats.avg,\n  totalPolls: stats.count,\n  summary: `Database stats analyzed. Average latency: ${stats.avg}ms.`\n};',
        },
      },
      {
        id: 'node-d4',
        type: 'slack_communication',
        label: 'Post to Slack #devops',
        category: 'communication',
        position: { x: 850, y: 150 },
        properties: {
          channel: '#devops-health',
          message: '*Database Performance Report* :bar_chart:\nWeekly Status: *{{input.healthy ? "OK" : "WARNING"}}*\nDetails: {{input.summary}}',
        },
      },
    ],
    connections: [
      {
        id: 'conn-d1-d2',
        sourceNodeId: 'node-d1',
        sourceOutputIndex: 0,
        targetNodeId: 'node-d2',
        targetInputIndex: 0,
      },
      {
        id: 'conn-d2-d3',
        sourceNodeId: 'node-d2',
        sourceOutputIndex: 0,
        targetNodeId: 'node-d3',
        targetInputIndex: 0,
      },
      {
        id: 'conn-d3-d4',
        sourceNodeId: 'node-d3',
        sourceOutputIndex: 0,
        targetNodeId: 'node-d4',
        targetInputIndex: 0,
      },
    ],
  },
];
