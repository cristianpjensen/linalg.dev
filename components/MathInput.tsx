import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MathfieldElement } from "mathlive";
import { ComputeEngine } from "@cortex-js/compute-engine";

const ce = new ComputeEngine();

export interface IMathInputProps {
	/**
	 * Initial value to be shown. This value will not be updated, so should be not
	 * be used as a source of truth.
	 */
	value: string | number;

	/**
	 * This function is called every time the input is updated.
	 */
	onChange?: (value: number) => void;

	/**
	 * Disable editing of the value.
	 * @default false
	 */
	disabled?: boolean;

	className?: string;
}

const MathInput = ({
	value,
	onChange,
	disabled = false,
	className,
}: IMathInputProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const [mathfield] = useState(new MathfieldElement());

	useLayoutEffect(() => {
		mathfield.value = value.toString();

		// The output should be able to be evaluated, so we only want to accept
		// numbers and functions
		mathfield.virtualKeyboards = "numeric functions";

		ref.current?.appendChild(mathfield);

		return () => {
			ref.current?.removeChild(mathfield);
		};
	}, [ref.current]);

	useEffect(() => {
		mathfield.value = value.toString();
	}, [value]);

	useEffect(() => {
		mathfield.disabled = disabled;
	}, [disabled]);

	useEffect(() => {
		mathfield.onchange = () => {
			// Evaluate expression and update if it is a value (so no variables)
			const expr = ce.parse(mathfield.value);
			const val = expr.N().asFloat;

			if (typeof val === "number" && onChange) {
				onChange(val);
			}
		};
	}, [onChange]);

	useEffect(() => {
		mathfield.className = className || "";
	}, [className]);

	return (
		<div
			ref={ref}
			className="w-full transition-shadow duration-200 cursor-text"
		/>
	);
};

export default MathInput;
