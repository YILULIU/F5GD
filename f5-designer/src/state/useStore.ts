import { create } from 'zustand';
import {
  Node,
  Edge,
  Connection,
  EdgeChange,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

// 您可以在 /src/types/index.ts 中定义这个类型
// 为了演示，我们先放这里
export interface F5NodeData {
  label: string;
  // 可以根据不同节点类型添加更多属性
  ipAddress?: string;
  port?: number;
  name?: string;
}

// 定义我们全局状态的结构
interface AppState {
  nodes: Node<F5NodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node<F5NodeData>) => void;
  updateNodeData: (nodeId: string, data: Partial<F5NodeData>) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
}

export const useStore = create<AppState>((set, get) => ({
  nodes: [
    // 为了方便演示，可以放一些初始节点
    { id: '1', type: 'input', data: { label: 'Client' }, position: { x: 100, y: 200 } },
  ],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  
  addNode: (newNode) => set((state) => ({ nodes: [...state.nodes, newNode] })),

  updateNodeData: (nodeId, newData) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // 不可变地更新节点数据
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      }),
    });
  },

  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
}));