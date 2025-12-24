import { text } from "stream/consumers";
import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                //https://www.canva.com/colors/color-palettes/afternoon-craft-project/
                primary: "#550c72",//indigo //"#9C3A65", // Deep Maroon/Silk tone
                secondary: "#FDE3C9",//peach //"#FFD700", // Gold Accent
                background: "var(--background)",
                foreground: "var(--foreground)",
                textPrimary: "#221D10",
                textSecondary: "#101522",
                primary2: "#8430AB",
                primaryAnalogue: "#720C5C", 
                //https://www.canva.com/colors/color-palettes/ice-cream-delight/
                slate: "#E1EDE7",
                blueGrotto: "#0081AC",
            },
            fontFamily: {
                playfair: ['"Playfair Display"', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;
