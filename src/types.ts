/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NodeCategory =
  | 'trigger'
  | 'ai'
  | 'logic'
  | 'database'
  | 'communication'
  | 'developer'
  | 'file';

export interface PropertyDefinition {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'code' | 'textarea';
  defaultValue?: any;
  options?: { label: string; value: string }[];
  description?: string;
  required?: boolean;
}

export interface NodeDefinition {
  type: string;
  label: string;
  category: NodeCategory;
  description: string;
  icon: string;
  color: string;
  properties: PropertyDefinition[];
  inputs: number;
  outputs: number;
}

export interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  category: NodeCategory;
  position: { x: number; y: number };
  properties: Record<string, any>;
  status?: 'idle' | 'running' | 'success' | 'failed';
  error?: string;
  outputData?: any;
}

export interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  sourceOutputIndex: number;
  targetNodeId: string;
  targetInputIndex: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  createdAt: string;
  updatedAt: string;
  version: number;
  isActive: boolean;
}

export interface ExecutionLog {
  id: string;
  workflowId: string;
  startedAt: string;
  finishedAt?: string;
  status: 'running' | 'success' | 'failed' | 'paused';
  steps: {
    nodeId: string;
    nodeLabel: string;
    status: 'running' | 'success' | 'failed';
    startedAt: string;
    finishedAt?: string;
    input?: any;
    output?: any;
    error?: string;
  }[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  category: string;
  author: string;
  downloads: number;
}

export interface AIModel {
  id: string;
  name: string;
  contextLength?: number;
  providerType: string;
}

export interface AIProvider {
  id: string;
  name: string;
  type: 'openai' | 'gemini' | 'anthropic' | 'groq' | 'ollama' | 'lmstudio' | 'openrouter' | 'custom' | 'xai' | 'deepseek' | 'mistral' | 'cohere';
  baseUrl?: string;
  apiKey?: string;
  models: string[];
  isActive: boolean;
  isCustom?: boolean;
}

export interface AIFallbackRule {
  id: string;
  triggerProviderId: string;
  fallbackProviderId: string;
  fallbackModel: string;
}
