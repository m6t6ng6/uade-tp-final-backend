const path = require( 'path' );
const nodeExternals = require( 'webpack-node-externals' );
const NodemonPlugin = require( 'nodemon-webpack-plugin' );
const { ModuleFilenameHelpers } = require('webpack');

module.exports = {
	mode: 'development',
	target: 'node',
	entry: {
		app: path.resolve( __dirname, 'src', 'app.js' )
	},
	output: {
		path: path.resolve( __dirname, 'dist' ),
		filename: 'bundle.js'
	},
	externals: [nodeExternals() ],
	module: {
		rules: [
			{
				test: /\/.jsS/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},
	plugins: [
		new NodemonPlugin()
	],
	devtool: 'inline-source-map',
};