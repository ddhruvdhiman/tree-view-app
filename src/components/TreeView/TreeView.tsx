import React, { useState } from 'react';
import TreeNode from './TreeNode';
import type { TreeNode as TreeNodeType } from './tree.types';
import './TreeView.css';

interface TreeViewProps {
  initialData: TreeNodeType[];
  onLoadChildren?: (nodeId: string) => Promise<TreeNodeType[]>;
}

const TreeView: React.FC<TreeViewProps> = ({ initialData, onLoadChildren }) => {
  const [treeData, setTreeData] = useState<TreeNodeType[]>(initialData);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  const updateNodeInTree = (
    nodes: TreeNodeType[],
    nodeId: string,
    updateFn: (node: TreeNodeType) => TreeNodeType
  ): TreeNodeType[] => {
    return nodes.map((node) => {
      if (node.id === nodeId) {
        return updateFn(node);
      }
      if (node.children) {
        return { ...node, children: updateNodeInTree(node.children, nodeId, updateFn) };
      }
      return node;
    });
  };

  const findNodeById = (nodes: TreeNodeType[], nodeId: string): TreeNodeType | null => {
    for (const node of nodes) {
      if (node.id === nodeId) return node;
      if (node.children) {
        const found = findNodeById(node.children, nodeId);
        if (found) return found;
      }
    }
    return null;
  };

  const removeNodeFromTree = (nodes: TreeNodeType[], nodeId: string): TreeNodeType[] => {
    return nodes.filter((node) => {
      if (node.id === nodeId) return false;
      if (node.children) {
        node.children = removeNodeFromTree(node.children, nodeId);
      }
      return true;
    });
  };

  const handleToggle = (nodeId: string) => {
    setTreeData((prevData) =>
      updateNodeInTree(prevData, nodeId, (node) => ({
        ...node,
        isExpanded: !node.isExpanded,
      }))
    );
  };

  const handleLoadChildren = async (nodeId: string) => {
    if (!onLoadChildren) return;

    setTreeData((prevData) =>
      updateNodeInTree(prevData, nodeId, (node) => ({
        ...node,
        isLoading: true,
      }))
    );

    try {
      const children = await onLoadChildren(nodeId);
      setTreeData((prevData) =>
        updateNodeInTree(prevData, nodeId, (node) => ({
          ...node,
          children: children.map((child) => ({
            ...child,
            level: (node.level || 0) + 1,
          })),
          isLoading: false,
        }))
      );
    } catch (error) {
      console.error('Error loading children:', error);
      setTreeData((prevData) =>
        updateNodeInTree(prevData, nodeId, (node) => ({
          ...node,
          isLoading: false,
        }))
      );
    }
  };

  const handleAddNode = (parentId: string, nodeName: string) => {
    const newNode: TreeNodeType = {
      id: `node-${Date.now()}-${Math.random()}`,
      name: nodeName,
      hasChildren: false,
      level: 0,
    };

    setTreeData((prevData) =>
      updateNodeInTree(prevData, parentId, (node) => {
        const newLevel = (node.level || 0) + 1;
        return {
          ...node,
          hasChildren: true,
          children: [
            ...(node.children || []),
            { ...newNode, level: newLevel },
          ],
        };
      })
    );
  };

  const handleDeleteNode = (nodeId: string) => {
    setTreeData((prevData) => removeNodeFromTree(prevData, nodeId));
  };

  const handleUpdateNode = (nodeId: string, newName: string) => {
    setTreeData((prevData) =>
      updateNodeInTree(prevData, nodeId, (node) => ({
        ...node,
        name: newName,
      }))
    );
  };

  const handleDragStart = (nodeId: string) => {
    setDraggedNodeId(nodeId);
  };

  const handleDragOver = (e: React.DragEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, targetNodeId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedNodeId || draggedNodeId === targetNodeId) {
      setDraggedNodeId(null);
      return;
    }

    const draggedNode = findNodeById(treeData, draggedNodeId);
    if (!draggedNode) return;

    // Remove dragged node from its current position
    let newTreeData = removeNodeFromTree(treeData, draggedNodeId);

    // Add dragged node as child of target
    newTreeData = updateNodeInTree(newTreeData, targetNodeId, (node) => ({
      ...node,
      hasChildren: true,
      isExpanded: true,
      children: [
        ...(node.children || []),
        { ...draggedNode, level: (node.level || 0) + 1 },
      ],
    }));

    setTreeData(newTreeData);
    setDraggedNodeId(null);
  };

  return (
    <div className="tree-view">
      {treeData.map((node, index) => (
        <TreeNode
          key={node.id}
          node={node}
          onToggle={handleToggle}
          onLoadChildren={handleLoadChildren}
          onAdd={handleAddNode}
          onDelete={handleDeleteNode}
          onUpdate={handleUpdateNode}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isRoot={true}
        />
      ))}
    </div>
  );
};

export default TreeView;
