import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config = {
  entry: './client/src/app',
  output: {
    path: path.join(__dirname, 'public/dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, 'client/src'),
        exclude: ['node_modules'],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react', 'es2015'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './client/src/index.html'),
    }),
  ],
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 1337,
    overlay: {
      warnings: true,
      errors: true,
    },
    inline: true,
    hot: true,
  },
};

export default config;
