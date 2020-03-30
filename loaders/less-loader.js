/*
 * @Description: less-loader
 * @Author: 郭军伟
 * @Date: 2020-03-30 12:23:49
 * @lastEditTime: Do not edit
 */

const less = require('less');
function lessLoader(source) {
  let css = '';
  less.render(source, function (err, output) {
    css = css + output.css;
  })

  css = css.replace(/\n/g, '\\n');

  return css;
}

module.exports = lessLoader;