import { useRef } from "react";
import TreeView from "./components/TreeView/TreeView";
import KanbanBoard from "./components/Kanban/KanbanBoard";
import type { TreeNode } from "./components/TreeView/tree.types";
import type { KanbanColumn } from "./components/Kanban/kanban.types";
import "./App.css";

const mockTreeData: TreeNode[] = [
  {
    id: "1",
    name: "Level A",
    hasChildren: true,
    isExpanded: false,
    level: 0,
  },
];

const mockKanbanData: KanbanColumn[] = [
  {
    id: "todo",
    title: "Todo",
    color: "#2196F3",
    cards: [
      { id: "1", title: "Create initial project plan", columnId: "todo" },
      { id: "2", title: "Design landing page", columnId: "todo" },
      { id: "3", title: "Review codebase structure", columnId: "todo" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "#FF9800",
    cards: [
      { id: "4", title: "Implement authentication", columnId: "in-progress" },
      { id: "5", title: "Set up database schema", columnId: "in-progress" },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "#4CAF50",
    cards: [
      { id: "6", title: "Setup project repository", columnId: "done" },
      { id: "7", title: "Write API documentation", columnId: "done" },
      { id: "8", title: "Configure development environment", columnId: "done" },
    ],
  },
];

// Simulate API call for lazy loading
const loadChildren = async (nodeId: string): Promise<TreeNode[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const childCount = Math.floor(Math.random() * 4) + 2;
  const children: TreeNode[] = [];

  for (let i = 0; i < childCount; i++) {
    const childId = `${nodeId}-${i + 1}`;
    const hasGrandChildren = Math.random() > 0.5 && nodeId.split("-").length < 3;

    children.push({
      id: childId,
      name: "Level A",
      hasChildren: hasGrandChildren,
      isExpanded: false,
      level: 0,
    });
  }

  return children;
};

export default function App() {
  const kanbanRef = useRef<HTMLDivElement>(null);
  const treeRef = useRef<HTMLDivElement>(null);

  const scrollToKanban = () => {
    kanbanRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToTree = () => {
    treeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="app-container">
      <div className="left-panel" ref={treeRef}>
        <div className="panel-title">
          <span>Tree View</span>
          <button onClick={scrollToKanban} className="scroll-to-kanban-btn">
            Kanban Board ↓
          </button>
        </div>
        <TreeView initialData={mockTreeData} onLoadChildren={loadChildren} />
      </div>
      <div className="right-panel" ref={kanbanRef}>
        <div className="panel-title">
          <span>Kanban Board</span>
          <button onClick={scrollToTree} className="scroll-to-tree-btn">
            ↑ Tree View
          </button>
        </div>
        <KanbanBoard initialColumns={mockKanbanData} />
      </div>
    </div>
  );
}
