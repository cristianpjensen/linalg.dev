import BinaryOperatorNode from "./BinaryOperatorNode";
import ConstantNode from "./ConstantNode";
import UnaryOperatorNode from "./UnaryOperatorNode";
import VectorNode from "./VectorNode";

const nodeTypes = {
	constant: ConstantNode,
	unaryOperator: UnaryOperatorNode,
	binaryOperator: BinaryOperatorNode,
	vector: VectorNode,
};

export default nodeTypes;
