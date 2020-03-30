class Plugin1 {
    apply(compiler) {
        compiler.hooks.entryOption.tap('entryOption', function () {
            console.log('entryOption-plugin1');
        })
    }
}

module.exports = Plugin1;