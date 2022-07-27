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
					d="M2 1C1.44771 1 1 1.44772 1 2V13C1 13.5523 1.44772 14 2 14H13C13.5523 14 14 13.5523 14 13V2C14 1.44771 13.5523 1 13 1H2ZM2 2L13 2V13H2V2ZM5.14905 10.5581L10.5581 5.14905L11.1134 5.70442C11.2605 5.85152 11.5125 5.76508 11.5383 5.55865L11.7886 3.55638C11.8088 3.39461 11.6713 3.25708 11.5095 3.2773L9.50721 3.52759C9.30078 3.55339 9.21434 3.80533 9.36145 3.95243L9.85095 4.44194L4.44194 9.85095L3.95243 9.36144C3.80533 9.21434 3.55339 9.30078 3.52759 9.50721L3.27731 11.5095C3.25708 11.6712 3.39461 11.8088 3.55638 11.7886L5.55865 11.5383C5.76508 11.5125 5.85152 11.2605 5.70442 11.1134L5.14905 10.5581Z"
					fill={color}
					fillRule="evenodd"
					clipRule="evenodd"
				/>
			</svg>
		);
	}
);

export default TransposeIcon;
