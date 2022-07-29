import BinaryOperatorNode from "./BinaryOperatorNode";
import ConstantNode from "./ConstantNode";
import UnaryOperatorNode from "./UnaryOperatorNode";

const nodeTypes = {
	constant: ConstantNode,
	unaryOperator: UnaryOperatorNode,
	binaryOperator: BinaryOperatorNode,
};

export default nodeTypes;
