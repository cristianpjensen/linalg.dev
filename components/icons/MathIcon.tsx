import * as React from "react";
import { IconProps } from "./types";

export const MathIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
					d="M8.55776 4.33206C8.82537 3.58524 9.11631 3.30893 9.33694 3.18944C9.57694 3.05945 9.83819 3.05 10.23 3.05C10.5338 3.05 10.78 2.80376 10.78 2.5C10.78 2.19625 10.5338 1.95 10.23 1.95L10.1962 1.94999C9.83845 1.9497 9.31695 1.94928 8.81306 2.2222C8.27368 2.51434 7.84463 3.06129 7.52223 3.961C7.32333 4.5161 7.19976 5.23881 7.10684 6H5.52501C5.24887 6 5.02501 6.22386 5.02501 6.5C5.02501 6.77614 5.24887 7 5.52501 7H6.99973C6.98709 7.13028 6.97477 7.26005 6.96255 7.38871L6.95692 7.44799C6.83388 8.74318 6.71766 9.9254 6.45209 10.6683C6.18523 11.4149 5.89436 11.6911 5.67369 11.8105C5.43348 11.9406 5.17182 11.95 4.78 11.95C4.47624 11.95 4.23 12.1962 4.23 12.5C4.23 12.8038 4.47624 13.05 4.78 13.05L4.81378 13.05C5.17153 13.0503 5.69334 13.0507 6.19738 12.7779C6.73707 12.4857 7.1662 11.9386 7.4879 11.0386C7.80528 10.1507 7.93031 8.83377 8.04587 7.61654L8.05199 7.55202C8.06973 7.36534 8.08733 7.18101 8.10526 7H9.52501C9.80115 7 10.025 6.77614 10.025 6.5C10.025 6.22386 9.80115 6 9.52501 6H8.21569C8.29978 5.33903 8.40372 4.76196 8.55776 4.33206Z"
					fill={color}
					fillRule="evenodd"
					clipRule="evenodd"
				/>
			</svg>
		);
	}
);

export default MathIcon;