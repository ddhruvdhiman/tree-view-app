import React, { useState } from 'react';
import Column from './Column';
import type { KanbanColumn, KanbanCard } from './kanban.types';
import './Kanban.css';

interface KanbanBoardProps {
  initialColumns: KanbanColumn[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialColumns }) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [draggedCard, setDraggedCard] = useState<{
    cardId: string;
    sourceColumnId: string;
  } | null>(null);

  const handleAddCard = (columnId: string, title: string) => {
    const newCard: KanbanCard = {
      id: `card-${Date.now()}-${Math.random()}`,
      title,
      columnId,
    };

    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      )
    );
  };

  const handleDeleteCard = (cardId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.id !== cardId),
      }))
    );
  };

  const handleUpdateCard = (cardId: string, newTitle: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({
        ...col,
        cards: col.cards.map((card) =>
          card.id === cardId ? { ...card, title: newTitle } : card
        ),
      }))
    );
  };

  const handleDragStart = (cardId: string, columnId: string) => {
    setDraggedCard({ cardId, sourceColumnId: columnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (!draggedCard) return;

    const { cardId, sourceColumnId } = draggedCard;

    if (sourceColumnId === targetColumnId) {
      setDraggedCard(null);
      return;
    }

    // Find the card being dragged
    let cardToMove: KanbanCard | undefined;
    setColumns((prevColumns) => {
      const sourceColumn = prevColumns.find((col) => col.id === sourceColumnId);
      cardToMove = sourceColumn?.cards.find((card) => card.id === cardId);

      if (!cardToMove) return prevColumns;

      // Remove card from source column and add to target column
      return prevColumns.map((col) => {
        if (col.id === sourceColumnId) {
          return {
            ...col,
            cards: col.cards.filter((card) => card.id !== cardId),
          };
        }
        if (col.id === targetColumnId) {
          return {
            ...col,
            cards: [...col.cards, { ...cardToMove!, columnId: targetColumnId }],
          };
        }
        return col;
      });
    });

    setDraggedCard(null);
  };

  return (
    <div className="kanban-board">
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          onAddCard={handleAddCard}
          onDeleteCard={handleDeleteCard}
          onUpdateCard={handleUpdateCard}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
