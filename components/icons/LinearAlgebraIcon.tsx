import * as React from "react";
import { IconProps } from "./types";

export const LinearAlgebraIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
					d="M7.86994 2C8.00815 2 8.14019 2.0572 8.23471 2.15803L10.3063 4.36775C10.4952 4.56921 10.485 4.88563 10.2835 5.07449C10.0821 5.26336 9.76565 5.25315 9.57679 5.05169L8.36994 3.76439L8.36994 7.84659L11.2508 10.7275L11.1939 8.96384C11.185 8.68784 11.4015 8.45688 11.6775 8.44798C11.9535 8.43907 12.1845 8.6556 12.1934 8.9316L12.2911 11.959C12.2955 12.0971 12.2426 12.2309 12.1449 12.3286C12.0471 12.4264 11.9133 12.4793 11.7752 12.4748L8.74784 12.3772C8.47184 12.3683 8.25532 12.1373 8.26422 11.8613C8.27312 11.5853 8.50408 11.3688 8.78008 11.3777L10.5437 11.4346L7.70742 8.59828L3.85072 9.63168L5.40651 10.4642C5.64999 10.5945 5.74174 10.8975 5.61145 11.141C5.48116 11.3845 5.17817 11.4762 4.93469 11.3459L2.26409 9.91682C2.14224 9.85161 2.05281 9.73887 2.01704 9.60538C1.98127 9.47188 2.00235 9.32954 2.07527 9.21214L3.67353 6.6392C3.81924 6.40462 4.12752 6.33259 4.36209 6.4783C4.59666 6.62401 4.66869 6.93229 4.52298 7.16686L3.5919 8.66576L7.36994 7.65344L7.36994 3.76439L6.1631 5.05169C5.97423 5.25315 5.65781 5.26336 5.45636 5.07449C5.2549 4.88563 5.24469 4.56921 5.43356 4.36775L7.50517 2.15803C7.5997 2.0572 7.73174 2 7.86994 2Z"
					fill={color}
					fillRule="evenodd"
					clipRule="evenodd"
				/>
			</svg>
		);
	}
);

LinearAlgebraIcon.displayName = "Linear algebra icon";

export default LinearAlgebraIcon;
