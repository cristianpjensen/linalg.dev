import ConstantNode from "./ConstantNode";
import UnaryOperationNode from "./UnaryOperationNode";
import BinaryOperationNode from "./BinaryOperationNode";
import VectorNode from "./VectorNode";
import MatrixNode from "./MatrixNode";
import SliderNode from "./SliderNode";
import NormNode from "./NormNode";
import TransformNode from "./TransformNode";
import VectorScalingNode from "./VectorScalingNode";
import TransposeNode from "./TransposeNode";
import MatrixMultiplicationNode from "./MatrixMultiplicationNode";
import EigenvaluesNode from "./EigenvaluesNode";
import EigenvectorsNode from "./EigenvectorsNode";

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
	transpose: TransposeNode,
	matrixMultiplication: MatrixMultiplicationNode,
	eigenvalues: EigenvaluesNode,
	eigenvectors: EigenvectorsNode,
};

export default nodeTypes;
