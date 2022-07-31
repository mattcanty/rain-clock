const path = require('path');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    entry: './index.tsx',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'main.js',
    },
    target: 'web',
    watchOptions: {
        poll: true,
        ignored: /node_modules/,
    },
    devServer: {
        port: '9500',
        static: ['./public'],
        hot: true,
        liveReload: true,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.scss'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: { projectReferences: true },
            },
            {
                test: /\.module\.s(a|c)ss$/,
                use: [
                    'style-loader',
                    'css-modules-typescript-loader',
                    { loader: 'css-loader', options: { modules: true } },
                    'sass-loader',
                ],
            },
            {
                test: /\.s(a|c)ss$/,
                exclude: /\.module.(s(a|c)ss)$/,
                use: ['style-loader', 'css-modules-typescript-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    plugins: [
        new Dotenv(),
        new MiniCssExtractPlugin({
            filename: isDevelopment ? '[name].css' : '[name].[hash].css',
            chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
        }),
    ],
};
