let loaderUtils = require('loader-utils');

function loader(source) {
    let filename = loaderUtils.interpolateName(this, '[hash:8]_[name].[ext]', {
        content: source
    })
    this.emitFile(filename, source)
    return `module.exports = "../dist/${filename}"`;
}

loader.raw = true; // 二进制
module.exports = loader;