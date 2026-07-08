/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { WorkflowNode, WorkflowConnection, NodeDefinition } from '../types';
import { NODE_DEFINITIONS } from '../data/nodeDefinitions';
import * as Icons from 'lucide-react';

interface CanvasProps {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onAddNode: (type: string, position: { x: number; y: number }) => void;
  onDeleteNode: (nodeId: string) => void;
  onAddConnection: (connection: Omit<WorkflowConnection, 'id'>) => void;
  onDeleteConnection: (connectionId: string) => void;
  onUpdateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  executionStatus: 'idle' | 'running' | 'success' | 'failed' | 'paused';
}

export default function Canvas({
  nodes,
  connections,
  selectedNodeId,
  onSelectNode,
  onAddNode,
  onDeleteNode,
  onAddConnection,
  onDeleteConnection,
  onUpdateNodePosition,
  executionStatus,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 100, y: 100 });
  const [zoom, setZoom] = useState(1.0);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Port connection state
  const [activeSourcePort, setActiveSourcePort] = useState<{
    nodeId: string;
    outputIndex: number;
    posX: number;
    posY: number;
  } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Selected Connection State
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

  // Drag Node State
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const getIconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : <Icons.HelpCircle className="w-5 h-5" />;
  };

  const getNodeDefinition = (type: string): NodeDefinition | undefined => {
    return NODE_DEFINITIONS.find((n) => n.type === type);
  };

  // ZOOM & PAN HANDLERS
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    let newZoom = zoom;
    if (e.deltaY < 0) {
      newZoom = Math.min(zoom * zoomFactor, 2.0);
    } else {
      newZoom = Math.max(zoom / zoomFactor, 0.4);
    }
    setZoom(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Left-click on canvas background pans
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-background')) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      onSelectNode(null);
      setSelectedConnectionId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    // Track mouse position in SVG coordinates (scaled and panned)
    const clientX = e.clientX - canvasRect.left;
    const clientY = e.clientY - canvasRect.top;
    const canvasX = (clientX - pan.x) / zoom;
    const canvasY = (clientY - pan.y) / zoom;
    setMousePos({ x: canvasX, y: canvasY });

    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else if (draggedNodeId) {
      // Dragging a node on canvas
      const nodeX = Math.round(canvasX - dragOffset.x);
      const nodeY = Math.round(canvasY - dragOffset.y);
      onUpdateNodePosition(draggedNodeId, { x: nodeX, y: nodeY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
  };

  // DRAG & DROP FROM SIDEBAR
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('application/reactflow');
    if (!nodeType) return;

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const clientX = e.clientX - canvasRect.left;
    const clientY = e.clientY - canvasRect.top;
    const posX = Math.round((clientX - pan.x) / zoom - 80); // Center node slightly
    const posY = Math.round((clientY - pan.y) / zoom - 40);

    onAddNode(nodeType, { x: posX, y: posY });
  };

  // NODE PORT POSITIONS CALCULATION (FOR DRAWING LINKS)
  const getNodePortsCoordinates = (node: WorkflowNode) => {
    const nodeWidth = 240;
    const nodeHeaderHeight = 44;
    const nodeBodyHeight = 36;
    const nodeTotalHeight = nodeHeaderHeight + nodeBodyHeight;

    const nodeDef = getNodeDefinition(node.type);
    const numInputs = nodeDef?.inputs ?? 1;
    const numOutputs = nodeDef?.outputs ?? 1;

    // Inputs (Left Side)
    const inputs = Array.from({ length: numInputs }).map((_, index) => {
      const step = nodeTotalHeight / (numInputs + 1);
      return {
        x: node.position.x,
        y: node.position.y + step * (index + 1),
      };
    });

    // Outputs (Right Side)
    const outputs = Array.from({ length: numOutputs }).map((_, index) => {
      const step = nodeTotalHeight / (numOutputs + 1);
      return {
        x: node.position.x + nodeWidth,
        y: node.position.y + step * (index + 1),
      };
    });

    return { inputs, outputs };
  };

  // PORT CLICK HANDLERS (CONNECTION DRAWING)
  const handlePortMouseDown = (
    e: React.MouseEvent,
    nodeId: string,
    outputIndex: number,
    posX: number,
    posY: number
  ) => {
    e.stopPropagation();
    setActiveSourcePort({ nodeId, outputIndex, posX, posY });
  };

  const handlePortMouseUp = (e: React.MouseEvent, targetNodeId: string, targetInputIndex: number) => {
    e.stopPropagation();
    if (activeSourcePort && activeSourcePort.nodeId !== targetNodeId) {
      onAddConnection({
        sourceNodeId: activeSourcePort.nodeId,
        sourceOutputIndex: activeSourcePort.outputIndex,
        targetNodeId,
        targetInputIndex,
      });
    }
    setActiveSourcePort(null);
  };

  // Cancel connection drawing if clicked anywhere else
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (activeSourcePort) {
        setActiveSourcePort(null);
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [activeSourcePort]);

  // CANVAS ZOOM & CENTER HELPER
  const zoomIn = () => setZoom((z) => Math.min(z * 1.2, 2.0));
  const zoomOut = () => setZoom((z) => Math.max(z / 1.2, 0.4));
  const resetPan = () => {
    setPan({ x: 100, y: 100 });
    setZoom(1.0);
  };

  return (
    <div
      id="canvas-container"
      ref={canvasRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex-1 relative overflow-hidden bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] bg-[#09090b] cursor-grab active:cursor-grabbing select-none"
    >
      {/* Dynamic Grid Background Layer */}
      <div className="canvas-background absolute inset-0 w-full h-full pointer-events-none" />

      {/* SVG Connections Canvas (Translates with Zoom and Pan) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Saved Connections */}
          {connections.map((conn) => {
            const sourceNode = nodes.find((n) => n.id === conn.sourceNodeId);
            const targetNode = nodes.find((n) => n.id === conn.targetNodeId);

            if (!sourceNode || !targetNode) return null;

            const sourceCoords = getNodePortsCoordinates(sourceNode);
            const targetCoords = getNodePortsCoordinates(targetNode);

            const sPort = sourceCoords.outputs[conn.sourceOutputIndex];
            const tPort = targetCoords.inputs[conn.targetInputIndex];

            if (!sPort || !tPort) return null;

            // Generate control points for elegant cubic bezier curve
            const controlOffset = Math.max(100, Math.abs(tPort.x - sPort.x) * 0.5);
            const pathD = `M ${sPort.x} ${sPort.y} C ${sPort.x + controlOffset} ${sPort.y}, ${tPort.x - controlOffset} ${tPort.y}, ${tPort.x} ${tPort.y}`;

            const isSelected = selectedConnectionId === conn.id;

            // Connection active style based on nodes execution state
            let strokeColor = '#27272a'; // Zinc-800 base
            let isGlowing = false;
            let animateDash = false;

            if (sourceNode.status === 'success' && targetNode.status === 'success') {
              strokeColor = '#10b981'; // solid green
            } else if (sourceNode.status === 'running' || targetNode.status === 'running') {
              strokeColor = '#3b82f6'; // glowing running blue
              isGlowing = true;
              animateDash = true;
            } else if (sourceNode.status === 'failed' || targetNode.status === 'failed') {
              strokeColor = '#ef4444'; // glowing failure red
              isGlowing = true;
            }

            return (
              <g key={conn.id} className="pointer-events-auto cursor-pointer">
                {/* Thick invisible click helper path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={20}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedConnectionId(conn.id);
                    onSelectNode(null);
                  }}
                />

                {/* Main Visible Path Connection */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSelected ? '#3b82f6' : strokeColor}
                  strokeWidth={isSelected ? 3.5 : 2.5}
                  className={`transition-all duration-300 ${animateDash ? 'animate-dash' : ''}`}
                  style={{
                    strokeDasharray: animateDash ? '8, 8' : 'none',
                    filter: isGlowing ? `drop-shadow(0 0 6px ${strokeColor})` : 'none',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedConnectionId(conn.id);
                    onSelectNode(null);
                  }}
                />

                {/* Nested flow core helper */}
                {animateDash && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    strokeDasharray="6, 12"
                    className="animate-dash-core"
                  />
                )}
              </g>
            );
          })}

          {/* Temporary Connecting Line (when drawing connection) */}
          {activeSourcePort && (
            <path
              d={`M ${activeSourcePort.posX} ${activeSourcePort.posY} C ${
                activeSourcePort.posX + 120
              } ${activeSourcePort.posY}, ${mousePos.x - 120} ${mousePos.y}, ${mousePos.x} ${mousePos.y}`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5, 5"
              className="animate-pulse"
            />
          )}
        </g>
      </svg>

      {/* Nodes Container (Translates with Zoom and Pan) */}
      <div
        className="absolute inset-0 origin-top-left pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          zIndex: 20,
        }}
      >
        {nodes.map((node) => {
          const nodeDef = getNodeDefinition(node.type);
          const isSelected = selectedNodeId === node.id;
          const ports = getNodePortsCoordinates(node);

          // Build classes based on node status
          let statusBorder = 'border-zinc-800';
          let glowEffect = '';
          if (node.status === 'running') {
            statusBorder = 'border-blue-500';
            glowEffect = 'shadow-[0_0_20px_rgba(59,130,246,0.4)] ring-2 ring-blue-500/30';
          } else if (node.status === 'success') {
            statusBorder = 'border-emerald-500/80';
            glowEffect = 'shadow-[0_0_15px_rgba(16,185,129,0.2)]';
          } else if (node.status === 'failed') {
            statusBorder = 'border-rose-500';
            glowEffect = 'shadow-[0_0_22px_rgba(244,63,94,0.45)] ring-2 ring-rose-500/20';
          } else if (isSelected) {
            statusBorder = 'border-blue-500';
            glowEffect = 'shadow-[0_0_15px_rgba(59,130,246,0.25)]';
          }

          return (
            <div
              key={node.id}
              style={{
                left: node.position.x,
                top: node.position.y,
                width: 240,
              }}
              className={`absolute pointer-events-auto flex flex-col bg-zinc-900/95 border backdrop-blur-md rounded-xl transition-all duration-300 select-none cursor-grab active:cursor-grabbing ${statusBorder} ${glowEffect}`}
              onMouseDown={(e) => {
                // If clicked a button or port, do not drag node
                if ((e.target as HTMLElement).closest('.port-handle') || (e.target as HTMLElement).closest('button')) {
                  return;
                }
                e.stopPropagation();
                onSelectNode(node.id);
                setSelectedConnectionId(null);
                setDraggedNodeId(node.id);

                // Calculate offset from node origin
                const canvasRect = canvasRef.current?.getBoundingClientRect();
                if (canvasRect) {
                  const clientX = e.clientX - canvasRect.left;
                  const clientY = e.clientY - canvasRect.top;
                  const canvasX = (clientX - pan.x) / zoom;
                  const canvasY = (clientY - pan.y) / zoom;
                  setDragOffset({
                    x: canvasX - node.position.x,
                    y: canvasY - node.position.y,
                  });
                }
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-3 py-2.5 rounded-t-xl border-b border-zinc-800/80"
                style={{
                  backgroundColor: nodeDef ? `${nodeDef.color}12` : 'transparent',
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="p-1.5 rounded-lg shrink-0"
                    style={{
                      backgroundColor: nodeDef ? `${nodeDef.color}25` : '#1e293b',
                      color: nodeDef ? nodeDef.color : '#cbd5e1',
                    }}
                  >
                    {nodeDef ? getIconComponent(nodeDef.icon) : <Icons.HelpCircle className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-zinc-100 truncate">
                      {node.label}
                    </h3>
                    <p className="text-[9px] text-zinc-400 capitalize truncate">
                      {node.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Status Badges */}
                  {node.status === 'running' && (
                    <Icons.Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                  )}
                  {node.status === 'success' && (
                    <Icons.CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {node.status === 'failed' && (
                    <Icons.AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNode(node.id);
                    }}
                    className="p-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                    title="Delete Node"
                  >
                    <Icons.Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Node Body (Short Summary of inputs) */}
              <div className="px-3 py-2 text-[10px] text-zinc-300 leading-normal min-h-[36px] bg-zinc-950/20 rounded-b-xl">
                {node.type === 'webhook_trigger' && (
                  <span className="font-mono text-emerald-400">POST /api/trig/{node.properties.path}</span>
                )}
                {node.type === 'cron_trigger' && (
                  <span className="text-zinc-400">Trigger: <strong className="font-mono text-emerald-400">{node.properties.cron}</strong></span>
                )}
                {node.type === 'gemini_ai' && (
                  <span className="text-zinc-400 line-clamp-2">Prompt: "{node.properties.prompt}"</span>
                )}
                {node.type === 'javascript_code' && (
                  <span className="font-mono text-blue-300 line-clamp-1">// Run custom JS script...</span>
                )}
                {node.type === 'email_communication' && (
                  <span className="text-zinc-400">Mail to: <strong className="text-pink-400 truncate">{node.properties.to}</strong></span>
                )}
                {!['webhook_trigger', 'cron_trigger', 'gemini_ai', 'javascript_code', 'email_communication'].includes(node.type) && (
                  <span className="text-zinc-400 italic line-clamp-1">{nodeDef?.description}</span>
                )}
              </div>

              {/* Ports handles (Click and drag connections) */}
              {/* Inputs (Left side) */}
              {ports.inputs.map((port, idx) => (
                <div
                  key={`in-${idx}`}
                  style={{
                    left: -6,
                    top: port.y - node.position.y - 6,
                  }}
                  onMouseUp={(e) => handlePortMouseUp(e, node.id, idx)}
                  className="port-handle absolute w-3.5 h-3.5 bg-zinc-800 hover:bg-blue-500 border-2 border-blue-400 hover:border-white rounded-full cursor-crosshair transition-all pointer-events-auto"
                  title="Input Port"
                />
              ))}

              {/* Outputs (Right side) */}
              {ports.outputs.map((port, idx) => (
                <div
                  key={`out-${idx}`}
                  style={{
                    right: -6,
                    top: port.y - node.position.y - 6,
                  }}
                  onMouseDown={(e) => handlePortMouseDown(e, node.id, idx, port.x, port.y)}
                  className="port-handle absolute w-3.5 h-3.5 bg-zinc-800 hover:bg-blue-500 border-2 border-blue-400 hover:border-white rounded-full cursor-crosshair transition-all pointer-events-auto"
                  title="Output Port"
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Floating Canvas Action Controls Panel (Bottom Right) */}
      <div className="absolute bottom-5 right-5 z-40 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-2 rounded-xl shadow-2xl">
        <button
          onClick={zoomIn}
          className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          title="Zoom In"
        >
          <Icons.ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={zoomOut}
          className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <Icons.ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetPan}
          className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          title="Reset View"
        >
          <Icons.Maximize className="w-4 h-4" />
        </button>

        {/* Delete link helper if selected */}
        {selectedConnectionId && (
          <>
            <div className="w-px h-5 bg-zinc-800" />
            <button
              onClick={() => {
                onDeleteConnection(selectedConnectionId);
                setSelectedConnectionId(null);
              }}
              className="p-2 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Delete Selected Connection"
            >
              <Icons.Trash2 className="w-4 h-4" />
              <span>Delete Link</span>
            </button>
          </>
        )}
      </div>

      {/* Canvas Meta status (Top Left) */}
      <div className="absolute top-5 left-5 z-40 pointer-events-none flex flex-col gap-1.5">
        <div className="bg-zinc-950/80 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold text-zinc-300 shadow-xl">
          <Icons.Compass className="w-4 h-4 text-blue-400" />
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          <span className="text-zinc-600">|</span>
          <span>Nodes: {nodes.length}</span>
        </div>
      </div>
    </div>
  );
}
