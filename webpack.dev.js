const {merge} = require("webpack-merge");
const common = require("./webpack.common.js");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const EslintWebpackPlugin = require("eslint-webpack-plugin");

module.exports = merge(common, {

    mode: "development",

    devtool: "source-map",

    devServer: {

        proxy: [{
            context: ["/icCube"],
            target: "https://livedemo.iccube.com/",
            changeOrigin: true,
            secure: false,
        }],

        port: 4100,
        open: true,

        client: {
            overlay: false,
        },

    },

    plugins: [

        new EslintWebpackPlugin({

            files: "./src/**/*.{ts,tsx}",
            cache: true,
            cacheStrategy: "content",

        }),

        new ForkTsCheckerWebpackPlugin({

            async: true,

        }),

    ],

});

console.log("");
console.log("[WP] mode : ", "development");
console.log("");
