import { useState } from "react";
import type  { TreeNode } from "./tree.types";

interface Props {
  node: TreeNode;
  level: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (parentId: string, name: string) => void;
  onEdit: (id: string, name: string) => void;
}

export default function TreeNodeItem({
  node,
  level,
  onToggle,
  onDelete,
  onAdd,
  onEdit
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(node.name);
  const [adding, setAdding] = useState(false);
  const [childName, setChildName] = useState("");

  return (
    <div>
      <div className="tree-node" style={{ paddingLeft: level * 20 }}>
        {node.hasChildren && (
          <span className="icon" onClick={() => onToggle(node.id)}>
            {node.isExpanded ? "▼" : "▶"}
          </span>
        )}

        {isEditing ? (
          <input
            value={text}
            autoFocus
            onChange={e => setText(e.target.value)}
            onBlur={() => {
              onEdit(node.id, text);
              setIsEditing(false);
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                onEdit(node.id, text);
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <span onDoubleClick={() => setIsEditing(true)}>{node.name}</span>
        )}

        <div className="actions">
          <button onClick={() => setAdding(true)}>➕</button>
          <button onClick={() => setIsEditing(true)}>✏️</button>
          <button onClick={() => onDelete(node.id)}>🗑</button>
        </div>
      </div>

      {adding && (
        <div style={{ paddingLeft: (level + 1) * 20 }}>
          <input
            autoFocus
            placeholder="New node"
            value={childName}
            onChange={e => setChildName(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && childName) {
                onAdd(node.id, childName);
                setChildName("");
                setAdding(false);
              }
            }}
          />
        </div>
      )}

      {node.isExpanded && node.children?.map(child => (
        <TreeNodeItem
          key={child.id}
          node={child}
          level={level + 1}
          onToggle={onToggle}
          onDelete={onDelete}
          onAdd={onAdd}
          onEdit={onEdit}
        />
      ))}

      {node.isLoading && <div className="loading">Loading...</div>}
    </div>
  );
}
