import type  { TreeNode } from "./tree.types";

export const updateNode = (
  nodes: TreeNode[],
  id: string,
  updater: (node: TreeNode) => TreeNode
): TreeNode[] => {
  return nodes.map(node => {
    if (node.id === id) {
      return updater(node);
    }
    if (node.children) {
      return { ...node, children: updateNode(node.children, id, updater) };
    }
    return node;
  });
};

export const deleteNode = (nodes: TreeNode[], id: string): TreeNode[] => {
  return nodes
    .filter(node => node.id !== id)
    .map(node => ({
      ...node,
      children: node.children ? deleteNode(node.children, id) : undefined
    }));
};

export const addChild = (
  nodes: TreeNode[],
  parentId: string,
  child: TreeNode
): TreeNode[] => {
  return nodes.map(node => {
    if (node.id === parentId) {
      return {
        ...node,
        isExpanded: true,
        children: [...(node.children || []), child]
      };
    }
    if (node.children) {
      return { ...node, children: addChild(node.children, parentId, child) };
    }
    return node;
  });
};
