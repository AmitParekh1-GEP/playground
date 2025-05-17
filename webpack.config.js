const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    entry: './src/main.ts',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.component\.scss$/, // Only treat *.component.scss as CSS Modules
                use: [
                  'style-loader', // Injects styles into DOM
                  {
                    loader: 'css-loader',
                    options: {
                      modules: {
                        namedExport: false,
                        localIdentName: '[name]__[local]' // Generates unique class names
                      }
                    }
                  },
                  'sass-loader' // Compiles SCSS to CSS
                ]
            },        
            {
                test: /\.s[ac]ss$/i,    // Fallback for global SCSS
                exclude: /\.component\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', 
                    'sass-loader'
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body'
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css' // Output filename for CSS
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/assets', to: 'assets' }, // Copy assets folder to dist
                { from: 'src/favicon.ico', to: 'favicon.ico' } // Copy favicon
            ]
        })
    ],
    devServer: {
        static: './dist',
        port: 3000,
        open: true,
    }
};