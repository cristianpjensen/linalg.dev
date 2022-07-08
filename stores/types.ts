export type NodeType = "vector" | "constant" | "operator";

//   Tools

export type ToolEnum = "" | "link" | NodeType;

export interface SelectedLink {
  id: number;
  type:
    | {
        source: "vector";
        target: "constant" | "operator";
        link: "x" | "y" | "z";
      }
    | {
        source: "vector";
        target: "vector";
        link: "origin";
      }
    | {
        source: "operator";
        target: "constant" | "operator";
        link: "left" | "right";
      }
    | null;
}

//   Nodes

export type Link<PossibleNodeLink extends NodeType> = {
  id: number;
  type: PossibleNodeLink;
};

export interface Node {
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

export interface VectorNode extends Node {
  vector: {
    x: number;
    y: number;
    z: number;
  };
  link: {
    x: Link<"constant" | "operator"> | null;
    y: Link<"constant" | "operator"> | null;
    z: Link<"constant" | "operator"> | null;
  };
  origin: Link<"vector"> | null;
}

export interface ConstantNode extends Node {
  value: number;
}

export type Operator = "+" | "-" | "*" | "/";

export interface OperatorNode extends Node {
  operator: Operator;
  values: {
    left: number;
    right: number;
  };
  link: {
    left: Link<"constant" | "operator"> | null;
    right: Link<"constant" | "operator"> | null;
  };
}
