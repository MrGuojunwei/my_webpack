const path = require('path');
const fs = require('fs');
// const babylon = require('babylon');
const { parse } = require('@babel/parser');
const generator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const ejs = require('ejs');


class Compiler {
    constructor(config) {
        this.config = config;
        // 保存入口路径
        this.entry = config.entry;
        this.entryId = null;
        this.modules = {};
        // 工作路径
        this.root = process.cwd();
    }

    run() {
        // 创建模块的依赖关系
        this.buildModule(path.resolve(this.root, this.entry), true); // 从入口文件开始，创建依赖关系
        // 输出打包后的文件
        this.emitFile();

    }

    getSource(path) {
        const content = fs.readFileSync(path, { encoding: 'utf-8' });
        return content;
    }

    buildModule(modulePath, isEntry) {
        let source = this.getSource(modulePath);
        let relativePath = './' + path.relative(this.root, modulePath);
        if (isEntry) this.entryId = relativePath;

        const { sourceCode, dependencies } = this.parse(source, path.dirname(relativePath));

        this.modules[relativePath] = sourceCode;

        // 递归解析依赖
        dependencies.forEach(dep => { // ./src/a.js
            this.buildModule(path.join(this.root, dep), false);
        })
    }
    // 解析源代码 返回解析后的代码和依赖列表
    parse(source, parentPath) { // AST解析语法树
        const ast = parse(source);
        const dependencies = [];

        traverse(ast, {
            CallExpression(p) {
                let node = p.node;
                if (node.callee.name === 'require') {
                    node.callee.name = '__webpack_require__';
                    let moduleName = node.arguments[0].value;
                    moduleName = moduleName + (path.extname(moduleName) ? '' : '.js');
                    moduleName = './' + path.join(parentPath, moduleName);
                    dependencies.push(moduleName);
                    node.arguments[0].value = moduleName;
                }
            }
        });

        let { code } = generator(ast);

        return {
            dependencies,
            sourceCode: code
        }
    }

    emitFile() {
        let main = path.join(this.config.output.path, this.config.output.filename);
        let assets = {};
        let templateStr = this.getSource(path.resolve(__dirname, 'main.ejs'));
        let code = ejs.render(templateStr, { entryId: this.entryId, modules: this.modules });
        assets[main] = code;
        fs.writeFileSync(main, assets[main]);

    }
}

module.exports = Compiler;