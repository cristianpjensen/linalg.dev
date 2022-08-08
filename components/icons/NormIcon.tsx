import * as React from "react";
import { IconProps } from "./types";

export const NormIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
					d="M1.5 3C1.77614 3 2 3.22386 2 3.5V11.5C2 11.7761 1.77614 12 1.5 12C1.22386 12 1 11.7761 1 11.5V3.5C1 3.22386 1.22386 3 1.5 3ZM3.5 3C3.77614 3 4 3.22386 4 3.5V11.5C4 11.7761 3.77614 12 3.5 12C3.22386 12 3 11.7761 3 11.5V3.5C3 3.22386 3.22386 3 3.5 3ZM12 3.5C12 3.22386 11.7761 3 11.5 3C11.2239 3 11 3.22386 11 3.5V11.5C11 11.7761 11.2239 12 11.5 12C11.7761 12 12 11.7761 12 11.5V3.5ZM13.5 3C13.7761 3 14 3.22386 14 3.5V11.5C14 11.7761 13.7761 12 13.5 12C13.2239 12 13 11.7761 13 11.5V3.5C13 3.22386 13.2239 3 13.5 3ZM8.5 7.5C8.5 6.94772 8.05228 6.5 7.5 6.5C6.94772 6.5 6.5 6.94772 6.5 7.5C6.5 8.05229 6.94772 8.5 7.5 8.5C8.05228 8.5 8.5 8.05229 8.5 7.5Z"
					fill={color}
					fillRule="evenodd"
					clipRule="evenodd"
				/>
			</svg>
		);
	}
);

NormIcon.displayName = "Norm icon";

export default NormIcon;
