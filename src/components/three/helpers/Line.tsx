import React, { useState, useMemo, forwardRef } from "react";
import * as THREE from "three";

interface LineProps {
	points: Array<THREE.Vector3>;
	color?: string;
	lineWidth?: number;
}

export const Line = forwardRef<THREE.BufferGeometry, LineProps>(
	(props, ref) => {
		const { points, color = "width", lineWidth = 1 } = props;

		const [line] = useState(() => new THREE.Line());

		const geometry = useMemo(() => {
			const geom = new THREE.BufferGeometry();
			geom.setFromPoints(points);

			return geom;
		}, [points]);

		return (
			<primitive geometry={geometry} object={line}>
				<primitive ref={ref} attach="geometry" object={geometry} />
				<lineBasicMaterial
					attach="material"
					color={color}
					linewidth={lineWidth}
				/>
			</primitive>
		);
	}
);
