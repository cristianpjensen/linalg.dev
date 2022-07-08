/**
 * Used for being able to pass references to values. This is needed due to the
 * way links work and it is more efficient than having a separate datastructure
 * to keep track of all the links. If `operator` exists, then `y` must also
 * exist for the operator to be used.
 * 
 * The value should only be used within the stores and not in the components.
 * The getter should however be used in the components.
 * 
 * @example
 * const A = new Value(5);
 * const B = A;
 * A.set(2);
 * B.get(); // 2
 */
export class Value {
  x: number;

  constructor(x: number) {
    this.x = x;
  }

  get(): number {
    return this.x;
  }

  set(x: number) {
    this.x = x;
  }
}

export type Operator = "+" | "-" | "*" | "/";

/**
 * Used for being able to pass references as operator values. This has the same
 * API as `Value`, such that it can be used in the same manner when linked.
 * 
 * @example
 * const A = new OperatorValue(new Value(5), "+", new Value(2));
 * A.get(); // 7
 * A.operator = "*";
 * A.get(); // 10
 * A.left.set(3);
 * A.get(); // 6
 */
export class OperatorValue {
  left: SharedValue;
  right: SharedValue;
  operator: Operator;

  constructor(left: SharedValue, operator: Operator, right: SharedValue) {
    this.left = left;
    this.right = right;
    this.operator = operator;
  }

  get(): number {
    switch (this.operator) {
      case "+":
        return this.left.get() + this.right.get();
      case "-":
        return this.left.get() - this.right.get();
      case "*":
        return this.left.get() * this.right.get();
      case "/":
        return this.left.get() / this.right.get();
    }
  }
}

/**
 * They have the same API, so can be used for the same things when linked.
 */
export type SharedValue = Value | OperatorValue;

/**
 * Available nodes. Add to this type as more nodes get added.
 */
export type NodeType = "vector" | "constant" | "operator";

/**
 * A node that can be linked as a value to another node.
 */
export type ValueNodeType = "constant" | "operator";

/**
 * Gives information about where the link is coming from.
 */
export type Link = {
  id: number;
  type: NodeType;
}

/**
 * Base class for all nodes. This just defines the properties of the pane that
 * represents the node.
 */
interface Node { 
  title: string;
  dimensions: {
    width: number;
    height: number;
  };
  position: {
    x: number;
    y: number;
  };
}

export type Axis = "x" | "y" | "z";

/**
 * Vector node representation. The `linked` property is used to determine
 * whether the values are linked to other nodes, since this is impossible to
 * determine otherwise. It must be the ID of the linked node. Make sure to
 * update this as the links get updated.
 */
export interface VectorNode extends Node {
  type: "vector";
  vector: {
    x: SharedValue;
    y: SharedValue;
    z: SharedValue;
  };
  link: {
    x: Link | null;
    y: Link | null;
    z: Link | null;
  };
  origin: {
    x: SharedValue;
    y: SharedValue;
    z: SharedValue;
  };
  originLink: Link | null;
}

/**
 * Constant node representation. The `value` property is the value of the
 * constant and a reference to it can be passed to other node types, such that
 * they become linked. If this node is linked to something else, it does not
 * need to be represented in this node -- only the other.
 */
export interface ConstantNode extends Node {
  type: "constant";
  value: Value;
}

export type OperatorValuePosition = "left" | "right";

/**
 * Operator node representation. The `value` property contains the values for
 * the left-hand and right-hand sides of the operator and the operator itself.
 * This custom class is used because it makes the API uniform over all `value`
 * properties on all node types. The left-hand and right-hand values are both
 * represented by `Value` objects, so they can be linked. If they are linked (or
 * not), make sure to update the `linked` property properly. The `linked`
 * property must be the ID of the target node.
 */
export interface OperatorNode extends Node {
  type: "operator";
  value: OperatorValue;
  link: {
    left: Link | null;
    right: Link | null;
  }
}
