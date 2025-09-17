import type { Config } from "tailwindcss";

export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-sans)", "system-ui", "sans-serif"],
				heading: ["var(--font-heading)", "system-ui", "sans-serif"],
			},
			colors: {
				background: "var(--color-background)",
				text: "var(--color-text)",
				accent: "var(--color-accent)",
				'accent-light-1': "var(--color-accent-light-1)",
				'accent-light-2': "var(--color-accent-light-2)",
				'accent-light-3': "var(--color-accent-light-3)",
				'accent-light-4': "var(--color-accent-light-4)",
				primary: "var(--color-primary)",
				'primary-dark': "var(--color-primary-dark)",
				'primary-medium-1': "var(--color-primary-medium-1)",
				'primary-medium-2': "var(--color-primary-medium-2)",
				'primary-light-1': "var(--color-primary-light-1)",
				'primary-light-2': "var(--color-primary-light-2)",
				secondary: "var(--color-secondary)",
				'gray-light-1': "var(--color-gray-light-1)",
				'gray-light-2': "var(--color-gray-light-2)",
				'gray-light-3': "var(--color-gray-light-3)",
				'gray-light-4': "var(--color-gray-light-4)",
				'gray-light-5': "var(--color-gray-light-5)",
				'gray-light-6': "var(--color-gray-light-6)",
				'gray-medium': "var(--color-gray-medium)",
				'gray-dark-1': "var(--color-gray-dark-1)",
				'gray-dark-2': "var(--color-gray-dark-2)",
				'accent-transparent': "var(--color-accent-transparent)",
				'primary-transparent': "var(--color-primary-transparent)",
			},
			keyframes: {
				"accordion-down": {
					from: {
						height: "0",
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: "0",
					},
				},
				pulse: {
					// Added pulse keyframe
					"0%, 100%": { opacity: "0.5" },
					"50%": { opacity: "1" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				pulse: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite", // Added pulse animation utility
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/aspect-ratio"), // Added aspect-ratio plugin
	],
} satisfies Config;
