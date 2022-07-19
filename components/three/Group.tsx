import React, { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector, Plane } from "react-three-linalg";

type AcceptedChildren = Vector | Plane;

export interface GroupProps {
	children: React.ReactElement | React.ReactElement[];
}

export type Group = {
	/**
	 * Transform everything in the group with the specified matrix. This checks
	 * whether the transformation is a rotation or not and performs the
	 * interpolation as a rotation if appropriate.
	 */
	transform: (matrix: THREE.Matrix3) => void;
};

/**
 * Make sure that the children can pass a ref to an object that has a transform
 * function on its ref,
 */
export const Group = forwardRef<Group, GroupProps>((props, ref) => {
	const { children } = props;

	const refs = useRef<Array<AcceptedChildren | null>>([]);

	useImperativeHandle(ref, () => ({
		transform: (matrix) => {
			refs.current?.forEach((element) => {
				// If the element already had a ref, we have the ref, and otherwise we
				// have the current on the ref object.
				// @ts-ignore
				if (element?.current) {
					// @ts-ignore
					element.current.transform(matrix);
				} else {
					element?.transform(matrix);
				}
			});
		},
	}));

	return (
		<>
			{React.Children.map(children, (element, index) => {
				// Check if the element already has a ref, and assign it if it does.
				// @ts-ignore
				if (element.ref?.current !== undefined) {
					// @ts-ignore
					refs.current[index] = element.ref;
					return element;
				}

				// If the element does not already have a ref, create a new one.
				const object = React.cloneElement(element, {
					ref: (obj: AcceptedChildren) => {
						refs.current[index] = obj;
					},
					key: index,
				});

				return object;
			})}
		</>
	);
});
