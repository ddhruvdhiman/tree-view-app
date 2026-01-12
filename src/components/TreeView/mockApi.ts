import type  { TreeNode } from "./tree.types";

export const fetchChildren = (parentId: string): Promise<TreeNode[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: `${parentId}-1`,
          name: "Lazy Child 1",
          hasChildren: false
        },
        {
          id: `${parentId}-2`,
          name: "Lazy Child 2",
          hasChildren: true
        }
      ]);
    }, 800);
  });
};
