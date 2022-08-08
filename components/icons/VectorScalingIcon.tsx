import * as React from "react";
import { IconProps } from "./types";

export const VectorScalingIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
					d="M12.4269 3.11527C12.4403 2.96749 12.3874 2.82138 12.2825 2.71645C12.1776 2.61152 12.0315 2.55862 11.8837 2.57206L8.77242 2.8549C8.49741 2.8799 8.29474 3.1231 8.31974 3.39811C8.34474 3.67312 8.58794 3.87579 8.86295 3.85079L10.5989 3.69298L7.20339 7.08845L4.27249 7.3549C3.99748 7.3799 3.79481 7.6231 3.81981 7.89811C3.84481 8.17312 4.08802 8.37579 4.36302 8.35079L6.09885 8.19299L2.72144 11.5704C2.52618 11.7657 2.52618 12.0822 2.72144 12.2775C2.91671 12.4728 3.23329 12.4728 3.42855 12.2775L4.92361 10.7824C4.9253 10.7808 4.92698 10.7791 4.92865 10.7775L6.80605 8.90008L6.64824 10.636C6.62324 10.911 6.82591 11.1542 7.10092 11.1792C7.37592 11.2042 7.61913 11.0015 7.64413 10.7265L7.91059 7.79547L11.306 4.40009L11.1482 6.136C11.1232 6.41101 11.3258 6.65422 11.6008 6.67922C11.8759 6.70422 12.1191 6.50155 12.1441 6.22654L12.4269 3.11527Z"
					fill={color}
					fillRule="evenodd"
					clipRule="evenodd"
				/>
			</svg>
		);
	}
);

VectorScalingIcon.displayName = "Vector scaling icon";

export default VectorScalingIcon;
