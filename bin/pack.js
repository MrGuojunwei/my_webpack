#! /usr/bin/env node
const path = require('path');
const Compiler = require('../lib/Compiler');
// 1.拿到配置文件
const config = require(path.resolve('__dirname', '..', 'webpack.config.js'));

// 创建编译对象
let compiler = new Compiler(config);

// 执行编译
compiler.run();

// console.log(compiler.modules);