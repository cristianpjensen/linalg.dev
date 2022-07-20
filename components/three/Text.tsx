import React, {
	forwardRef,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import TeXToSVG from "tex-to-svg";

import { IDENTITYQUATERNION, DURATION } from "./constants";
import { isRotationMatrix } from "./matrixProperties";

export interface TextProps {
	/**
	 * Only use simple text, e.g. `x`, `f(x)`, or `g(x)`. TeXToSVG can handle LaTeX
	 * commands, but my simple implementation of getting it onto a canvas cannot.
	 */
	text: string;
	/**
	 * Position of the vector. It is recommended to not put it directly on
	 * something that you want to label, but rather next to it. This makes it
	 * easier to see what is going on in the space.
	 */
	position: THREE.Vector3;
	/**
	 * Scale of the text.
	 * @default 1
	 */
	scale?: number;
	/**
	 * Color of the object.
	 * @default #E9E9E9
	 */
	color?: string;
	/**
	 * Opacity of the object.
	 */
	opacity?: number;
	/**
	 * Make the text smaller as the camera is further away.
	 * @default true
	 */
	sizeAttenuation?: boolean;
}

export type Text = {
	/**
	 * Move the text to new position.
	 */
	move: (vec: THREE.Vector3) => void;
	/**
	 * Transform the position of the text.
	 */
	transform: (matrix: THREE.Matrix3) => void;
};

export const Text = forwardRef<Text, TextProps>((props, ref) => {
	const {
		text,
		position,
		scale: s = 1,
		color = "#E9E9E9",
		opacity = 0.8,
		sizeAttenuation = true,
	} = props;

	let scale = s;
	if (sizeAttenuation) {
		scale *= 0.5;
	} else {
		scale *= 0.03;
	}

	const [scaleX, setScaleX] = useState(scale);
	const [scaleY, setScaleY] = useState(scale);
	const currentPosition = position.clone();

	const spriteRef = useRef<THREE.Sprite>(null);

	const texture = useMemo(() => {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");

		const pathRegex = /(?<= d=")([a-zA-Z0-9\- ]*)(?="><\/path>)/g;
		const idRegex = /(?<=path id=")([a-zA-Z0-9\\-]*)(?=")/g;
		const viewboxRegex = /(?<=viewBox=")(.*)(?=" xmlns)/;

		// MathJax SVGs are weird...
		const textSVG = TeXToSVG(text);
		const paths = textSVG.match(pathRegex);
		const ids = textSVG.match(idRegex);
		const viewbox = textSVG.match(viewboxRegex);

		if (context && paths && ids && viewbox) {
			const viewBox = viewbox[1].split(" ");
			const yMin = parseFloat(viewBox[1]);
			const width = parseFloat(viewBox[2]);
			const height = parseFloat(viewBox[3]);

			setScaleX((width * scale) / 400);
			setScaleY((height * scale) / 400);

			canvas.width = width;
			canvas.height = height;

			// The SVG is mirrored, so mirror it.
			context.translate(0, height);
			context.scale(1, -1);
			context.translate(0, height + yMin);
			context.fillStyle = color;

			const path2D = new Path2D();

			// The SVG contains multiple paths and they all need to be added to the
			// canvas.
			paths.forEach((path, i) => {
				const additionalPath = new Path2D(path);
				const id = ids[i];

				// The paths are not in the correct position, so they are translated in
				// the SVG.
				const transformRegex = new RegExp(
					`(?<=transform="translate\\()\\d*,\\d*(?=\\)"><use data-c="[a-zA-Z0-9]+" xlink:href="#${id}")`
				);
				const transform = textSVG.match(transformRegex);

				const m = new DOMMatrix();
				m.a = 1;
				m.b = 0;
				m.c = 0;
				m.d = 1;
				m.e = 1;
				m.f = 1;

				if (transform && transform.length > 0) {
					const transformValues = transform[0].split(",");
					const x = parseFloat(transformValues[0]);
					const y = parseFloat(transformValues[1]);

					m.e = x;
					m.f = y;
				}

				path2D.addPath(additionalPath, m);
			});

			context.fill(path2D);
		}

		return canvas;
	}, []);

	function rotate(mat: THREE.Matrix3) {
		const mat4 = new THREE.Matrix4().setFromMatrix3(mat);
		const quaternion = new THREE.Quaternion().setFromRotationMatrix(mat4);

		const currentQuaternion = new THREE.Quaternion();
		const t = { value: 0 };
		new TWEEN.Tween(t)
			.to({ value: 1 }, DURATION)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => {
				currentQuaternion.slerpQuaternions(
					IDENTITYQUATERNION,
					quaternion,
					t.value
				);

				const rotatedPosition = position
					.clone()
					.applyQuaternion(currentQuaternion);
				spriteRef.current?.position.copy(rotatedPosition);
			})
			.onComplete(() => {
				spriteRef.current?.position.copy(currentPosition);
			})
			.start();
	}

	function move(pos: THREE.Vector3) {
		new TWEEN.Tween(position)
			.to(pos, DURATION)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => {
				spriteRef.current?.position.copy(position);
			})
			.start();
	}

	useImperativeHandle(ref, () => ({
		move: (vec) => {
			position.copy(currentPosition);
			currentPosition.copy(vec);
			move(vec);
		},
		transform: (mat) => {
			position.copy(currentPosition);
			currentPosition.applyMatrix3(mat);

			if (isRotationMatrix(mat)) {
				rotate(mat);
			} else {
				move(currentPosition);
			}
		},
	}));

	return (
		<sprite ref={spriteRef} scale={[scaleX, scaleY, 1]} position={position}>
			<spriteMaterial
				sizeAttenuation={sizeAttenuation}
				alphaTest={0.5}
				attach="material"
				opacity={opacity}
				transparent
			>
				<canvasTexture attach="map" image={texture} />
			</spriteMaterial>
		</sprite>
	);
});
