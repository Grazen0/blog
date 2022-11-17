module.exports = {
	mode: 'jit',
	content: ['src/**/*.{tsx,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				neutral: {
					[350]: 'rgb(187, 187, 187)',
				},
				slate: {
					[950]: 'rgb(14, 18, 34)',
				},
			},
			boxShadow: {
				intense: '0 0 25px -10px black',
			},
			screens: {
				xs: '480px',
			},
			animation: {
				hover: 'float 4s ease-in-out infinite',
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(-4%)' },
					'50%': { transform: 'translateY(4%)' },
				},
			},
		},
	},
	plugins: [],
};
