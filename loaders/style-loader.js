/*
 * @Description: 
 * @Author: 郭军伟
 * @Date: 2020-03-30 12:23:43
 * @lastEditTime: Do not edit
 */
function styleLoader(source) {
  let style = `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)};
    document.body.appendChild(style)
  `

  return style
}

module.exports = styleLoader;