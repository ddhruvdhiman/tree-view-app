import type { TreeItem } from "../types/tree";
import TreeNode from "./TreeNode";
import "./tree.css";

interface Props {
  data: TreeItem[];
}

const TreeView = ({ data }: Props) => {
  return (
    <div className="tree-container">
      {data.map((node, index) => (
        <TreeNode key={node.id} node={node} isRoot={index === 0} />
      ))}
    </div>
  );
};

export default TreeView;
