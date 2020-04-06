const loaderUtils = require('loader-utils');
const validateOption = require('schema-utils');
const fs = require('fs');


function bannerLoader(source) {
    this.cacheable(true);
    let options = loaderUtils.getOptions(this);
    let cb = this.async();
    let schema = {
        title: 'banner-loader',
        type: 'object',
        properties: {
            text: {
                type: 'string'
            },
            template: {
                type: 'string'
            }
        }
    }
    validateOption(schema, options, 'banner-loader');
    if (options.template) {
        this.addDependency(options.template);
        fs.readFile(options.template, { encoding: 'utf8' }, (err, data) => {
            cb(err, `/*${data}*/${source}`);
        })
    } else {
        cb(null, `/*${options.text}*/${source}`)
    }
}

module.exports = bannerLoader;