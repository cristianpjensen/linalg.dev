import * as React from "react";
import { IconProps } from "./types";

export const PlaneIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
					d="M12 2.84403C12 2.5091 11.6771 2.26887 11.3563 2.36511L3.35633 4.76511C3.14483 4.82856 3 5.02322 3 5.24402V12.156C3 12.4909 3.32287 12.7311 3.64367 12.6349L11.6437 10.2349C11.8552 10.1714 12 9.97677 12 9.75597V2.84403ZM11.069 1.40729C12.0314 1.11856 13 1.83923 13 2.84403V9.75597C13 10.4184 12.5655 11.0024 11.931 11.1927L3.93102 13.5927C2.9686 13.8814 2 13.1608 2 12.156V5.24402C2 4.58161 2.4345 3.99763 3.06898 3.80728L11.069 1.40729Z"
					fill={color}
					fillRule="evenodd"
					clipRule="evenodd"
				/>
			</svg>
		);
	}
);

PlaneIcon.displayName = "Plane icon";

export default PlaneIcon;
