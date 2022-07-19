import { observer } from "mobx-react-lite";

import {
	Node as _Node,
	ConstantNode as _ConstantNode,
	UnaryOperatorNode as _UnaryOperatorNode,
	BinaryOperatorNode as _BinaryOperatorNode,
	VectorNode as _VectorNode,
	SliderNode as _SliderNode,
	MatrixNode as _MatrixNode,
	NodeType,
} from "../../node-engine";
import { ConstantNode } from "./Constant";
import { UnaryOperatorNode } from "./UnaryOperator";
import { BinaryOperatorNode } from "./BinaryOperator";
import { VectorNode } from "./Vector";
import { SliderNode } from "./Slider";
import { MatrixNode } from "./Matrix";

export interface INodeWrapperProps {
	node: _Node;
}

export const NodeWrapper = observer(({ node }: INodeWrapperProps) => {
	switch (node.type) {
		case NodeType.CONSTANT:
			return <ConstantNode node={node as _ConstantNode} />;

		case NodeType.SLIDER:
			return <SliderNode node={node as _SliderNode} />;

		case NodeType.UNARY_OPERATOR:
			return <UnaryOperatorNode node={node as _UnaryOperatorNode} />;

		case NodeType.BINARY_OPERATOR:
			return <BinaryOperatorNode node={node as _BinaryOperatorNode} />;

		case NodeType.VECTOR:
			return <VectorNode node={node as _VectorNode} />;

		case NodeType.MATRIX:
			return <MatrixNode node={node as _MatrixNode} />;
	}

	return null;
});
