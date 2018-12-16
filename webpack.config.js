const path = require('path');

const baseConfig = {
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      }
    ],
  },
  stats: {
    builtAt: true,
    errors: false,
    warnings: false,
  },
};

const serverConfig = {
  target: 'node',
  entry: {
    server: './src/server/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'build', 'server'),
    filename: '[name].js',
  },
};

const clientConfig = {
  target: 'web',
  entry: {
    web: './src/client/js/web.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'build', 'client', 'js'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.scss', '.css'],
  },
};

module.exports = [
  Object.assign({}, baseConfig, serverConfig),
  Object.assign({}, baseConfig, clientConfig),
];
