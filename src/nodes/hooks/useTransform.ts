import { useCallback, useContext } from "react";

import { TransformContext } from "../../App";
import { Matrix } from "../types";

function useTransform(matrix: Matrix) {
    const { transform } = useContext(TransformContext)
    const callback = useCallback(() => {
        transform(matrix);
    }, [matrix])

    return callback;
}

export default useTransform;
