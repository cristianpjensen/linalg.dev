import * as React from "react";
import { IconProps } from "./types";

export const TransformationIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
					d="M8.50103 3.96503C8.57939 4.15775 8.84511 4.17604 8.94913 3.99588L9.31862 3.3559C11.0345 4.34658 11.8948 5.26323 12.1604 6.25463C12.4261 7.24604 12.1394 8.47006 11.1487 10.186C11.0106 10.4251 11.0925 10.7309 11.3317 10.869C11.5708 11.0071 11.8766 10.9251 12.0147 10.686C13.0428 8.90528 13.4978 7.38211 13.1264 5.99581C12.7549 4.60953 11.5993 3.51796 9.81862 2.48988L10.188 1.85014C10.292 1.66998 10.1433 1.449 9.93721 1.4775L7.93839 1.75397C7.7769 1.77631 7.67965 1.94475 7.74105 2.09577L8.50103 3.96503ZM4.62912 2.46237C4.53412 2.34838 4.3934 2.28246 4.24501 2.28246C4.09662 2.28246 3.95589 2.34838 3.8609 2.46237L1.8609 4.86237C1.68411 5.07451 1.71278 5.38979 1.92492 5.56658C2.13705 5.74336 2.45234 5.7147 2.62912 5.50256L3.74501 4.16349L3.74501 8.78247C3.74501 8.93252 3.81111 9.06713 3.91577 9.15878L7.16068 12.4037L5.42477 12.2459C5.14976 12.2209 4.90655 12.4235 4.88155 12.6986C4.85655 12.9736 5.05922 13.2168 5.33423 13.2418L8.4455 13.5246C8.59328 13.538 8.73939 13.4851 8.84432 13.3802C8.94925 13.2753 9.00215 13.1292 8.98871 12.9814L8.70587 9.87013C8.68087 9.59512 8.43767 9.39245 8.16266 9.41745C7.88765 9.44245 7.68498 9.68565 7.70998 9.96066L7.86779 11.6966L4.74501 8.5738L4.74501 4.16349L5.8609 5.50256C6.03768 5.7147 6.35296 5.74336 6.5651 5.56658C6.77724 5.38979 6.8059 5.07451 6.62912 4.86237L4.62912 2.46237Z"
					fill={color}
					fillRule="evenodd"
					clipRule="evenodd"
				/>
			</svg>
		);
	}
);

export default TransformationIcon;
