export interface KanbanCard {
  id: string;
  title: string;
  columnId: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  cards: KanbanCard[];
}

export interface KanbanBoardProps {
  initialColumns?: KanbanColumn[];
}
