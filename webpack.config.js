const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/example.js',
    output: {
        path: __dirname,
        filename: './example.js'
    },
    plugins: [
        new HtmlWebpackPlugin()
    ]
};
