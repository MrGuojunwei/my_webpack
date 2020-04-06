const babel = require('@babel/core');
const loaderUtils = require('loader-utils');
const path = require('path');
const fs = require('fs');

function loader(source, map, meta) {
    let cb = this.async();
    // 拿到loader的options
    let options = loaderUtils.getOptions(this);
    
    babel.transform(source, {
        ...options,
        sourceMap: true,
        filename: path.basename(this.resource)
    }, function (error, result) {
        let { code, map, ast } = result;
        cb(error, code, map);
    })
}

module.exports = loader;