import TreeView from "./components/TreeView";
import { initialTree } from "./data/treeData";

function App() {
  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ color: '#000000' }}>Tree View</h2>
      <TreeView data={initialTree} />
    </div>
  );
}

export default App;
