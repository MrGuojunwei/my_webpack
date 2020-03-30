/*
 * @Description: 打包配置文件
 * @Author: 郭军伟
 * @Date: 2020-03-30 12:22:39
 * @lastEditTime: Do not edit
 */
const path = require('path');
const Plugin1 = require('./plugins/Plugin1');
const Plugin2 = require('./plugins/Plugin2');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    path.resolve(__dirname, 'loaders/style-loader'),
                    path.resolve(__dirname, 'loaders/less-loader')
                ]
            }
        ]
    },
    plugins: [
        new Plugin1(),
        new Plugin2()
    ]
}