"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// const str = require('./a');
// require('./c.less');
// console.log(str);
var Parent = /*#__PURE__*/function () {
  function Parent() {
    _classCallCheck(this, Parent);

    this.name = 'parent';
  }

  _createClass(Parent, [{
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }]);

  return Parent;
}();

var parent = new Parent();
console.log(parent.getName());