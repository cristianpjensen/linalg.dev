import { atom, atomFamily } from "recoil";
import {
  CONSTANT_HEIGHT,
  CONSTANT_WIDTH,
  OPERATOR_HEIGHT,
  OPERATOR_WIDTH,
  VECTOR_HEIGHT,
  VECTOR_WIDTH,
} from "../components/constants";
import type {
  ConstantNode,
  NodeType,
  OperatorNode,
  SelectedLink,
  ToolEnum,
  VectorNode,
} from "./types";

function getRandomValue() {
  return Math.round(Math.random() * 10 - 5);
}

/**
 * The current tool being used.
 */
export const tool = atom<ToolEnum>({
  key: "tool",
  default: "",
});

/**
 * Currently selected link node. When the user clicks on a link, the tool should
 * be set to "link" and this should be set to whatever is going to be linked. It
 * works together with `tool`.
 */
export const selectedLink = atom<SelectedLink>({
  key: "link",
  default: {
    id: -1,
    type: null,
  },
});

export const defaultVector: () => VectorNode = () => ({
  title: "Vector",
  dimensions: {
    width: VECTOR_WIDTH,
    height: VECTOR_HEIGHT,
  },
  position: { x: 0, y: 0 },
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
  origin: null,
});

/**
 * Function that returns the vector for the ID and if the ID does not exist, it
 * will create a new one. It is also able to set position when creating a new
 * vector.
 */
export const vectors = atomFamily<VectorNode, number>({
  key: "vector",
  default: defaultVector,
});

export const defaultConstant: () => ConstantNode = () => ({
  title: "Constant",
  dimensions: {
    width: CONSTANT_WIDTH,
    height: CONSTANT_HEIGHT,
  },
  position: { x: 0, y: 0 },
  value: getRandomValue(),
});

/**
 * Function that returns the constant for the ID and if the ID does not exist,
 * it will create a new one.
 */
export const constants = atomFamily<ConstantNode, number>({
  key: "constant",
  default: defaultConstant,
});

export const defaultOperator: () => OperatorNode = () => ({
  title: "Operator",
  dimensions: {
    width: OPERATOR_WIDTH,
    height: OPERATOR_HEIGHT,
  },
  position: { x: 0, y: 0 },
  operator: "+",
  values: {
    left: getRandomValue(),
    right: getRandomValue(),
  },
  link: {
    left: null,
    right: null,
  },
});

/**
 * Function that returns the operator for the ID and if the ID does not exist,
 * it will create a new one.
 */
export const operators = atomFamily<OperatorNode, number>({
  key: "operator",
  default: defaultOperator,
});

export const ids = atom<Array<{ id: number; type: NodeType }>>({
  key: "ids",
  default: [],
});
