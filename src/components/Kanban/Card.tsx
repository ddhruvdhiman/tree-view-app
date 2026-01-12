import React, { useState } from 'react';
import type { KanbanCard } from './kanban.types';
import './Kanban.css';

interface CardProps {
  card: KanbanCard;
  onDelete: (cardId: string) => void;
  onUpdate: (cardId: string, newTitle: string) => void;
  onDragStart: (cardId: string, columnId: string) => void;
}

const Card: React.FC<CardProps> = ({ card, onDelete, onUpdate, onDragStart }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);

  const handleSave = () => {
    if (title.trim()) {
      onUpdate(card.id, title.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(card.title);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      onDelete(card.id);
    }
  };

  return (
    <div
      className="kanban-card"
      draggable={!isEditing}
      onDragStart={() => !isEditing && onDragStart(card.id, card.columnId)}
    >
      {isEditing ? (
        <div className="card-edit-form">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
              if (e.key === 'Escape') handleCancel();
            }}
            className="card-edit-input"
            autoFocus
            rows={2}
          />
          <div className="card-edit-actions">
            <button onClick={handleSave} className="card-save-btn">
              Save
            </button>
            <button onClick={handleCancel} className="card-cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="card-content" onClick={() => setIsEditing(true)}>
            <p className="card-title">{card.title}</p>
          </div>
          <button className="card-delete-btn" onClick={handleDelete} title="Delete card">
            ×
          </button>
        </>
      )}
    </div>
  );
};

export default Card;
