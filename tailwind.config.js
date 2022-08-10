const plugin = require("tailwindcss/plugin");

// Potential colors for nodes should be listed here, since the colors are added
// dynamically, which is only possible if these colors are present in the safe
// list
const colors = ["green-ext", "yellow-ext", "red-ext", "purple-ext", "slate"];
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const properties = ["text", "bg", "shadow", "border"];
const prefixes = ["", "dark:"];

const colorSafeList = [];
for (const property of properties) {
	for (const color of colors) {
		for (const shade of shades) {
			for (const prefix of prefixes) {
				colorSafeList.push(`${prefix}${property}-${color}-${shade}`);
			}
		}
	}
}

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	safelist: colorSafeList,
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				math: ["Computer Modern", "serif"],
			},
			boxShadow: {
				b1: "0 0 0 1px var(--tw-shadow-color)",
				b2: "0 0 0 2px var(--tw-shadow-color)",
			},
			keyframes: {
				fadein: {
					"0%": {
						opacity: 0,
					},
					"100%": {
						opacity: 1,
					},
				},
				fadeout: {
					"0%": {
						opacity: 1,
					},
					"100%": {
						opacity: 0,
					},
				},
			},
			animation: {
				fadein: "fadein 0.4s ease-out",
				"fadein-fast": "fadein 0.1s ease-out",
				"fadein-slow": "fadein 0.7s ease-out",
				fadeout: "fadeout 0.8s ease-out",
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

				"purple-ext-900": "#2c0432",
				"purple-ext-800": "#45074e",
				"purple-ext-700": "#710b80",
				"purple-ext-600": "#900ea4",
				"purple-ext-500": "#c213dc",
				"purple-ext-400": "#dd59f1",
				"purple-ext-300": "#f0b5f9",
				"purple-ext-200": "#f6d5fb",
				"purple-ext-100": "#fbedfd",
				"purple-ext-50": "#fdf6fe",
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
		function ({ addVariant }) {
			addVariant("child", "& > *");
			addVariant("child-hover", "& > *:hover");
			addVariant("grandchild", "& > * > *");
			addVariant("grandchild-hover", "& > * > *:hover");
		},
	],
};
