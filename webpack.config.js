module.exports = {
    entry: ['./src/gridstack.js', './src/gridstack.jQueryUI.js'],
    target: 'web',
    externals: {
        jquery: 'jQuery',
        lodash: '_'
    },
    output: {
        path: __dirname,
        filename: 'dist/gridstack.js'
    }
};
