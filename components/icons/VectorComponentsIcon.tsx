import * as React from "react";
import { IconProps } from "./types";

export const VectorComponentsIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
					d="M12.5858 3.0876C12.5863 2.95497 12.5339 2.82686 12.4393 2.73223C12.3344 2.62731 12.1883 2.57441 12.0405 2.58784L8.92923 2.87068C8.65422 2.89568 8.45155 3.13889 8.47655 3.4139C8.50155 3.68891 8.74475 3.89158 9.01976 3.86658L10.7557 3.70877L2.73226 11.7322C2.537 11.9275 2.537 12.2441 2.73226 12.4393C2.82988 12.537 2.95782 12.5858 3.08576 12.5858C3.08591 12.5858 3.08605 12.5858 3.08619 12.5858H4.21076V11.6679L11.4628 4.41588L11.305 6.15179C11.2856 6.36531 11.4034 6.55965 11.5858 6.64759V8.71079H12.5858V6.46079H12.2278C12.2677 6.3967 12.2936 6.3226 12.3009 6.24233L12.4856 4.21079H12.5858V3.0876ZM12.5858 12.0858V10.9608H11.5858V11.5858H10.9608V12.5858H12.0858H12.5858V12.0858ZM6.46076 12.5858H8.71076V11.5858H6.46076V12.5858Z"
					fill={color}
					fillRule="evenodd"
					clipRule="evenodd"
				/>
			</svg>
		);
	}
);

export default VectorComponentsIcon;
