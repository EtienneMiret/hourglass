const path = require ('path');

module.exports = {
    mode: 'production',
    devtool: 'source-map',

    context: __dirname,
    entry: './src/main/ts/index',
    output: {
        path: path.resolve(__dirname, 'build', 'webpack'),
        filename: 'bundle.js'
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ]
    },
};
