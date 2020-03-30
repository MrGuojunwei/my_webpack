class Plugin2 {
    apply(compiler) {
        compiler.hooks.run.tap('run', function () {
            console.log('run-plugin2')
        })
    }
}

module.exports = Plugin2;