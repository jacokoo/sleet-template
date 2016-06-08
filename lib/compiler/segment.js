'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Segment = exports.Segment = function () {
    function Segment(index, type, context, name) {
        _classCallCheck(this, Segment);

        this.index = index;
        this.type = type;
        this.id = context.seqId;
        this.name = name;
        this.path = context.getPath();
    }

    _createClass(Segment, [{
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
            return 'segment(' + this.index + ')';
        }
    }]);

    return Segment;
}();

Object.assign(Segment, {
    TYPE_ROOT: 1,
    TYPE_BLOCK: 2,
    TYPE_EMPTY_BLOCK: 3,
    TYPE_ATTRIBUTE: 4,
    TYPE_TEXT: 5
});