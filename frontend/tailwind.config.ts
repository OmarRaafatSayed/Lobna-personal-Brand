import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rose:  {
          DEFAULT: 'rgb(253 147 195)',
          light:   'rgb(255 232 243)',
          dark:    'rgb(232 96 154)',
        },
        cream:  'rgb(251 249 247)',
        green:  { DEFAULT: 'rgb(178 186 12)', brand: 'rgb(178 186 12)' },
        blue:   { DEFAULT: 'rgb(142 181 210)', brand: 'rgb(142 181 210)' },
        ink:    {
          DEFAULT: 'rgb(15 10 20)',
          2:       'rgb(26 16 37)',
          3:       'rgb(42 16 64)',
        },
        // aliases used in admin pages
        'blue-brand':  'rgb(142 181 210)',
        'green-brand': 'rgb(178 186 12)',
      },
      fontFamily: {
        display: ['Boldonse', 'cursive'],
        heading: ['Edu QLD Beginner', 'cursive'],
        edu:     ['Edu QLD Beginner', 'cursive'],
        body:    ['Bricolage Grotesque', 'sans-serif'],
      },
      boxShadow: {
        rose:      '0 8px 24px rgba(253,147,195,0.4)',
        'rose-lg': '0 16px 48px rgba(253,147,195,0.5)',
        glass:     '0 8px 32px rgba(15,10,20,0.08)',
        card:      '0 4px 24px rgba(15,10,20,0.06)',
        'card-lg': '0 12px 40px rgba(15,10,20,0.10)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(160deg,#0F0A14 0%,#2A1040 55%,#3D1060 100%)',
        'hero':          'linear-gradient(160deg,#0F0A14 0%,#2A1040 55%,#3D1060 100%)',
        'dark-g':        'linear-gradient(135deg,#0F0A14 0%,#2A1040 100%)',
        'gradient-rose': 'linear-gradient(135deg,#FD93C3 0%,#E8609A 100%)',
        'rose-g':        'linear-gradient(135deg,#FD93C3 0%,#E8609A 100%)',
        'blue-g':        'linear-gradient(135deg,#8EB5D2 0%,#5A90B8 100%)',
        'green-g':       'linear-gradient(135deg,#B2BA0C 0%,#8A920A 100%)',
        'cream-g':       'linear-gradient(160deg,#FBF9F7 0%,#FFE8F3 50%,#FBF9F7 100%)',
      },
      animation: {
        'float':      'float 8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'marquee':    'marquee 20s linear infinite',
        'spin-slow':  'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-20px)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
