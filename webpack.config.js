const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.ts',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				options: { transpileOnly: true },
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	devServer: {
		contentBase: './dist',
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			templateContent: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
		<title>@carnesen/cli examples</title>
		<link rel="stylesheet" href="/assets/css/fonts.css">
		<style>
			html { font-family: 'MonoLisa', sans-serif; }
			a { color: inherit; text-decoration: inherit; }
		</style>
  </head>
	<body>
			<h2><a href="https://cli.carnesen.com">@carnesen/cli</a> examples</h2>
			<div id="terminal-container"></div>
  </body>
</html>`,
		}),
	],
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'examples'),
		publicPath: '/examples',
	},
	resolve: { extensions: ['.ts', '.tsx', '.js', '.json'] },
};
