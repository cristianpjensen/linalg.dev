const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				math: ["Computer Modern", "serif"],
			},
			boxShadow: {
				b1: "0 0 0 1px var(--tw-shadow-color)",
				b2: "0 0 0 2px var(--tw-shadow-color)",
			},
			colors: {
				offblack: "#0a0a0a",
				offwhite: "#f6f6f6",

				"green-ext-900": "#0f2c13",
				"green-ext-800": "#1e5725",
				"green-ext-700": "#32913e",
				"green-ext-600": "#4ac159",
				"green-ext-500": "#66ca74",
				"green-ext-400": "#96db9f",
				"green-ext-300": "#cbedcf",
				"green-ext-200": "#e2f5e5",
				"green-ext-100": "#f1faf2",
				"green-ext-50": "#fafdfb",

				"yellow-ext-900": "#362c00",
				"yellow-ext-800": "#584700",
				"yellow-ext-700": "#876d00",
				"yellow-ext-600": "#b08e00",
				"yellow-ext-500": "#f3c400",
				"yellow-ext-400": "#ffdd4d",
				"yellow-ext-300": "#fff0af",
				"yellow-ext-200": "#fff6ce",
				"yellow-ext-100": "#fffbed",
				"yellow-ext-50": "#fffef9",

				"red-ext-900": "#350304",
				"red-ext-800": "#550507",
				"red-ext-700": "#85080b",
				"red-ext-600": "#aa0a0e",
				"red-ext-500": "#e20e13",
				"red-ext-400": "#f55a5e",
				"red-ext-300": "#fab3b5",
				"red-ext-200": "#feeaeb",
				"red-ext-100": "#fef1f2",
				"red-ext-50": "#fff8f8",
			},
		},
	},
	variants: {
		boxShadow: ["responsive", "hover", "focus", "active", "group-hover"],
	},
	plugins: [
		plugin(({ addVariant, e }) => {
			addVariant(
				"data-state-checked",
				({ modifySelectors, separator }) => {
					modifySelectors(({ className }) => {
						return `.${e(
							`data-state-checked${separator}${className}`
						)}[data-state='checked']`;
					});
				}
			);
		}),
	],
};
