const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const LoadablePlugin = require('@loadable/webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = x => {
    if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'production') {
        throw new Error(`NODE_ENV must we either 'development' or 'production', but got '${process.env.NODE_ENV}'.`);
    }

    console.log(`Generating ${process.env.NODE_ENV} server bundle at location: ${process.env.SERVER_BUNDLE_RELATIVE_OUTPUT_FOLDER}`);

    let plugins = [];
    plugins.push(new CleanWebpackPlugin());
    plugins.push(new webpack.NormalModuleReplacementPlugin(
        /\/iconv-loader$/, 'node-noop'
    ));
    plugins.push(new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL)
        }
    }));
    plugins.push(new CheckerPlugin());
    plugins.push(new LoadablePlugin());

    return {
        devtool: 'source-map',
        entry: {
            "server-bundle": path.join(__dirname, 'src/HypernovaAllComponents.ts')
        },
        target: 'node',
        //    externals: [nodeExternals()],
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, process.env.SERVER_BUNDLE_RELATIVE_OUTPUT_FOLDER),
            filename: '[name].js',
            pathinfo: true
        },
        mode: process.env.NODE_ENV,
        optimization: {
            minimizer: [new TerserPlugin()],
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    include: path.join(__dirname, 'src'),
                    use: [
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                configFileName: 'tsconfig.server-bundle.json',
                                silent: false,
                                useCache: false,
                                instance: 'at-server',
                                reportFiles: [
                                    'src/**/*.{ts,tsx}'
                                ],
                                useBabel: true,
                                babelCore: '@babel/core'
                            }
                        }
                    ]
                },
                {   // remove the included App.css from the resulting server-bundle
                    test: path.resolve(__dirname, 'App.css'),
                    use: 'null-loader'
                },
                {
                    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                    loader: require.resolve('url-loader'),
                    options: {
                        limit: 10000,
                        name: 'static/media/[name].[hash:8].[ext]',
                    },
                },
            ]
        },
        plugins: plugins,
        resolve: {
            alias: {
                assets: path.resolve(__dirname, 'src/assets/'),
            },
            extensions: ['.ts', '.tsx', ".js", ".jsx"]
        },
    };
};