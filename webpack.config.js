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
        port: '8080',
        static: ['./public'],
        hot: true,
        liveReload: true
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.scss', '.svg'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                // otherwise ts-loader type-checks every file tsconfig's "include" matches (test
                // files among them), not just what's actually bundled - pulling in test-only
                // devDependencies (@types/jest etc.) as a hard requirement for the app build
                options: { projectReferences: true, onlyCompileBundledFiles: true },
            },
            {
                test: /\.module\.s(a|c)ss$/,
                use: [
                    'style-loader',
                    'css-modules-typescript-loader',
                    { loader: 'css-loader', options: { modules: { namedExport: false } } },
                    { loader: 'sass-loader', options: { api: 'modern-compiler' } },
                ],
            },
            {
                test: /\.s(a|c)ss$/,
                exclude: /\.module.(s(a|c)ss)$/,
                use: [
                    'style-loader',
                    'css-modules-typescript-loader',
                    'css-loader',
                    { loader: 'sass-loader', options: { api: 'modern-compiler' } },
                ],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ],
    },
    plugins: [
        new Dotenv({
            systemvars: true
        }),
        new MiniCssExtractPlugin({
            filename: isDevelopment ? '[name].css' : '[name].[hash].css',
            chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
        }),
    ],
};
