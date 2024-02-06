const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack  = require('webpack');

module.exports = [
    {
        name: 'client',
        context: path.resolve(__dirname, 'src'),
        entry: './index.js',
        devServer: {
            port: 8000,
            historyApiFallback: true,
            hot: true,
        },
        module: {
            exprContextCritical: false,
            rules: [
                {
                    test: /\.(gif|png)$/i,
                    type: 'asset/resource',
                    use: [
                        {
                          loader: 'image-webpack-loader',
                        },
                    ],
                },
                {test: /\.svg/, type: 'asset/inline'},
                {
                    test: /\.handlebars$/,
                    loader: 'handlebars-loader',
                    options: {
                            knownHelpersOnly: false,
                         partialDirs: [
                             path.resolve(__dirname, 'src/components/Plate'),
                             path.resolve(__dirname, 'src/components/Car'),
                             path.resolve(__dirname, 'src/components/Shipment'),
                             path.resolve(__dirname, 'src/components/Cargo'),
                         ],
                        helperDirs: path.join(__dirname, 'src/helpers/'),
			            encoding: 'utf-8',
                    }
                },
                {
                    test: /\.(js)$/, exclude: /node_modules/, use: {
                        loader: 'babel-loader',
                    }
                },
                {
                    test: /\.(css|scss)$/,
                    exclude: /node_modules/,
                    use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'],
                }
            ]
        },
        resolve: {
            alias: {
                '@components': path.resolve(__dirname, 'src/components'),
                '@configs': path.resolve(__dirname, 'src/configs'),
                '@modules': path.resolve(__dirname, 'src/modules'),
                '@static': path.resolve(__dirname, 'static/'),
            },
        },
        output: {
            path: path.resolve(__dirname, 'dist/client'),
            publicPath: '',
            filename: 'index_bundle.js',
            environment: {
                arrowFunction: false
            }
        },
        plugins: [
            new HtmlWebpackPlugin({template: './index.html'}),
        ],
    },
]
