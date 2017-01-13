var webpack = require('webpack');

module.exports = {
	entry: './src/main.js',
	output: {
		filename: 'bundle.js',
		path: './dist'
	},
	module: {
		loaders: [{
			test: /\.vue$/,
			loader: 'vue-loader'
		},{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		}]
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.common.js'
		}
	},
	babel: {
		presets: ['es2015']
	}
}