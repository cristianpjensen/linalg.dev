import React, { useMemo, forwardRef, useRef, useImperativeHandle } from "react";
import * as THREE from "three";

interface LineProps {
	points: Array<THREE.Vector3>;

	/**
	 * Either a CSS color name or an array there of, representing a gradient.
	 * @default white
	 */
	color?: string | Array<string>;
	lineWidth?: number;

	/**
	 * Bias added to all colors in the gradient.
	 * @default 0
	 */
	bias?: number;

	opacity?: number;
}

export const Line = forwardRef<THREE.BufferGeometry, LineProps>(
	(props, ref) => {
		const {
			points,
			color = "white",
			lineWidth = 1,
			bias = 0,
			opacity = 1,
		} = props;

		const line = useMemo(() => {
			const isColorSolid = typeof color === "string";

			const geometry = new THREE.BufferGeometry();
			geometry.setFromPoints(points);

			if (!isColorSolid) {
				const colors: Array<number> = [];
				color.forEach((c) => {
					const threeColor = new THREE.Color().setColorName(c);
					colors.push(
						threeColor.r + bias,
						threeColor.g + bias,
						threeColor.b + bias
					);
				});

				const colorAttribute = new Float32Array(colors);

				geometry.setAttribute(
					"color",
					new THREE.BufferAttribute(colorAttribute, 3)
				);
			}

			const material = new THREE.LineBasicMaterial({
				color: isColorSolid ? color : undefined,
				vertexColors: !isColorSolid,
				linewidth: lineWidth,
				opacity,
				transparent: true,
			});

			const line = new THREE.Line(geometry, material);
			line.computeLineDistances();

			return line;
		}, [points, color]);

		const innerRef = useRef<THREE.Line>();

		useImperativeHandle(ref, () =>
			innerRef.current
				? innerRef.current.geometry
				: new THREE.BufferGeometry()
		);

		return <primitive ref={innerRef} object={line}></primitive>;
	}
);

Line.displayName = "Line";
