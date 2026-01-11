import { useState } from "react";
import type { TreeItem } from "../types/tree";
import TreeNode from "./TreeNode";
import "./tree.css";

interface Props {
  data: TreeItem[];
}

const TreeView = ({ data }: Props) => {
  const [treeData, setTreeData] = useState<TreeItem[]>(data);

  const updateNode = (nodeId: string, updates: Partial<TreeItem>) => {
    const updateNodeRecursive = (nodes: TreeItem[]): TreeItem[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, ...updates };
        }
        if (node.children) {
          return { ...node, children: updateNodeRecursive(node.children) };
        }
        return node;
      });
    };
    setTreeData(updateNodeRecursive(treeData));
  };

  const addChildNode = (parentId: string, newChild: TreeItem) => {
    const addChildRecursive = (nodes: TreeItem[]): TreeItem[] => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), newChild],
          };
        }
        if (node.children) {
          return { ...node, children: addChildRecursive(node.children) };
        }
        return node;
      });
    };
    setTreeData(addChildRecursive(treeData));
  };

  const deleteNode = (nodeId: string) => {
    const deleteNodeRecursive = (nodes: TreeItem[]): TreeItem[] => {
      return nodes
        .filter((node) => node.id !== nodeId)
        .map((node) => {
          if (node.children) {
            return { ...node, children: deleteNodeRecursive(node.children) };
          }
          return node;
        });
    };
    setTreeData(deleteNodeRecursive(treeData));
  };

  return (
    <div className="tree-card">
      <div className="tree-container">
        {treeData.map((node, index) => (
          <TreeNode
            key={node.id}
            node={node}
            isRoot={index === 0}
            onUpdate={(updates) => updateNode(node.id, updates)}
            onAddChild={(newChild) => addChildNode(node.id, newChild)}
            onDelete={index === 0 ? undefined : () => deleteNode(node.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TreeView;
