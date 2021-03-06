const StylelintWebpackPlugin = require('stylelint-webpack-plugin');
const MiniProgramWebpackPlugin = require('miniprogram-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const utils = require('./utils');

const config = require(`${process.cwd()}/config`);

const srcDir = utils.resolve(path.parse(config.entry).dir);

const parseAlias = () => {
	const alias = {
		'@': srcDir,
	};
	for (const k in config.alias) {
		alias[k] = utils.resolve(config.alias[k]);
	}
	return alias;
};

module.exports = {
	entry: {
		app: utils.resolve(config.entry)
	},
	output: {
		filename: '[name].js',
		path: utils.resolve('dist')
	},
	//must not be eval
	devtool: 'none',
	resolve: {
		extensions: ['.js', '.ts'],
		modules: [srcDir, 'node_modules'],
		alias: parseAlias(),
		symlinks: false
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true
						}
					},
					{
						loader: 'eslint-loader'
					}
				]
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader'
					},
					{
						loader: 'tslint-loader'
					}
				]
			},
			{
				test: /\.(sa|sc|c)ss$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'file-loader',
						options: {
							useRelativePath: true,
							name: `[name].wxss`,
							context: srcDir,
						},
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'sass-loader'
					}
				],
			},
			{
				test: /\.(wxss|wxs|wxml|json)\??.*$/,
				type: 'javascript/auto',
				loader: 'url-loader'
			},
			{
				test: /\.(woff|woff2|eot|ttf|svg|png|gif|jpeg|jpg)\??.*$/,
				loader: 'url-loader',
				query: {
					limit: 50000
				}
			}
		]
	},
	stats: {
		colors: true,
		hash: true,
		cached: true
	},
	plugins: [
		new CopyWebpackPlugin(
			[{ from: './', to: './' }],
			{
				ignore: ['*.js', '*.css', '*.ts', '*.scss', '*.less', '*.sass', '*.wxss', '*.wxml', '*.json'],
				context: srcDir,
			}
		),
		new MiniProgramWebpackPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new StylelintWebpackPlugin()
	]
};
