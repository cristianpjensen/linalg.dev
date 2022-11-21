import ScalarNode from "./ScalarNode";
import UnaryOperationNode from "./UnaryOperationNode";
import BinaryOperationNode from "./BinaryOperationNode";
import VectorNode from "./VectorNode";
import MatrixNode from "./MatrixNode";
import SliderNode from "./SliderNode";
import NormNode from "./NormNode";
import TransformNode from "./TransformNode";
import VectorScalingNode from "./VectorScalingNode";
import VectorComponentsNode from "./VectorComponentsNode";
import TransposeNode from "./TransposeNode";
import MatrixMultiplicationNode from "./MatrixMultiplicationNode";
import EigenvaluesNode from "./EigenvaluesNode";
import EigenvectorsNode from "./EigenvectorsNode";
import PlaneNode from "./PlaneNode";

const nodeTypes = {
	scalar: ScalarNode,
	unaryOperation: UnaryOperationNode,
	binaryOperation: BinaryOperationNode,
	vector: VectorNode,
	matrix: MatrixNode,
	slider: SliderNode,
	norm: NormNode,
	transform: TransformNode,
	vectorScaling: VectorScalingNode,
	vectorComponents: VectorComponentsNode,
	transpose: TransposeNode,
	matrixMultiplication: MatrixMultiplicationNode,
	eigenvalues: EigenvaluesNode,
	eigenvectors: EigenvectorsNode,
	plane: PlaneNode,
};

export default nodeTypes;
