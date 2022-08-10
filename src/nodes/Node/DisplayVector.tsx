import TeX from "@matejmazur/react-katex";

import { displayRounded } from "../helpers";
import { Vector } from "../types";

type IDisplayVectorProps = {
	vector: Vector;
	noValue?: boolean;
};

const DisplayVector = ({ vector, noValue }: IDisplayVectorProps) => {
	return (
		<TeX
			math={
				noValue
					? "\\begin{bmatrix} ? & ? & ? \\end{bmatrix}^\\top"
					: `\\begin{bmatrix}
							${displayRounded(vector.x)}
						& ${displayRounded(vector.y)}
						& ${displayRounded(vector.z)}
						\\end{bmatrix}^\\top`
			}
			className="w-full"
			block
		/>
	);
};

export default DisplayVector;
