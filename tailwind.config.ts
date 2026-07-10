import type { Config } from "tailwindcss";
import { extendedConfig } from "./src/utils/extendedConfig";

export default {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
    	extend: {
            ...extendedConfig
    	}
    },
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
