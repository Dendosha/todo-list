const config = {
	mode: 'development',
	entry: {
		main: './src/js/main.js',
		index: './src/js/index.js',
	},
	output: {
		filename: '[name].min.js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			}
		],
	},
}

export default config