const withSass = require("@zeit/next-sass");
const withLess = require("@zeit/next-less");
const withCSS = require("@zeit/next-css");

module.exports = withCSS(withSass({
    cssModules: true,
    ...withLess({
        cssLoaderOptions: {
            importLoaders: 3,
            localIdentName: "[local]___[hash:base64:5]",
        },
        lessLoaderOptions: {
        javascriptEnabled: true,
        },
        webpack: (config, {
            isServer
        }) => {
            config.module.rules.unshift({
                test: /\.svg$/,
                use: ["@svgr/webpack"],
            });
            
            return config;
        }

    }),
}));