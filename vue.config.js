const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  pages: {
    index: {
      entry: "./src/index.ts",
    },
  },
  publicPath: process.env.NODE_ENV === "production" ? "/ShopProj /" : "/",
  devServer: {
    /**
     * * Порт локальной разработки текущего приложения
     */
    port: 5000,
    hot: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
  assetsDir: "",
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@/components": path.resolve(__dirname, "./src/components"),
      },
    },
  },
  transpileDependencies: false,
});
