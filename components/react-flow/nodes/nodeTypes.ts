import ConstantNode from "./ConstantNode";
import UnaryOperationNode from "./UnaryOperationNode";
import BinaryOperationNode from "./BinaryOperationNode";
import VectorNode from "./VectorNode";

const nodeTypes = {
	constant: ConstantNode,
	unaryOperation: UnaryOperationNode,
	binaryOperation: BinaryOperationNode,
	vector: VectorNode,
};

export default nodeTypes;
