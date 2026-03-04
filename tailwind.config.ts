import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F7F4EE',
        ink: '#111111',
        inkLight: '#444444',
        muted: '#888888',
        border: '#E8E3D8',
        card: '#FFFFFF',
        red: '#E8412C',
        redLight: '#FFF0EE',
        green: '#22C55E',
        greenLight: '#F0FFF4',
        navy: '#1A1F36',
        tag: '#E8E3D8',
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'sans-serif'],
        noto: ['var(--font-noto)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
