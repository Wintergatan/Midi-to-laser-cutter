const webpack = require('webpack');
const ngToolsWebpack = require('@ngtools/webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const ExtractTextPlugin = require("extract-text-webpack-plugin"); //used to extract all css into 1 file
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

var appEnvironment = process.env.APP_ENVIRONMENT || 'development';
var isProduction = appEnvironment === 'production';
var isTest = appEnvironment === 'test';

console.log('Building with app environment: ' + appEnvironment);

var webpackConfig = {

    entry: {
        'app': isProduction ? './src/main.aot.ts' : './src/main.jit.ts',
        'polyfills': [
            'reflect-metadata',
            'core-js/es6',
            'core-js/es7/reflect',
            'zone.js/dist/zone'
        ]
    },
    output: {
        path: __dirname + '/dist',
        filename: isProduction ? '[name].[hash].js' : '[name].js'
    },
    module: {
        loaders: [{
                test: /\.ts$/,
                loader: isProduction ? '@ngtools/webpack' : ['ts-loader', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
            {
                test: /\.css$/,
                loader: 'raw-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts', '.html', '.css']
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'polyfills'
        }),
        // see https://github.com/angular/angular/issues/11580
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            './src'
        ),
        //new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            title: "Interactor Admin Client",
            inject: "head",
            excludeChunks: ['test']
        }),
        new CopyWebpackPlugin([{
                from: './src/assets',
                to: './assets',
                ignore: ['*/source/**']
            }, {
                from: './src/styles.css'
            }, {
                from: './src/include'
            }

        ]),
        new webpack.DefinePlugin({
            app: {
                environment: JSON.stringify(appEnvironment)
            }
        })/*,
        new Visualizer({
            filename: './statistics.html',
            fields: null,
            stats: {chunkModules: true}
        })*/
    ]
};

if(isTest){
    webpackConfig.entry = { 
        test: './src/main.test.ts'
    };
    webpackConfig.entry = {};
    webpackConfig.output = {};
    webpackConfig.plugins.splice(0, 1);
    webpackConfig.devtool = 'inline-source-map';
}

if (isProduction) {
    webpackConfig.plugins.push(new ngToolsWebpack.AotPlugin({
        tsConfigPath: './tsconfig.json',
        entryModule: './src/app/app.module#AppModule'
    }));
}

module.exports = webpackConfig;
