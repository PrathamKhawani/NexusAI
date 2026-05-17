/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["'Orbitron'", "sans-serif"],
        mono: ["'Share Tech Mono'", "'Courier New'", "monospace"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        "cyber-black": "#02040a",
        "cyber-dark": "#080c14",
        "cyber-panel": "#0d1117",
        "neon-cyan": "#00f5ff",
        "neon-purple": "#bf00ff",
        "neon-green": "#00ff88",
        "neon-pink": "#ff006e",
        "neon-yellow": "#ffe600",
        "neon-red": "#ff003c",
        "neon-blue": "#0088ff",
      },
      animation: {
        "glitch": "glitch 3s infinite linear alternate-reverse",
        "neon-pulse": "neonPulse 2s ease-in-out infinite",
        "grid-pulse": "gridPulse 8s ease-in-out infinite",
        "typewriter": "typewriter 3s steps(40) 1s 1 normal both",
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0,245,255,0.4), 0 0 40px rgba(0,245,255,0.15)",
        "neon-purple": "0 0 20px rgba(191,0,255,0.4), 0 0 40px rgba(191,0,255,0.15)",
        "neon-green": "0 0 20px rgba(0,255,136,0.4), 0 0 40px rgba(0,255,136,0.15)",
      },
      lineClamp: {
        2: "2",
        3: "3",
      },
    },
  },
  plugins: [],
}
