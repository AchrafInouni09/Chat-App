/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'grunge-dark': '#0f0f10',
                'grunge-white': '#e0e0e0',
                'grunge-accent': '#ff2a2a',
                'grunge-gray': '#555555',
                'grunge-green': '#00ff41',
            },
            fontFamily: {
                'display': ['"Abril Fatface"', 'serif'],
                'mono': ['"Space Mono"', 'monospace'],
            },
            backgroundImage: {
                'noise': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%\" height=\"100%\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')",
            },
            animation: {
                'glitch': 'glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite',
                'ticker': 'ticker 20s linear infinite',
                'loading-slide': 'loadingSlide 1s infinite linear',
            },
            keyframes: {
                glitch: {
                    '0%': { transform: 'skew(0deg)' },
                    '20%': { transform: 'skew(-2deg)' },
                    '40%': { transform: 'skew(2deg)' },
                    '60%': { transform: 'skew(-1deg)' },
                    '80%': { transform: 'skew(1deg)' },
                    '100%': { transform: 'skew(0deg)' },
                },
                ticker: {
                    'from': { transform: 'translateX(0)' },
                    'to': { transform: 'translateX(-50%)' },
                },
                loadingSlide: {
                    'from': { left: '-50%' },
                    'to': { left: '100%' },
                }
            }
        },
    },
    plugins: [],
}
