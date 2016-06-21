'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chars = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

var Handler = exports.Handler = function () {
    function Handler(name) {
        _classCallCheck(this, Handler);

        this._name = name;

        for (var _len = arguments.length, types = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            types[_key - 1] = arguments[_key];
        }

        this._types = types;
    }

    _createClass(Handler, [{
        key: 'name',
        value: function name() {
            return this._name;
        }
    }, {
        key: 'supportedTypes',
        value: function supportedTypes() {
            return this._types;
        }
    }, {
        key: 'patch',
        value: function patch() {}
    }]);

    return Handler;
}();

Object.assign(Handler, {
    TYPE_ROOT: 1,
    TYPE_BLOCK: 2,
    TYPE_ATTRIBUTE: 4,
    TYPE_ELSE: 8,
    TYPE_HELPER: 16
});

var EscapeableHandler = exports.EscapeableHandler = function (_Handler) {
    _inherits(EscapeableHandler, _Handler);

    function EscapeableHandler(name, escape) {
        var _Object$getPrototypeO;

        _classCallCheck(this, EscapeableHandler);

        for (var _len2 = arguments.length, types = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            types[_key2 - 2] = arguments[_key2];
        }

        var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(EscapeableHandler)).call.apply(_Object$getPrototypeO, [this, name].concat(types)));

        _this._escape = escape !== false;
        return _this;
    }

    _createClass(EscapeableHandler, [{
        key: 'name',
        value: function name() {
            return this._escape ? this._name : '@' + this._name;
        }
    }, {
        key: 'handle',
        value: function handle() {
            return this.escape(this.handleIt.apply(this, arguments));
        }
    }, {
        key: 'escape',
        value: function escape(str) {
            return this._escape ? String(str).replace(/[&<>"'`=]/g, function (s) {
                return chars[s];
            }) : str;
        }
    }, {
        key: 'handleIt',
        value: function handleIt() {}
    }]);

    return EscapeableHandler;
}(Handler);

var IfBlockHandler = exports.IfBlockHandler = function (_Handler2) {
    _inherits(IfBlockHandler, _Handler2);

    function IfBlockHandler() {
        _classCallCheck(this, IfBlockHandler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(IfBlockHandler).call(this, 'if', Handler.TYPE_BLOCK));
    }

    _createClass(IfBlockHandler, [{
        key: 'handle',
        value: function handle(options, value) {
            return value ? options.fn() : options.reverse();
        }
    }, {
        key: 'patch',
        value: function patch() {}
    }]);

    return IfBlockHandler;
}(Handler);

var UnlessBlockHandler = exports.UnlessBlockHandler = function (_Handler3) {
    _inherits(UnlessBlockHandler, _Handler3);

    function UnlessBlockHandler() {
        _classCallCheck(this, UnlessBlockHandler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(UnlessBlockHandler).call(this, 'unless', Handler.TYPE_BLOCK));
    }

    _createClass(UnlessBlockHandler, [{
        key: 'handle',
        value: function handle(options, value) {
            return !value ? options.fn() : options.reverse();
        }
    }, {
        key: 'patch',
        value: function patch() {}
    }]);

    return UnlessBlockHandler;
}(Handler);

var EachHandler = exports.EachHandler = function (_Handler4) {
    _inherits(EachHandler, _Handler4);

    function EachHandler() {
        _classCallCheck(this, EachHandler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(EachHandler).call(this, 'each', Handler.TYPE_BLOCK));
    }

    _createClass(EachHandler, [{
        key: 'handle',
        value: function handle(options, items) {
            if (!items || !items.length) {
                return options.reverse();
            }
            return items.map(function (item) {
                return options.fn(item);
            }).join('');
        }
    }]);

    return EachHandler;
}(Handler);

var WithHandler = exports.WithHandler = function (_Handler5) {
    _inherits(WithHandler, _Handler5);

    function WithHandler() {
        _classCallCheck(this, WithHandler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(WithHandler).call(this, 'with', Handler.TYPE_BLOCK));
    }

    _createClass(WithHandler, [{
        key: 'handle',
        value: function handle(options, item) {
            console.log(options, item);
            return item ? options.fn(item) : options.reverse();
        }
    }]);

    return WithHandler;
}(Handler);

var EqHandler = exports.EqHandler = function (_Handler6) {
    _inherits(EqHandler, _Handler6);

    function EqHandler() {
        _classCallCheck(this, EqHandler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(EqHandler).call(this, 'eq', Handler.TYPE_BLOCK));
    }

    _createClass(EqHandler, [{
        key: 'handle',
        value: function handle(options, actual, expect) {
            return actual === expect ? options.fn() : options.reverse();
        }
    }]);

    return EqHandler;
}(Handler);

var ElseHandler = exports.ElseHandler = function (_Handler7) {
    _inherits(ElseHandler, _Handler7);

    function ElseHandler() {
        _classCallCheck(this, ElseHandler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ElseHandler).call(this, 'else', Handler.TYPE_ELSE));
    }

    _createClass(ElseHandler, [{
        key: 'handle',
        value: function handle() {
            return '';
        }
    }]);

    return ElseHandler;
}(Handler);

var EchoHandler = exports.EchoHandler = function (_EscapeableHandler) {
    _inherits(EchoHandler, _EscapeableHandler);

    function EchoHandler(escape) {
        _classCallCheck(this, EchoHandler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(EchoHandler).call(this, 'echo', escape, Handler.TYPE_BLOCK, Handler.TYPE_ATTRIBUTE));
    }

    _createClass(EchoHandler, [{
        key: 'handleIt',
        value: function handleIt(options) {
            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
            }

            return args.join('');
        }
    }]);

    return EchoHandler;
}(EscapeableHandler);

var EchoHelperHandler = exports.EchoHelperHandler = function (_EscapeableHandler2) {
    _inherits(EchoHelperHandler, _EscapeableHandler2);

    function EchoHelperHandler(escape) {
        _classCallCheck(this, EchoHelperHandler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(EchoHelperHandler).call(this, 'echo', escape, Handler.TYPE_BLOCK, Handler.TYPE_ATTRIBUTE));
    }

    _createClass(EchoHelperHandler, [{
        key: 'handleIt',
        value: function handleIt(options) {
            for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                args[_key4 - 1] = arguments[_key4];
            }

            return args.join('');
        }
    }]);

    return EchoHelperHandler;
}(EscapeableHandler);

var IfHelperHandler = exports.IfHelperHandler = function (_EscapeableHandler3) {
    _inherits(IfHelperHandler, _EscapeableHandler3);

    function IfHelperHandler(escape) {
        _classCallCheck(this, IfHelperHandler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(IfHelperHandler).call(this, 'if', escape, Handler.TYPE_HELPER));
    }

    _createClass(IfHelperHandler, [{
        key: 'handleIt',
        value: function handleIt(options, value, truePart, falsePart) {
            return value ? truePart : falsePart;
        }
    }]);

    return IfHelperHandler;
}(EscapeableHandler);

var UnlessHelperHandler = exports.UnlessHelperHandler = function (_EscapeableHandler4) {
    _inherits(UnlessHelperHandler, _EscapeableHandler4);

    function UnlessHelperHandler(escape) {
        _classCallCheck(this, UnlessHelperHandler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(UnlessHelperHandler).call(this, 'unless', escape, Handler.TYPE_HELPER));
    }

    _createClass(UnlessHelperHandler, [{
        key: 'handleIt',
        value: function handleIt(options, value, truePart, falsePart) {
            return !value ? truePart : falsePart;
        }
    }]);

    return UnlessHelperHandler;
}(EscapeableHandler);