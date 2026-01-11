import { useState } from "react";
import type { TreeItem } from "../types/tree";

interface Props {
  node: TreeItem;
  isRoot?: boolean;
  level?: number;
  onDelete?: () => void;
  onUpdate?: (updates: Partial<TreeItem>) => void;
  onAddChild?: (newChild: TreeItem) => void;
}

const TreeNode = ({
  node,
  isRoot = false,
  level = 0,
  onDelete,
  onUpdate,
  onAddChild,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(node.title);
  const [expanded, setExpanded] = useState(true);

  const addChild = () => {
    const newChild: TreeItem = {
      id: Date.now().toString(),
      title: "New Node",
      children: [],
    };
    onAddChild?.(newChild);
    setExpanded(true);
  };

  const handleLabelChange = () => {
    setIsEditing(false);
    if (label !== node.title) {
      onUpdate?.({ title: label });
    }
  };

  const getCircleClass = () => {
    if (isRoot) return "root";
    return "child";
  };

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={`tree-node ${hasChildren ? "has-children" : ""}`}>
      <div className="node-content">
        {hasChildren && (
          <button
            className="expand-button"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? "▼" : "▶"}
          </button>
        )}
        <div className={`node-circle ${getCircleClass()}`}>
          {label.charAt(0).toUpperCase()}
        </div>
        <div className="node-label">
          {isEditing ? (
            <input
              value={label}
              autoFocus
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleLabelChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLabelChange();
              }}
            />
          ) : (
            <span
              className="node-title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {label}
            </span>
          )}
          <div className="node-actions">
            <button className="node-plus" onClick={addChild}>
              +
            </button>
            {!isRoot && onDelete && (
              <button className="node-delete" onClick={onDelete}>
                ×
              </button>
            )}
          </div>
        </div>
      </div>
      {hasChildren && expanded && (
        <div className="node-children">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onDelete={() => {
                const updatedChildren = node.children!.filter(
                  (c) => c.id !== child.id
                );
                onUpdate?.({ children: updatedChildren });
              }}
              onUpdate={(updates) => {
                const updatedChildren = node.children!.map((c) =>
                  c.id === child.id ? { ...c, ...updates } : c
                );
                onUpdate?.({ children: updatedChildren });
              }}
              onAddChild={(newChild) => {
                const updatedChildren = [...(child.children || []), newChild];
                const updatedChild = { ...child, children: updatedChildren };
                const allChildren = node.children!.map((c) =>
                  c.id === child.id ? updatedChild : c
                );
                onUpdate?.({ children: allChildren });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
