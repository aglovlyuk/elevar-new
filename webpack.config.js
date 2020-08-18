const path = require("path");
const fs = require("fs");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminSvgo = require('imagemin-svgo');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
        const parts = item.split(".");
        const name = parts[0];
        const extension = parts[1];
        return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
            inject: false
        });
    });
}

const htmlPlugins = generateHtmlPlugins("./src/html/views");

const config = {
    entry: ["./src/js/index.js", "./src/scss/main.scss"],
    output: {
        filename: "./js/bundle.js"
    },
    devtool: "none",
    mode: "development",
    optimization: {
        minimizer: [
            new TerserPlugin({
                sourceMap: false,
                extractComments: false
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.(sass|scss)$/,
                include: path.resolve(__dirname, "src/scss"),
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {}
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            url: false
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            sourceMap: true,
                            plugins: () => [
                                require("cssnano")({
                                    preset: [
                                        "default",
                                        {
                                            discardComments: {
                                                removeAll: true
                                            }
                                        }
                                    ]
                                })
                            ]
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                include: path.resolve(__dirname, "src/html/includes"),
                use: ["raw-loader"]
            },
            /*{
                test: /\.svg$/i,
                include: /.*icons\.svg/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            publicPath: '',
                        }
                    },
                ]
            }*/
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "./css/main.bundle.css"
        }),
        new CopyWebpackPlugin([
            {
                from: "./src/fonts",
                to: "./fonts"
            },
            {
                from: "./src/favicon",
                to: "./favicon"
            },
            {
                from: "./src/img",
                to: "./img"
            },
            {
                from: "./src/uploads",
                to: "./uploads"
            }
        ]),
        new ImageminPlugin({
            disable: process.env.NODE_ENV !== 'production', // Disable during development
            test: /\.(jpe?g|png|gif)$/i, //|svg
            plugins: [
                imageminMozjpeg({
                    quality: 81,
                    progressive: true
                }),
                imageminSvgo({
                    plugins: [
                        {removeViewBox: false},
                        {removeDimensions: true},
                        {cleanupIDs: false}
                    ]
                })
            ],
            gifsicle: {
                interlaced: true,
                optimizationLevel: 3
            },
            optipng: {
                optimizationLevel: 5
            }
        }),
        new SVGSpritemapPlugin('src/img/icons/**/*.svg', {
            output: {
                //filename: path.resolve(__dirname, 'img/sprite.svg'),
                chunk: {
                    name: 'sprite'
                }
            },
            sprite: {
                prefix: 'icon-'
            }
        }),
        /*new SpriteLoaderPlugin()
        new BrowserSyncPlugin(
            {
                host: 'localhost',
                port: 3000,
                server: { baseDir: ['dist'] }
            },
            {
                reload: true,
                injectCss: true
            }
        )*/
    ].concat(htmlPlugins)
};

module.exports = (env, argv) => {
    if (argv.mode === "production") {
        config.plugins.push(new CleanWebpackPlugin());
    }
    return config;
};
