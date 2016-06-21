'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Segment = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _attribute = require('sleet/lib/ast/attribute');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function appendObj(obj, key) {
    if (!obj) return '';
    var s = '';

    s += key + ':{';
    Object.keys(obj).forEach(function (k) {
        return s += k + ':' + obj[k] + ',';
    });
    s = s.slice(0, -1);
    s += '},';
    return s;
}

function appendString(str, key) {
    if (!str) return '';
    return key + ':\'' + str + '\',';
}

function append(item, key, noComma) {
    if (!item) return '';
    var result = key + ':' + item;
    return noComma ? result : result + ',';
}

var Segment = exports.Segment = function () {
    function Segment(index, type, context, name) {
        _classCallCheck(this, Segment);

        this.index = index;
        this.type = type;
        this.id = context.seqId;
        this.name = name;
        this.path = context.getPath();
        this.text = '';
        this.counter = 0;
        this.parent = context.parent && context.parent.seqId;
    }

    _createClass(Segment, [{
        key: 'handleAttribute',
        value: function handleAttribute(attr) {
            var value = attr.value[0];
            if (attr.name) {
                if (value instanceof _attribute.Attribute.Quoted || value instanceof _attribute.Attribute.Identifier) {
                    this.addHash(attr.name, '\'' + value.value + '\'');
                } else {
                    this.addHash(attr.name, value.value);
                }
                return;
            }

            if (value instanceof _attribute.Attribute.Identifier) {
                this.addBinding(value.value);
            } else if (value instanceof _attribute.Attribute.Quoted) {
                this.addStatic('\'' + value.value + '\'');
            } else {
                this.addStatic(value.value);
            }
        }
    }, {
        key: 'addBinding',
        value: function addBinding(name) {
            this.bindings || (this.bindings = {});
            this.bindings[this.counter++] = '\'' + name + '\'';
            return this;
        }
    }, {
        key: 'addHash',
        value: function addHash(name, value) {
            this.hashes || (this.hashes = {});
            this.hashes[name] = value;
            return this;
        }
    }, {
        key: 'addStatic',
        value: function addStatic(value) {
            this.statics || (this.statics = {});
            this.statics[this.counter++] = value;
            return this;
        }
    }, {
        key: 'append',
        value: function append(string, noQuote) {
            if (!string) return this;
            var str = string.replace(/\n/g, '\\n');
            noQuote || (str = '\'' + str + '\'');
            this.text = this.text ? this.text + '+' + str : str;
            return this;
        }
    }, {
        key: 'placeholder',
        value: function placeholder() {
            return 'S(' + this.index + ',o)';
        }
    }, {
        key: 'setElsePart',
        value: function setElsePart(part) {
            this.elsePart = part.index;
        }
    }, {
        key: 'getOutput',
        value: function getOutput() {
            var result = '{' + appendObj(this.bindings, 'b') + appendObj(this.statics, 's') + ('' + appendObj(this.hashes, 'h') + append(this.id, 'id') + appendString(this.name, 'n')) + ('' + appendString(this.path, 'path') + append(this.parent, 'p') + append(this.elsePart, 'e')) + ('' + append(this.type, 't', true));
            if (this.text) {
                result += ',text:function(o){return ' + this.text + ';}';
            }
            return result + '}';
        }
    }]);

    return Segment;
}();

Object.assign(Segment, {
    TYPE_ROOT: 1,
    TYPE_BLOCK: 2,
    TYPE_ATTRIBUTE: 4,
    TYPE_ELSE: 8,
    TYPE_HELPER: 16
});