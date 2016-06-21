'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.registerHandler = registerHandler;
exports.handle = handle;

var _handler = require('./handler');

var H = _interopRequireWildcard(_handler);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var handlers = {};

function registerHandler(handler) {
    handler.supportedTypes().forEach(function (t) {
        return handlers['' + handler.name() + t] = handler;
    });
};

function findHandler(segment) {
    return handlers['' + segment.n + segment.t];
};

registerHandler(new H.IfBlockHandler());
registerHandler(new H.UnlessBlockHandler());
registerHandler(new H.EachHandler());
registerHandler(new H.WithHandler());
registerHandler(new H.EqHandler());
registerHandler(new H.ElseHandler());

registerHandler(new H.EchoHandler());
registerHandler(new H.EchoHandler(false));
registerHandler(new H.EchoHelperHandler());
registerHandler(new H.EchoHelperHandler(false));
registerHandler(new H.IfHelperHandler());
registerHandler(new H.IfHelperHandler(false));
registerHandler(new H.UnlessHelperHandler());
registerHandler(new H.UnlessHelperHandler(false));

function handle(template, memo, index, options) {
    var obj = template[index];
    var handler = findHandler(obj);
    var context = options.stack[options.stack.length - 1];
    var args = [];
    obj.b && Object.keys(obj.b).forEach(function (k) {
        return args[+k] = context[obj.b[k]];
    });
    obj.s && Object.keys(obj.s).forEach(function (k) {
        return args[+k] = obj.s[k];
    });
    args.unshift({
        fn: function fn(ctx) {
            if (!obj.text) return '';
            if (ctx) options.stack.push(ctx);
            var result = obj.text(options);
            if (ctx) options.stack.pop();
            return result;
        },
        reverse: function reverse(ctx) {
            if (!obj.e || !template[obj.e].text) return '';
            if (ctx) options.stack.push(ctx);
            var result = template[obj.e].text(options);
            if (ctx) options.stack.pop();
            return result;
        },
        hash: obj.hashes
    });
    return handler.handle.apply(handler, args);
};