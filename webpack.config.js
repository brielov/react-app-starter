const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const DotenvWebpackPlugin = require("dotenv-webpack");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  entry: path.resolve(__dirname, "src", "index.tsx"),

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
  },

  mode: isDev ? "development" : "production",
  devtool: "source-map",

  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },

  /**
   * Loaders
   */
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/env",
                ["@babel/react", { runtime: "automatic" }],
                "@babel/typescript",
              ],
              plugins: [isDev && "react-refresh/babel"].filter(Boolean),
            },
          },
        ],
        exclude: /node_modules/,
      },

      {
        // Regular CSS Files
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: { publicPath: "" } },
          "css-loader",
          "postcss-loader",
        ],
        exclude: /\.module\.css$/,
      },

      {
        // PostCSS Modules
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: { publicPath: "" } },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                compileType: "module",
                mode: "local",
                auto: true,
                localIdentName: "[hash:base64:5]",
                localIdentContext: path.resolve(__dirname, "src"),
              },
            },
          },
          "postcss-loader",
        ],
        include: /\.module\.css$/,
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },

      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
        exclude: /node_modules/,
      },
    ],
  },

  /**
   * Plugins
   */
  plugins: [
    isDev && new ReactRefreshWebpackPlugin(),
    new CleanWebpackPlugin(),
    new DotenvWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: "style.[contenthash].css",
      chunkFilename: "[id].css",
    }),

    new HtmlWebpackPlugin({
      filename: "index.html",
      publicPath: "/",
      template: path.resolve(__dirname, "public", "index.html"),
    }),
  ].filter(Boolean),

  /**
   * Optimizations
   */
  optimization: {
    minimizer: !isDev
      ? [new TerserWebpackPlugin(), new CssMinimizerPlugin()]
      : [],
  },

  /**
   * Dev server
   */
  devServer: {
    compress: true,
    historyApiFallback: true,
    hot: true,
    inline: true,
    overlay: { warnings: true, errors: true },
    port: 3000,
  },
};
