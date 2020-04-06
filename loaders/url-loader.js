let loaderUtils = require('loader-utils');
let fileLoader = require('./file-loader');
let mime = require('mime');
function urlLoader(source) {
    let { limit } = loaderUtils.getOptions(this);
    
    // 如果source长度小于limit则进行base64转换
    if (limit && source.length < limit) {
        // 获取图片mime值
        return `module.exports = "data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
    } else {
        return fileLoader.call(this, source);
    }
}

urlLoader.raw = true;
module.exports = urlLoader;