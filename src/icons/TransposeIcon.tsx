import * as React from "react";
import { IconProps } from "./types";

export const TransposeIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
					d="M2 1C1.44771 1 1 1.44772 1 2V13C1 13.5523 1.44772 14 2 14H13C13.5523 14 14 13.5523 14 13V2C14 1.44771 13.5523 1 13 1H2ZM2 2L13 2V13H2V2ZM5.92426 9.92426L9.92426 5.92426L10.5732 6.57322C10.7307 6.73071 11 6.61917 11 6.39645V4.25C11 4.11193 10.8881 4 10.75 4H8.60356C8.38083 4 8.26929 4.26929 8.42678 4.42678L9.07574 5.07574L5.07574 9.07574L4.42678 8.42678C4.26929 8.26929 4 8.38083 4 8.60355V10.75C4 10.8881 4.11193 11 4.25 11H6.39645C6.61917 11 6.73072 10.7307 6.57323 10.5732L5.92426 9.92426Z"
					fill={color}
					fillRule="evenodd"
					clipRule="evenodd"
				/>
			</svg>
		);
	}
);

TransposeIcon.displayName = "Transpose icon";

export default TransposeIcon;
