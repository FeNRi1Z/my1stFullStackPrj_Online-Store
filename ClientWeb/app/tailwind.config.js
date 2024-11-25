/** @type {import('tailwindcss').Config} */
module.exports = {
	plugins: [require("flowbite/plugin"),],
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.js"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				primary: {
					100: "#EA9029",
					hover: "#D68324",
					active: "#C27420",
				},
				secondary: {
					50: "#656565",
					100: "#989898",
				},
				background: {
					light: "#F5F5F5",
					dark: "#2B2B2B",
					secondary: {
						dark: "#3D3D3D",
					},
				},
				text: {
					light: "#F5F5F5",
					dark: "#2D3142",
					disabled: "#A8A8A8",
				},
			},
		},
	},
	plugins: [],
};
