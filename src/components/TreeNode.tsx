import { useState } from "react";
import type { TreeItem } from "../types/tree";

interface Props {
  node: TreeItem;
  isRoot?: boolean;
}

const TreeNode = ({ node, isRoot = false }: Props) => {
  const [children, setChildren] = useState<TreeItem[]>(node.children || []);
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(node.title);

  const addChild = () => {
    setChildren((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: "New Node",
        children: [],
      },
    ]);
  };

  const hasChildren = children.length > 0;

  return (
    <div className={`tree-node ${hasChildren ? "has-children" : ""}`}>
      <div className="node-content">
        <div className={`node-circle ${isRoot ? "root" : "child"}`}>
          {label.charAt(0).toUpperCase()}
        </div>
        <div className="node-label">
          {isEditing ? (
            <input
              value={label}
              autoFocus
              onChange={(e) => setLabel(e.target.value)}
              onBlur={() => setIsEditing(false)}
            />
          ) : (
            <span
              className="node-title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {label}
            </span>
          )}
          <button className="node-plus" onClick={addChild}>
            +
          </button>
        </div>
      </div>
      {hasChildren && (
        <div className="node-children">
          {children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
