import ConstantNode from "./ConstantNode";
import UnaryOperationNode from "./UnaryOperationNode";
import BinaryOperationNode from "./BinaryOperationNode";
import VectorNode from "./VectorNode";
import MatrixNode from "./MatrixNode";

const nodeTypes = {
	constant: ConstantNode,
	unaryOperation: UnaryOperationNode,
	binaryOperation: BinaryOperationNode,
	vector: VectorNode,
	matrix: MatrixNode,
};

export default nodeTypes;
