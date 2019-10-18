const path = require('path');
const pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(pathToPhaser, 'dist/phaser.min.js');
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
            },
            {
                from: "./app/textures",
                to: "assets"
            },
            {
                from: "./app/css",
                to: "css"
            }
        ])
    ],
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' },
            { test: /phaser\.js$/, loader: 'expose-loader?Phaser' }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        host: '127.0.0.1',
        port: 8080,
        open: true
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            phaser: phaser
        }
    }
};