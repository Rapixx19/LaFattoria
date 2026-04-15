import type { Config } from 'tailwindcss';
import { lafattoriaPreset } from '@lafattoria/ui/tailwind';

const config: Config = {
  presets: [lafattoriaPreset as Config],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
