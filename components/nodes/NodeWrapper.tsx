import { observer } from "mobx-react-lite";

import {
	Node as _Node,
	ConstantNode as _ConstantNode,
	UnaryOperatorNode as _UnaryOperatorNode,
	BinaryOperatorNode as _BinaryOperatorNode,
	VectorNode as _VectorNode,
	NodeType,
} from "../../node-engine";
import { ConstantNode } from "./Constant";
import { UnaryOperatorNode } from "./UnaryOperator";
import { BinaryOperatorNode } from "./BinaryOperator";
import { VectorNode } from "./Vector";

export interface INodeWrapperProps {
	node: _Node;
}

export const NodeWrapper = observer(({ node }: INodeWrapperProps) => {
	switch (node.type) {
		case NodeType.CONSTANT:
			return <ConstantNode node={node as _ConstantNode} />;

		case NodeType.UNARY_OPERATOR:
			return <UnaryOperatorNode node={node as _UnaryOperatorNode} />;

		case NodeType.BINARY_OPERATOR:
			return <BinaryOperatorNode node={node as _BinaryOperatorNode} />;

		case NodeType.VECTOR:
			return <VectorNode node={node as _VectorNode} />;
	}

	return null;
});
