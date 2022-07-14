import { observer } from "mobx-react-lite";

import {
	Node as _Node,
	ConstantNode as _ConstantNode,
	NodeType,
} from "../../node-engine";
import { ConstantNode } from "./Constant";

export interface INodeWrapperProps {
	node: _Node;
}

export const NodeWrapper = observer(({ node }: INodeWrapperProps) => {
	switch (node.type) {
		case NodeType.Constant:
			return <ConstantNode node={node as _ConstantNode} />;
	}

	return null;
});
