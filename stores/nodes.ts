import create, { GetState, State, StateCreator, StoreApi } from "zustand";
import produce, { enableMapSet } from "immer";
import {
  CONSTANT_HEIGHT,
  CONSTANT_WIDTH,
  OPERATOR_HEIGHT,
  OPERATOR_WIDTH,
  VECTOR_HEIGHT,
  VECTOR_WIDTH,
} from "../components/constants";
import {
  Axis,
  ConstantNode,
  NodeType,
  Operator,
  OperatorNode,
  OperatorValue,
  OperatorValuePosition,
  Value,
  ValueNodeType,
  VectorNode,
} from "./types2";

// TODO: Make it possible to add toasts from here to signal errors or warnings.
// TODO: Add comments.
interface NodeState {
  vectors: Map<number, VectorNode>;
  constants: Map<number, ConstantNode>;
  operators: Map<number, OperatorNode>;
}

interface NodeFunctions {
  removeNode: (id: number, type: NodeType) => void;
  setNodePosition: (id: number, type: NodeType, x: number, y: number) => void;
  setNodeDimensions: (
    id: number,
    width: number,
    height: number,
    type?: NodeType
  ) => void;

  addVector: (x: number, y: number) => void;
  setVectorAxis: (id: number, axis: Axis, value: number) => void;
  linkVectorAxis: (
    id: number,
    axis: Axis,
    otherId: number,
    otherType: ValueNodeType
  ) => void;
  linkVectorOrigin: (id: number, otherId: number) => void;
  unlinkVectorOrigin: (id: number) => void;

  addConstant: (x: number, y: number) => void;
  setConstantValue: (id: number, value: number) => void;

  addOperator: (x: number, y: number) => void;
  setOperatorValue: (
    id: number,
    position: OperatorValuePosition,
    value: number
  ) => void;
  setOperatorType: (id: number, operator: Operator) => void;
  linkOperatorValue: (
    id: number,
    position: OperatorValuePosition,
    otherId: number,
    otherType: ValueNodeType
  ) => void;
  unlinkOperatorValue: (id: number, position: OperatorValuePosition) => void;
}

enableMapSet();

const withImmer =
  <PrimaryState extends State, SecondaryState extends State>(
    initialState: PrimaryState,
    createState: (
      set: (fn: (draftState: PrimaryState) => void) => void,
      get: GetState<PrimaryState>,
      api: StoreApi<PrimaryState>
    ) => SecondaryState
  ): StateCreator<PrimaryState & SecondaryState> =>
  (set, get, api) =>
    Object.assign(
      {},
      initialState,
      createState(
        (fn) => set((baseState) => produce(baseState, fn)),
        get as GetState<PrimaryState>,
        api as StoreApi<PrimaryState>
      )
    );

const initialState = {
  vectors: new Map(),
  constants: new Map(),
  operators: new Map(),
};

