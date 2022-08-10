import TeX from "@matejmazur/react-katex";

import { displayRounded } from "../helpers";
import { Vector } from "../types";

type IDisplayVectorProps = {
	vector: Vector;
};

const DisplayVector = ({ vector }: IDisplayVectorProps) => {
	return (
		<TeX
			math={`\\begin{bmatrix}
          ${displayRounded(vector.x)}
        & ${displayRounded(vector.y)}
        & ${displayRounded(vector.z)}
        \\end{bmatrix}^\\top`}
			block
		/>
	);
};

export default DisplayVector;
