import OriginTree from './Tree';
import TreeNode from './TreeNode';
declare type OriginTreeType = typeof OriginTree;
interface TreeType extends OriginTreeType {
    TreeNode: typeof TreeNode;
}
declare const Tree: TreeType;
export { TreeNode };
export default Tree;
