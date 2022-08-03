import ConstantNode from "./ConstantNode";
import UnaryOperationNode from "./UnaryOperationNode";
import BinaryOperationNode from "./BinaryOperationNode";
import VectorNode from "./VectorNode";
import MatrixNode from "./MatrixNode";
import SliderNode from "./SliderNode";
import NormNode from "./NormNode";
import TransformNode from "./TransformNode";
import VectorScalingNode from "./VectorScalingNode";

const nodeTypes = {
	constant: ConstantNode,
	unaryOperation: UnaryOperationNode,
	binaryOperation: BinaryOperationNode,
	vector: VectorNode,
	matrix: MatrixNode,
	slider: SliderNode,
	norm: NormNode,
	transform: TransformNode,
	vectorScaling: VectorScalingNode,
};

export default nodeTypes;
