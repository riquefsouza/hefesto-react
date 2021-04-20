import TreeNode from "primereact/components/treenode/TreeNode";

export const emptyTreeNode: TreeNode = {
    'label': '',
    'data': '0',
    'children': []
};

export type NodeOnSelectEventType = { originalEvent?: Event; node: TreeNode; data?: any; };
