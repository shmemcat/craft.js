import { NodeId, Node, Nodes } from "../interfaces";
import { CallbacksFor } from "use-methods";
import { ManagerState } from "../interfaces";
import { isCanvas } from "../nodes";
const invariant = require('invariant');

const ManagerMethods = (state: ManagerState) => ({
  pushChildCanvas(id: NodeId, canvasName: string, newNode: Node) {
    if (!state.nodes[id].data._childCanvas) state.nodes[id].data._childCanvas = {};
    newNode.data.closestParent = id;
    state.nodes[id].data._childCanvas[canvasName] = newNode.id;
    state.nodes[newNode.id] = newNode;
  },
  replaceNodes(nodes: Nodes) {
    state.nodes = nodes;
  },
  add(parentId: NodeId, nodes: Node[] | Node) {
    if (parentId && !state.nodes[parentId].data.nodes) state.nodes[parentId].data.nodes = []
    if (!Array.isArray(nodes)) nodes = [nodes];
    (nodes as Node[]).forEach(node => {
      state.nodes[node.id] = node;
      if (parentId) state.nodes[parentId].data.nodes.push(node.id);
    });
  },
  move(targetId: NodeId, newParentId: NodeId, index: number) {
    const targetNode = state.nodes[targetId],
      currentParentNodes = state.nodes[targetNode.data.parent].data.nodes,
      newParentNodes = state.nodes[newParentId].data.nodes;

    currentParentNodes[currentParentNodes.indexOf(targetId)] = "marked";
    newParentNodes.splice(index, 0, targetId);
    state.nodes[targetId].data.parent = newParentId;
    state.nodes[targetId].data.closestParent = newParentId;
    currentParentNodes.splice(currentParentNodes.indexOf("marked"), 1);
  },
  setProp(id: NodeId, cb: <T>(props: T) => void) {
    cb(state.nodes[id].data.props);
  },
});


// type FactoryManagerMethods<S = any, O = any, R extends MethodRecordBase<S> = any> = (state: S, options: O) => R;
// type GetFactoryManagerMethods<M extends FactoryManagerMethods> = M extends FactoryManagerMethods<any, any, infer R>
//   ? {
//       [T in ActionUnion<R>['type']]: (...args: ActionUnion<R>['payload']) => void
//     }
//   : never;

export type ManagerMethods = CallbacksFor<typeof ManagerMethods>
export default ManagerMethods;