/*
 * @Description: Compiler
 * @Author: 郭军伟
 * @Date: 2020-03-30 12:22:39
 * @lastEditTime: Do not edit
 */
const path = require('path');
const fs = require('fs');
// const babylon = require('babylon');
const { parse } = require('@babel/parser');
const generator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const ejs = require('ejs');
const { SyncHook } = require('tapable');


class Compiler {
    constructor(config) {
        this.config = config;
        // 保存入口路径
        this.entry = config.entry;
        this.entryId = null;
        this.modules = {};
        // 工作路径
        this.root = process.cwd();
        this.rules = config.module && config.module.rules || [];
        this.hooks = {
            entryOption: new SyncHook(),
            compile: new SyncHook(),
            afterCompile: new SyncHook(),
            afterPlugins: new SyncHook(),
            run: new SyncHook(),
            emit: new SyncHook(),
            done: new SyncHook()
        }

        let plugins = this.config.plugins;
        if (Array.isArray(plugins)) {
            plugins.forEach(plugin => {
                plugin.apply(this);
            })
        }

    }

    run() {
        this.hooks.run.call();
        // 创建模块的依赖关系
        this.buildModule(path.resolve(this.root, this.entry), true); // 从入口文件开始，创建依赖关系
        // 输出打包后的文件
        this.emitFile();

    }

    getSource(path) {
        let content = fs.readFileSync(path, { encoding: 'utf-8' });
        // 对所有内容 使用loader处理
        this.rules.forEach(rule => {
            let len = rule.use.length;
            let loader;
            if (rule.test.test(path)) {
                // 从最后一个loader开始处理
                while (len) {
                    loader = require(rule.use[len - 1]); // 取出最后一个loader
                    content = loader(content);
                    len--;
                }
            }
        })
        return content;
    }

    buildModule(modulePath, isEntry) {
        this.hooks.entryOption.call();
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