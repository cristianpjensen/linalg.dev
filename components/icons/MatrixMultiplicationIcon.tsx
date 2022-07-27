import * as React from "react";
import { IconProps } from "./types";

export const MatrixMultiplicationIcon = React.forwardRef<SVGSVGElement, IconProps>(
	({ color = "currentColor", ...props }, forwardedRef) => {
		return (
			<svg
				width="15"
				height="15"
				viewBox="0 0 15 15"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				{...props}
				ref={forwardedRef}
			>
				<path
					d="M4 3.5H11C11.2761 3.5 11.5 3.72386 11.5 4V11C11.5 11.2761 11.2761 11.5 11 11.5H4C3.72386 11.5 3.5 11.2761 3.5 11V4C3.5 3.72386 3.72386 3.5 4 3.5ZM2.5 4C2.5 3.17157 3.17157 2.5 4 2.5H11C11.8284 2.5 12.5 3.17157 12.5 4V11C12.5 11.8284 11.8284 12.5 11 12.5H4C3.17157 12.5 2.5 11.8284 2.5 11V4ZM5.5 9.5V5.5H9.5V9.5H5.5ZM4.5 5C4.5 4.72386 4.72386 4.5 5 4.5H10C10.2761 4.5 10.5 4.72386 10.5 5V10C10.5 10.2761 10.2761 10.5 10 10.5H5C4.72386 10.5 4.5 10.2761 4.5 10V5Z"
					fill={color}
					fillRule="evenodd"
					clipRule="evenodd"
				/>
			</svg>
		);
	}
);

export default MatrixMultiplicationIcon;
