const babel = require('@babel/core');
const loaderUtils = require('loader-utils');
const path = require('path');
const fs = require('fs');

function loader(source, map, meta) {
    let cb = this.async();
    // 拿到options
    let options;
    if (typeof this.query === 'string') {
        options = loaderUtils.parseQuery(this.query);
    } else {
        options = loaderUtils.getOptions(this);
    }

    console.log(options);

    babel.transform(source, {
        ...options,
        filename: path.basename(this.resourcePath)
    }, function (error, result) {
        // console.log();
        cb(error, result.code);
    })
}

module.exports = loader;