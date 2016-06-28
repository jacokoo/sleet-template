'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplateTagCompiler = undefined;

var _tag = require('sleet/lib/compiler/tag');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TemplateTagCompiler = exports.TemplateTagCompiler = function (_TagCompiler) {
  _inherits(TemplateTagCompiler, _TagCompiler);

  function TemplateTagCompiler() {
    _classCallCheck(this, TemplateTagCompiler);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TemplateTagCompiler).apply(this, arguments));
  }

  return TemplateTagCompiler;
}(_tag.TagCompiler);