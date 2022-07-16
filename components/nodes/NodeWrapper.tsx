import { observer } from "mobx-react-lite";

import {
	Node as _Node,
	ConstantNode as _ConstantNode,
	UnaryOperatorNode as _UnaryOperatorNode,
	NodeType,
} from "../../node-engine";
import { ConstantNode } from "./Constant";
import { UnaryOperatorNode } from "./UnaryOperator";

export interface INodeWrapperProps {
	node: _Node;
}

export const NodeWrapper = observer(({ node }: INodeWrapperProps) => {
	switch (node.type) {
		case NodeType.CONSTANT:
			return <ConstantNode node={node as _ConstantNode} />;

		case NodeType.UNARY_OPERATOR:
			return <UnaryOperatorNode node={node as _UnaryOperatorNode} />;
	}

	return null;
});