const useNodeStore = create(
  withImmer<NodeState, NodeFunctions>(initialState, (set) => ({
    vectors: new Map(),
    constants: new Map(),
    operators: new Map(),

    removeNode: (id, type) =>
      set((state) => {
        if (type === "vector") {
          state.vectors.delete(id);
        } else if (type === "constant") {
          state.constants.delete(id);
        } else if (type === "operator") {
          state.operators.delete(id);
        }
      }),
    setNodePosition: (id, type, x, y) =>
      set((state) => {
        let node: VectorNode | ConstantNode | OperatorNode | undefined;

        if (type === "vector") {
          node = state.vectors.get(id);
        } else if (type === "constant") {
          node = state.constants.get(id);
        } else if (type === "operator") {
          node = state.operators.get(id);
        }

        if (!node) return;

        node.position = { x, y };
      }),
    setNodeDimensions: (id, width, height, type) =>
      set((state) => {
        let node: VectorNode | ConstantNode | OperatorNode | undefined;

        if (type === "vector") {
          node = state.vectors.get(id);
        } else if (type === "constant") {
          node = state.constants.get(id);
        } else if (type === "operator") {
          node = state.operators.get(id);
        }

        if (!node) return;

        node.dimensions = { width, height };
      }),

    addVector: (x, y) =>
      set((state) => {
        state.vectors.set(getId(), {
          title: "Vector",
          dimensions: {
            width: VECTOR_WIDTH,
            height: VECTOR_HEIGHT,
          },
          position: { x, y },
          type: "vector",
          vector: {
            x: getRandomValue(),
            y: getRandomValue(),
            z: getRandomValue(),
          },
          link: {
            x: null,
            y: null,
            z: null,
          },
          origin: {
            x: new Value(0),
            y: new Value(0),
            z: new Value(0),
          },
          originLink: null,
        });
      }),
    setVectorAxis: (id, axis, value) =>
      set((state) => {
        const vector = state.vectors.get(id);
        if (!vector) return;

        vector.vector[axis] = new Value(value);
        vector.link[axis] = null;
      }),
    linkVectorAxis: (id, axis, otherId, otherType) =>
      set((state) => {
        let otherNode: ConstantNode | OperatorNode | undefined;

        if (otherType === "constant") {
          otherNode = state.constants.get(otherId);
        } else {
          otherNode = state.operators.get(otherId);
        }

        if (!otherNode) return;

        const vector = state.vectors.get(id);
        if (!vector) return;

        vector.vector[axis] = otherNode.value;
        vector.link[axis] = {
          id: otherId,
          type: otherType,
        };
      }),
    linkVectorOrigin: (id, otherId) =>
      set((state) => {
        const otherVector = state.vectors.get(otherId);
        if (!otherVector) return;

        const vector = state.vectors.get(id);
        if (!vector) return;

        vector.origin = otherVector.vector;
        vector.originLink = {
          id: otherId,
          type: "vector",
        };
      }),
    unlinkVectorOrigin: (id) =>
      set((state) => {
        const vector = state.vectors.get(id);
        if (!vector) return;

        vector.origin = {
          x: new Value(0),
          y: new Value(0),
          z: new Value(0),
        };
        vector.originLink = null;
      }),

    addConstant: (x, y) =>
      set((state) => {
        state.constants.set(getId(), {
          title: "Constant",
          dimensions: { width: CONSTANT_WIDTH, height: CONSTANT_HEIGHT },
          position: { x, y },
          type: "constant",
          value: getRandomValue(),
        });
      }),
    setConstantValue: (id, value) =>
      set((state) => {
        const constant = state.constants.get(id);
        if (!constant) return;

        constant.value = new Value(value);
      }),

    addOperator: (x, y) =>
      set((state) => {
        state.operators.set(getId(), {
          title: "Operator",
          dimensions: {
            width: OPERATOR_WIDTH,
            height: OPERATOR_HEIGHT,
          },
          position: { x, y },
          type: "operator",
          value: new OperatorValue(getRandomValue(), "+", getRandomValue()),
          link: {
            left: null,
            right: null,
          },
        });
      }),
    setOperatorValue: (id, position, value) =>
      set((state) => {
        const operator = state.operators.get(id);
        if (!operator) return;

        operator.value[position] = new Value(value);
      }),
    setOperatorType: (id, operator) =>
      set((state) => {
        const operatorNode = state.operators.get(id);
        if (!operatorNode) return;

        operatorNode.value.operator = operator;
      }),
    linkOperatorValue: (id, position, otherId, otherType) =>
      set((state) => {
        let otherNode: ConstantNode | OperatorNode | undefined;

        if (otherType === "constant") {
          otherNode = state.constants.get(otherId);
        } else {
          otherNode = state.operators.get(otherId);
        }

        if (!otherNode) return;

        const operator = state.operators.get(id);
        if (!operator) return;

        operator.value[position] = otherNode.value;
        operator.link[position] = {
          id: otherId,
          type: otherType,
        };
      }),
    unlinkOperatorValue: (id, position) =>
      set((state) => {
        const operator = state.operators.get(id);
        if (!operator) return;

        operator.value[position] = getRandomValue();
        operator.link[position] = null;
      }),
  }))
);

const getRandomValue = () => new Value(Math.round(Math.random() * 10 - 5));

let id = 0;
const getId = () => id++;

export default useNodeStore;
