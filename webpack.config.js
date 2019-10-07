const path = require('path');
const pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(pathToPhaser, 'dist/phaser-arcade-physics.min');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: './app/src/app.ts',
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
    plugins: [
        // Copy our app"s index.html to the build folder.
        new CopyWebpackPlugin([
            {
                from: "./app/index.html",
                to: "index.html",
            },
            {
                from: "./app/assets",
                to: "assets"
            }
            ,
            {
                from: "./app/textures",
                to: "assets"
            }
        ])
    ],
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: '/node_modules/'
			},
			{
				test: /phaser\.js$/,
				loader: 'expose-loader?Phaser'
			},
            {
                test: /\.css$/,
                use: [ "style-loader", "css-loader" ]
            },
            {
                test: /\.json$/,
                use: "json-loader"
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015"],
                    plugins: ["transform-runtime"]
                }
            }
        ]
	},
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            phaser: phaser
        }
    },
    devServer: {
        host: "0.0.0.0",
        port: 8080,
		open: true,
    }
};
