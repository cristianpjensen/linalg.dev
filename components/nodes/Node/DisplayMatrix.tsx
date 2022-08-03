import TeX from "@matejmazur/react-katex";

import { displayRounded } from "../../helpers";
import { Matrix } from "../types";

type IDisplayMatrixProps = {
	matrix: Matrix;
};

const DisplayMatrix = ({ matrix: m }: IDisplayMatrixProps) => {
	return (
    <TeX
      math={`\\begin{bmatrix}
        ${displayRounded(m[0])} & ${displayRounded(m[1])} & ${displayRounded(m[2])} \\\\
        ${displayRounded(m[3])} & ${displayRounded(m[4])} & ${displayRounded(m[5])} \\\\
        ${displayRounded(m[6])} & ${displayRounded(m[7])} & ${displayRounded(m[8])}
      \\end{bmatrix}`}
      block
    />
	);
};

export default DisplayMatrix;
