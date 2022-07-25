import { observer } from "mobx-react-lite";

import {
	Node as _Node,
	ConstantNode as _ConstantNode,
	UnaryOperatorNode as _UnaryOperatorNode,
	BinaryOperatorNode as _BinaryOperatorNode,
	VectorNode as _VectorNode,
	SliderNode as _SliderNode,
	MatrixNode as _MatrixNode,
	TransposeNode as _TransposeNode,
	EigenvaluesNode as _EigenvaluesNode,
	EigenvectorsNode as _EigenvectorsNode,
	MatrixMultiplicationNode as _MatrixMultiplicationNode,
	NormNode as _NormNode,
	VectorScalingNode as _VectorScalingNode,
	TransformNode as _TransformNode,
	NodeType,
} from "../../node-engine";
import { ConstantNode } from "./Constant";
import { UnaryOperatorNode } from "./UnaryOperator";
import { BinaryOperatorNode } from "./BinaryOperator";
import { VectorNode } from "./Vector";
import { SliderNode } from "./Slider";
import { MatrixNode } from "./Matrix";
import { TransposeNode } from "./Transpose";
import { EigenvectorsNode } from "./Eigenvectors";
import { EigenvaluesNode } from "./Eigenvalues";
import { MatrixMultiplicationNode } from "./MatrixMultiplication";
import { NormNode } from "./Norm";
import { VectorScalingNode } from "./VectorScalingNode";
import { TransformNode } from "./Transform";

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

		case NodeType.TRANSPOSE:
			return <TransposeNode node={node as _TransposeNode} />;

		case NodeType.EIGENVALUES:
			return <EigenvaluesNode node={node as _EigenvaluesNode} />;

		case NodeType.EIGENVECTORS:
			return <EigenvectorsNode node={node as _EigenvectorsNode} />;

		case NodeType.MATRIXMULT:
			return (
				<MatrixMultiplicationNode
					node={node as _MatrixMultiplicationNode}
				/>
			);

		case NodeType.VECTORSCALING:
			return <VectorScalingNode node={node as _VectorScalingNode} />;

		case NodeType.NORM:
			return <NormNode node={node as _NormNode} />;

		case NodeType.TRANSFORM:
			return <TransformNode node={node as _TransformNode} />;
	}

	return null;
});
