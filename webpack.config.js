/* --- plugins --- */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");

/* --- customize webpack options with mode --- */
let mode = 'development';
if (process.env.NODE_ENV === 'production') {
  mode = 'production';
}

const getDevServerOptions = () => (mode === 'production' ? {} : {
  devServer: {
    port: 3000,
    hot: true,
    static: path.join(__dirname, 'dist'),
    compress: true
  },
});

const getTargetCSSLoaderOptions = () => {
  return mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader';
}

const getSourceMapsOptions = () => () => (mode === 'production' ? {} : {
  devtool: 'source-map'
});

const getESLintPlugin = () => (mode === 'production' ? [] : [new ESLintPlugin({ extensions: ['ts', 'js'] })]);

/* --- webpack config --- */
module.exports = {
  entry: './src/index.ts', // where to start looking for modules
  output: {
    path: path.resolve(__dirname, 'dist'), // output path of  bundle
    filename: '[name].[hash].js',
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.js'], // tells Webpack what file types to look for in which order during module resolution
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@pages": path.resolve(__dirname, "src/pages/"),
      "@icons": path.resolve(__dirname, "src/assets/icons/"),
      "@images": path.resolve(__dirname, "src/assets/images/"),
      "@utils": path.resolve(__dirname, "src/utils/"),
      "@components": path.resolve(__dirname, 'src/components/'),
      "@containers": path.resolve(__dirname, "src/containers/"),
      "@styles": path.resolve(__dirname, "src/styles/"),
      "@store": path.resolve(__dirname, "src/store/"),
      "@routes": path.resolve(__dirname, "src/routes/")
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      usedExports: true
    },
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: extendDefaultPlugins([
                    {
                      name: "removeViewBox",
                      active: false,
                    },
                    {
                      name: "addAttributesToSVGElement",
                      params: {
                        attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                      },
                    },
                  ]),
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  ...getSourceMapsOptions(),
  ...getDevServerOptions(),
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader"
      },
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        loader: "swc-loader"
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          getTargetCSSLoaderOptions(),
          'css-loader',
          {
            loader:'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    // add auto-prefixes
                    "postcss-preset-env",
                    {
                      // options
                    }
                  ]
                ]
              }
            }
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
      },
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets/images', to: './assets/images' },
        { from: 'src/assets/icons', to: './assets/icons' },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    ...getESLintPlugin()
  ],
};
