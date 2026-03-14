import { useState } from 'react';
import { GitBranch, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PRDSection } from '@/types';

interface DependencyVisualizerProps {
  sections: PRDSection[];
  open: boolean;
  onClose: () => void;
}

interface DependencyNode {
  id: string;
  name: string;
  status: string;
  completeness: number;
  daysInProgress: number;
  isCriticalPath: boolean;
  isBottleneck: boolean;
  dependencies: string[];
  blocks: string[];
}

export default function DependencyVisualizer({
  sections,
  open,
  onClose,
}: DependencyVisualizerProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Build dependency graph
  const nodes = buildDependencyGraph(sections);
  const { criticalPath, bottlenecks, parallelPaths } = analyzeDependencies(nodes);

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Dependency Visualizer</DialogTitle>
          <DialogDescription>
            View section dependencies, critical path, and bottlenecks
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 flex-1 overflow-hidden">
          {/* Graph Visualization */}
          <div className="flex-1 overflow-auto bg-gray-50 rounded-lg p-6">
            <svg viewBox="0 0 800 600" className="w-full h-full">
              {/* Render connections */}
              {nodes.map((node) =>
                node.dependencies.map((depId) => {
                  const depNode = nodes.find(n => n.id === depId);
                  if (!depNode) return null;
                  
                  const startX = 100 + nodes.indexOf(depNode) * 150;
                  const startY = 100;
                  const endX = 100 + nodes.indexOf(node) * 150;
                  const endY = 200;

                  return (
                    <g key={`${depId}-${node.id}`}>
                      <line
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        stroke={node.isCriticalPath ? '#ef4444' : '#94a3b8'}
                        strokeWidth={node.isCriticalPath ? 3 : 2}
                        strokeDasharray={node.isCriticalPath ? '' : '5,5'}
                      />
                      <circle cx={endX} cy={endY - 10} r={3} fill="#3b82f6" />
                    </g>
                  );
                })
              )}

              {/* Render nodes */}
              {nodes.map((node, idx) => {
                const x = 100 + idx * 150;
                const y = 200;
                const isSelected = selectedNode === node.id;

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={x - 50}
                      y={y - 30}
                      width={100}
                      height={60}
                      rx={8}
                      fill={
                        isSelected
                          ? '#3b82f6'
                          : node.isBottleneck
                          ? '#fef3c7'
                          : node.isCriticalPath
                          ? '#fee2e2'
                          : '#ffffff'
                      }
                      stroke={
                        isSelected
                          ? '#3b82f6'
                          : node.isBottleneck
                          ? '#f59e0b'
                          : node.isCriticalPath
                          ? '#ef4444'
                          : '#e5e7eb'
                      }
                      strokeWidth={isSelected ? 3 : 2}
                    />
                    <text
                      x={x}
                      y={y - 10}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fill={isSelected ? '#ffffff' : '#1f2937'}
                    >
                      {node.name.slice(0, 12)}
                    </text>
                    <text
                      x={x}
                      y={y + 8}
                      textAnchor="middle"
                      fontSize="10"
                      fill={isSelected ? '#ffffff' : '#6b7280'}
                    >
                      {node.completeness}%
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="mt-6 flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
                <span>Critical Path</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
                <span>Bottleneck</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                <span>Normal</span>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-80 space-y-4 overflow-auto">
            {/* Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-3">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Critical Path:</span>
                  <span className="font-medium">{criticalPath.length} sections</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bottlenecks:</span>
                  <span className="font-medium text-yellow-700">
                    {bottlenecks.length} detected
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Parallel Paths:</span>
                  <span className="font-medium text-green-700">
                    {parallelPaths.length} available
                  </span>
                </div>
              </div>
            </div>

            {/* Critical Path */}
            <div>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Critical Path
              </h3>
              <div className="space-y-2">
                {criticalPath.map((nodeId, idx) => {
                  const node = nodes.find(n => n.id === nodeId);
                  if (!node) return null;
                  return (
                    <div
                      key={nodeId}
                      className="text-xs p-2 bg-red-50 border border-red-200 rounded"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{idx + 1}. {node.name}</span>
                        <Badge variant="outline">{node.completeness}%</Badge>
                      </div>
                      <p className="text-gray-600">{node.daysInProgress} days in progress</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottlenecks */}
            {bottlenecks.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  Bottlenecks
                </h3>
                <div className="space-y-2">
                  {bottlenecks.map((nodeId) => {
                    const node = nodes.find(n => n.id === nodeId);
                    if (!node) return null;
                    return (
                      <div
                        key={nodeId}
                        className="text-xs p-2 bg-yellow-50 border border-yellow-200 rounded"
                      >
                        <p className="font-medium mb-1">{node.name}</p>
                        <p className="text-gray-600">Blocks {node.blocks.length} sections</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Node Details */}
            {selectedNodeData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-3">Selected Section</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium">{selectedNodeData.name}</p>
                    <p className="text-gray-600">Status: {selectedNodeData.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Progress: {selectedNodeData.completeness}%</p>
                    <p className="text-gray-600">
                      Days in progress: {selectedNodeData.daysInProgress}
                    </p>
                  </div>
                  {selectedNodeData.dependencies.length > 0 && (
                    <div>
                      <p className="font-medium mb-1">Depends on:</p>
                      {selectedNodeData.dependencies.map(depId => {
                        const dep = nodes.find(n => n.id === depId);
                        return (
                          <p key={depId} className="text-xs text-gray-600">
                            • {dep?.name}
                          </p>
                        );
                      })}
                    </div>
                  )}
                  {selectedNodeData.blocks.length > 0 && (
                    <div>
                      <p className="font-medium mb-1">Blocks:</p>
                      {selectedNodeData.blocks.map(blockId => {
                        const block = nodes.find(n => n.id === blockId);
                        return (
                          <p key={blockId} className="text-xs text-gray-600">
                            • {block?.name}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">Export SVG</Button>
            <Button>Optimize Dependencies</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function buildDependencyGraph(sections: PRDSection[]): DependencyNode[] {
  return sections.map(section => ({
    id: section.id,
    name: section.name,
    status: section.status,
    completeness: section.completeness,
    daysInProgress: Math.floor((Date.now() - new Date(section.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)),
    isCriticalPath: section.completeness < 100 && section.blocks.length > 0,
    isBottleneck: section.blocks.length > 2,
    dependencies: section.dependencies,
    blocks: section.blocks,
  }));
}

function analyzeDependencies(nodes: DependencyNode[]) {
  // Simple critical path: sections with most blocks
  const criticalPath = nodes
    .filter(n => n.blocks.length > 0 || n.completeness < 80)
    .map(n => n.id);

  // Bottlenecks: sections blocking multiple others
  const bottlenecks = nodes.filter(n => n.blocks.length > 1).map(n => n.id);

  // Parallel paths: sections with no dependencies
  const parallelPaths = nodes
    .filter(n => n.dependencies.length === 0)
    .map(n => [n.id]);

  return { criticalPath, bottlenecks, parallelPaths };
}
