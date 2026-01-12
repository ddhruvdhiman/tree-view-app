import React, { useState } from 'react';
import Card from './Card';
import type { KanbanColumn as KanbanColumnType, KanbanCard } from './kanban.types';
import './Kanban.css';

interface ColumnProps {
  column: KanbanColumnType;
  onAddCard: (columnId: string, title: string) => void;
  onDeleteCard: (cardId: string) => void;
  onUpdateCard: (cardId: string, newTitle: string) => void;
  onDragStart: (cardId: string, columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  onAddCard,
  onDeleteCard,
  onUpdateCard,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(column.id, newCardTitle.trim());
      setNewCardTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="kanban-column">
      <div className="column-header" style={{ backgroundColor: column.color }}>
        <h3 className="column-title">{column.title}</h3>
        <span className="card-count">{column.cards.length}</span>
        <button
          className="column-add-btn"
          onClick={() => setIsAdding(true)}
          title="Add card"
        >
          +
        </button>
      </div>

      <div
        className="column-content"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, column.id)}
      >
        {isAdding && (
          <div className="add-card-form">
            <textarea
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddCard();
                }
                if (e.key === 'Escape') setIsAdding(false);
              }}
              placeholder="Enter card title..."
              className="add-card-input"
              autoFocus
              rows={2}
            />
            <div className="add-card-actions">
              <button onClick={handleAddCard} className="add-card-save-btn">
                Add Card
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="add-card-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {column.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onDelete={onDeleteCard}
            onUpdate={onUpdateCard}
            onDragStart={onDragStart}
          />
        ))}

        {!isAdding && column.cards.length === 0 && (
          <div className="empty-column">
            <p>No cards yet</p>
            <button onClick={() => setIsAdding(true)} className="empty-add-btn">
              + Add Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
