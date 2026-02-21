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
                // ── Original brand purple scale ───────────────────────────────
                primary: "#550c72",          // Brand purple — buttons, logo, footer bg
                "primary-light": "#8430AB",  // Hover state (was primary2)
                "primary-dark": "#720C5C",   // Active/pressed; price text (was primaryAnalogue)
                "primary-50": "#F5EEF8",     // Subtlest purple tint — hover backgrounds
                "primary-100": "#E8D5F0",    // Input focus rings, light fills
                "primary-200": "#D0AADF",    // Disabled borders
                "primary-300": "#B07DC9",    // Dividers, decorative stripes
                "primary-900": "#2A0639",    // Hero overlays, near-black sections

                // ── Amber accent ──────────────────────────────────────────────
                accent: "#D97706",           // Amber-600: CTAs, price highlights, "View All"
                "accent-hover": "#B45309",   // Amber-700: hover on accent elements
                "accent-light": "#FFFBEB",   // Amber-50: subtle hover bg
                "accent-300": "#FCD34D",     // Amber-300: badge borders, shimmer
                "accent-700": "#92400E",     // Amber-800: body-size text (meets 4.5:1)

                // ── Neutral / Silk backdrop ───────────────────────────────────
                secondary: "#FDE3C9",        // Peach — card hover, btn text on primary (original)
                background: "var(--background)",
                foreground: "var(--foreground)",
                textPrimary: "#221D10",      // Unchanged
                textSecondary: "#101522",    // Original cool dark

                // ── Utility neutrals ──────────────────────────────────────────
                slate: "#E1EDE7",            // Original cool grey-green
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
