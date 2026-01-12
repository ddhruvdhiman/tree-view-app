export interface TreeNode {
  id: string;
  name: string;
  hasChildren: boolean;
  isExpanded?: boolean;
  isLoading?: boolean;
  children?: TreeNode[];
  level?: number;
}

export interface TreeViewProps {
  data: TreeNode[];
  onLoadChildren?: (nodeId: string) => Promise<TreeNode[]>;
  onAddNode?: (parentId: string, nodeName: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  onUpdateNode?: (nodeId: string, newName: string) => void;
  onMoveNode?: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
}
