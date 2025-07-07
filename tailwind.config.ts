import {nextui} from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(slider|popover).js"
  ],
  theme: {
  	extend: {
		spacing: {
			'header': '96px', 
			'footer': '96px', 
		},
  		backgroundColor: {
				'uni-bg-01': "#008080",
				'uni-bg-02': "#000080",
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: ['"VT323"', "monospace"],
				vt323: ['"VT323"', "monospace"],
  		},
  		screens: {
  			xs: '396px',
  			sm: '640px',
  			md: '768px',
  			lg: '1024px',
  			xl: '1280px',
  			xxl: '1536px',
  			xxxl: '1920px'
  		},
  		keyframes: {
  			wiggle: {
  				'0%, 100%': {
  					transform: 'rotate(-3deg)'
  				},
  				'50%': {
  					transform: 'rotate(3deg)'
  				}
  			},
        'window-appear': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
  		},
  		animation: {
  			'wiggle-zoom': 'wiggle 0.2s ease-in-out 2, scaleAndColor 0.4s ease-in-out 0.5s forwards',
			'window-appear': 'window-appear 0.3s ease-out',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		boxShadow: {
			'win98-outer': 'inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
			'win98-inner': 'inset 1px 1px #0a0a0a, inset -1px -1px #fff',
		},
		backdropBlur: {
			'sm': '4px',
			'md': '8px',
			'lg': '12px',
		},
		transformStyle: {
			'preserve-3d': 'preserve-3d',
		},
		backfaceVisibility: {
			'hidden': 'hidden',
		},
		perspective: {
			'1000': '1000px',
		},
		rotate: {
			'y-180': 'rotateY(180deg)',
			'y-0': 'rotateY(0deg)',
		},
		scale: {
			'108': '1.08',
			'110': '1.10',
		},
		transitionDuration: {
			'220': '220ms',
			'320': '320ms',
			'300': '300ms',
		},
		textShadow: {
			'win98': '1px 1px 0 #000',
		},
		imageRendering: {
			'pixelated': 'pixelated',
		},
		typography: () => ({
			DEFAULT: {
			  css: {
				p: { marginTop: '0.6em', marginBottom: '0.6em' },
				h2: { marginTop: '1.2em', marginBottom: '0.6em' },
				h3: { marginTop: '1em',  marginBottom: '0.5em' },
				ul: { marginTop: '0.4em', marginBottom: '0.4em' },
	
				'ul > li': { paddingLeft: '0.75em' },
				'ol > li': { paddingLeft: '0.75em' },
	
				pre: { marginTop: '0.8em', marginBottom: '0.8em' },
				table: { marginTop: '0.8em', marginBottom: '0.8em' },
			  },
			},
		  }),
	}
	},
  variants: {
    extend: {
      animation: ['hover', 'focus'],
    },
  },
  plugins: [nextui(), require("tailwindcss-animate"), require('@tailwindcss/typography')],
};

export default config;
