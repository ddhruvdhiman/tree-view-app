import React, { useState } from 'react';
import type { TreeNode as TreeNodeType } from './tree.types';
import './TreeView.css';

interface TreeNodeProps {
  node: TreeNodeType;
  onToggle: (nodeId: string) => void;
  onLoadChildren: (nodeId: string) => Promise<void>;
  onAdd: (parentId: string, nodeName: string) => void;
  onDelete: (nodeId: string) => void;
  onUpdate: (nodeId: string, newName: string) => void;
  onDragStart: (nodeId: string) => void;
  onDragOver: (e: React.DragEvent, nodeId: string) => void;
  onDrop: (e: React.DragEvent, nodeId: string) => void;
  isRoot?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onToggle,
  onLoadChildren,
  onAdd,
  onDelete,
  onUpdate,
  onDragStart,
  onDragOver,
  onDrop,
  isRoot = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');

  const handleToggle = async () => {
    if (!node.isExpanded && node.hasChildren && (!node.children || node.children.length === 0)) {
      await onLoadChildren(node.id);
    }
    onToggle(node.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(node.name);
  };

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      onUpdate(node.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditValue(node.name);
    setIsEditing(false);
  };

  const handleAddChild = () => {
    if (newChildName.trim()) {
      onAdd(node.id, newChildName.trim());
      setNewChildName('');
      setIsAddingChild(false);
      if (!node.isExpanded) {
        onToggle(node.id);
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${node.name}" and all its children?`)) {
      onDelete(node.id);
    }
  };

  const getNodeColor = (level: number) => {
    const colors = ['#4A90E2', '#7CB342', '#FFA726', '#AB47BC', '#26C6DA'];
    return colors[level % colors.length];
  };

  return (
    <div className="tree-node-container">
      <div
        className="tree-node"
        draggable
        onDragStart={() => onDragStart(node.id)}
        onDragOver={(e) => onDragOver(e, node.id)}
        onDrop={(e) => onDrop(e, node.id)}
      >
        <div className="tree-node-content">
          <div className="tree-node-left">
            {node.hasChildren && (
              <button
                className="expand-btn"
                onClick={handleToggle}
                disabled={node.isLoading}
              >
                {node.isLoading ? '...' : node.isExpanded ? '−' : '+'}
              </button>
            )}
            <div
              className="node-icon"
              style={{ backgroundColor: getNodeColor(node.level || 0) }}
            >
              {node.name.charAt(0).toUpperCase()}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className="edit-input"
                autoFocus
              />
            ) : (
              <span className="node-name" onDoubleClick={handleEdit}>
                {node.name}
              </span>
            )}
          </div>
          <div className="tree-node-actions">
            <button
              className="action-btn add-btn"
              onClick={() => setIsAddingChild(true)}
              title="Add child"
            >
              +
            </button>
            <button
              className="action-btn edit-btn"
              onClick={handleEdit}
              title="Edit"
            >
              ✎
            </button>
            {!isRoot && (
              <button
                className="action-btn delete-btn"
                onClick={handleDelete}
                title="Delete"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {isAddingChild && (
        <div className="add-child-form">
          <input
            type="text"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddChild();
              if (e.key === 'Escape') setIsAddingChild(false);
            }}
            placeholder="Enter node name"
            className="add-child-input"
            autoFocus
          />
          <button onClick={handleAddChild} className="save-child-btn">
            ✓
          </button>
          <button
            onClick={() => setIsAddingChild(false)}
            className="cancel-child-btn"
          >
            ✕
          </button>
        </div>
      )}

      {node.isExpanded && node.children && node.children.length > 0 && (
        <div className="tree-node-children">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onToggle={onToggle}
              onLoadChildren={onLoadChildren}
              onAdd={onAdd}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              isRoot={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
