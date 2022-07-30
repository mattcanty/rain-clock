const path = require('path');

module.exports = {
    mode: 'development',
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
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: { projectReferences: true },
            },
        ],
    },
};
