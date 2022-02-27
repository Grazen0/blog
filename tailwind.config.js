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
			},
			fontFamily: {
				display: 'Rubik',
			},
		},
	},
	plugins: [],
};