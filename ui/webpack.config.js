const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const inProdMode = process.env.NODE_ENV === "production";
const configPlugins = [];
if (inProdMode)
	configPlugins.push(
		new MiniCssExtractPlugin({
			filename: "styles.css"
		})
	);

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "main.js",
		path: resolve(__dirname, "public")
	},
	mode: inProdMode ? "production" : "development",
	resolve: {
		extensions: [".js"]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"],
						sourceMap: !inProdMode
					}
				}
			},
			{
				test: /\.svg$/,
				use: {
					loader: "url-loader",
					options: {
						limit: 8192
					}
				}
			},
			{
				test: /\.s?[ca]ss$/,
				use: [
					inProdMode ? MiniCssExtractPlugin.loader : "style-loader",
					{
						loader: "css-loader",
						options: { sourceMap: !inProdMode }
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: !inProdMode
						}
					}
				]
			}
		]
	},
	plugins: configPlugins,
	devtool: inProdMode ? false : "source-map"
};
