// Add this to your tailwind.config.js file
// Create this file in your project root if it doesn't exist

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define static fallback colors that don't use oklch
        background: "#ffffff",
        foreground: "#000000",
        card: "#ffffff",
        "card-foreground": "#000000",
        primary: "#000000",
        "primary-foreground": "#ffffff",
        secondary: "#f5f5f5",
        "secondary-foreground": "#000000",
        muted: "#f5f5f5",
        "muted-foreground": "#6b7280",
        accent: "#f5f5f5",
        "accent-foreground": "#000000",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#a1a1aa",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}