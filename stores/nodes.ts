import create from "zustand";
import * as THREE from "three";
import { VECTOR_HEIGHT, VECTOR_WIDTH } from "../components/constants";

export type ValueNode = ConstantNode | OperatorNode;
type Operator = "+" | "-" | "*" | "/";

interface Node {
  id: number;
  title: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface VectorNode extends Node {
  type: "vector";
  vectorX: number;
  vectorY: number;
  vectorZ: number;
  linkVectorX: ValueNode | null;
  linkVectorY: ValueNode | null;
  linkVectorZ: ValueNode | null;
}

export interface ConstantNode extends Node {
  type: "constant";
  value: number;
}

export interface OperatorNode extends Node {
  type: "operator";
  operator: Operator;
  value1: number;
  value2: number;
  linkValue1: ValueNode | null;
  linkValue2: ValueNode | null;
}

export interface MatrixNode extends Node {
  type: "matrix";
  matrix: THREE.Matrix3;
}

interface NodeStore {
  vectors: Array<VectorNode>;
  constants: Array<ConstantNode>;
  operators: Array<OperatorNode>;
  matrices: Array<MatrixNode>;
  addVector: (title: string, x: number, y: number) => void;
  addConstant: (title: string, x: number, y: number) => void;
  addOperator: (
    title: string,
    operator: Operator,
    x: number,
    y: number
  ) => void;
  addMatrix: (title: string, x: number, y: number) => void;
  setVectorDimension: (id: number, dimension: "x" | "y" | "z", value: number) => void;
  setNodePosition: (id: number, x: number, y: number) => void;
  setNodeDimensions: (id: number, width: number, height: number) => void;
  removeNode: (id: number) => void;
  linkVector: (axis: "x" | "y" | "z", id1: number, id2: number) => void;
  getVector: (id: number) => THREE.Vector3;
}

export const useNodeStore = create<NodeStore>((set, get) => ({
  vectors: [],
  constants: [],
  operators: [],
  matrices: [],
  addVector: (title, x, y) => {
    set((state) => ({
      vectors: [
        ...state.vectors,
        {
          id: getId(),
          type: "vector",
          title,
          x,
          y,
          width: VECTOR_WIDTH,
          height: VECTOR_HEIGHT,
          vectorX: getRandomValue(),
          vectorY: getRandomValue(),
          vectorZ: getRandomValue(),
          linkVectorX: null,
          linkVectorY: null,
          linkVectorZ: null,
        },
      ],
    }));
  },
  addConstant: (title, x, y) => {
    set((state) => ({
      constants: [
        ...state.constants,
        {
          id: getId(),
          type: "constant",
          title,
          x,
          y,
          width: 240,
          height: 240,
          value: getRandomValue(),
        },
      ],
    }));
  },
  addOperator: (title, operator, x, y) => {
    set((state) => ({
      operators: [
        ...state.operators,
        {
          id: getId(),
          type: "operator",
          title,
          x,
          y,
          width: 240,
          height: 240,
          operator,
          value1: getRandomValue(),
          value2: getRandomValue(),
          linkValue1: null,
          linkValue2: null,
        },
      ],
    }));
  },
  addMatrix: (title, x, y) => {
    set((state) => ({
      matrices: [
        ...state.matrices,
        {
          id: getId(),
          type: "matrix",
          title,
          x,
          y,
          width: 240,
          height: 240,
          matrix: new THREE.Matrix3(),
        },
      ],
    }));
  },
  setVectorDimension: (id, dimension, x) => {
    set((state) => {
      const vector = state.vectors.find((v) => v.id === id);
      if (vector) {
        const newVector = { ...vector };
        // @ts-ignore
        newVector[`vector${dimension.toUpperCase()}`] = x;
        return {
          vectors: [...state.vectors.filter((v) => v.id !== id), newVector],
        };
      }
      return state;
    })
  },
  setNodePosition: (id, x, y) => {
    set((state) => ({
      vectors: state.vectors.map((vector) =>
        vector.id === id ? { ...vector, x, y } : vector
      ),
      constants: state.constants.map((constant) =>
        constant.id === id ? { ...constant, x, y } : constant
      ),
      operators: state.operators.map((operator) =>
        operator.id === id ? { ...operator, x, y } : operator
      ),
      matrices: state.matrices.map((matrix) =>
        matrix.id === id ? { ...matrix, x, y } : matrix
      ),
    }));
  },
  setNodeDimensions: (id, width, height) => {
    set((state) => ({
      vectors: state.vectors.map((vector) =>
        vector.id === id ? { ...vector, width, height } : vector
      ),
      constants: state.constants.map((constant) =>
        constant.id === id ? { ...constant, width, height } : constant
      ),
      operators: state.operators.map((operator) =>
        operator.id === id ? { ...operator, width, height } : operator
      ),
      matrices: state.matrices.map((matrix) =>
        matrix.id === id ? { ...matrix, width, height } : matrix
      ),
    }));
  },
  removeNode: (id) => {
    set((state) => ({
      vectors: state.vectors.filter((vector) => vector.id !== id),
      constants: state.constants.filter((constant) => constant.id !== id),
      operators: state.operators.filter((operator) => operator.id !== id),
      matrices: state.matrices.filter((matrix) => matrix.id !== id),
    }));
  },
  linkVector: (axis, id1, id2) => {
    const valueNodes: Array<ValueNode> = [
      ...get().constants,
      ...get().operators,
    ];
    const node2 = valueNodes.find((node) => node.id === id2);

    if (node2) {
      set((state) => ({
        ...state,
        vectors: state.vectors.map((node) => {
          if (node.id === id1) {
            return {
              ...node,
              [`linkVector${axis.toUpperCase()}`]: node2,
            };
          }
          return node;
        }),
      }));
    }
  },
  getVector: (id) => {
    const vectorNode = get().vectors.find((node) => node.id === id);

    if (!vectorNode) {
      return new THREE.Vector3();
    }

    const { vectorX, vectorY, vectorZ, linkVectorX, linkVectorY, linkVectorZ } =
      vectorNode;

    const vector = new THREE.Vector3(vectorX, vectorY, vectorZ);

    if (linkVectorX) {
      if ("value" in linkVectorX) {
        vector.setX(linkVectorX.value);
      } else {
        const value = eval(
          `${linkVectorX.value1} ${linkVectorX.operator} ${linkVectorX.value2}`
        );
        vector.setX(value);
      }
    }

    if (linkVectorY) {
      if ("value" in linkVectorY) {
        vector.setY(linkVectorY.value);
      } else {
        const value = eval(
          `${linkVectorY.value1} ${linkVectorY.operator} ${linkVectorY.value2}`
        );
        vector.setY(value);
      }
    }

    if (linkVectorZ) {
      if ("value" in linkVectorZ) {
        vector.setZ(linkVectorZ.value);
      } else {
        const value = eval(
          `${linkVectorZ.value1} ${linkVectorZ.operator} ${linkVectorZ.value2}`
        );
        vector.setZ(value);
      }
    }

    return vector;
  },
}));

const getRandomValue = () => Math.round(Math.random() * 10 - 5);

let id = 0;
const getId = () => id++;

export default useNodeStore;
