var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var dasherize = require('dasherize');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;

var libraryName = 'epicHelper';

var plugins = [], outputFile;

if (env === 'build') {
    plugins.push(new UglifyJsPlugin({ minimize: true }));
    outputFile = dasherize(libraryName) + '.min.js';
} else {
    outputFile = dasherize(libraryName) + '.js';
}

var config = {
    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libraryName,
        libraryTarget: env === 'build' ? 'window' : 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/
            }
        ]
    },

    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js']
    },
    plugins: plugins,
    externals: [nodeExternals()] // in order to ignore all modules in node_modules folder
};

module.exports = config;
