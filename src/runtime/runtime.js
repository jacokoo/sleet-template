import * as H from './handler';

const handlers = {
};

export function registerHandler (handler) {
    handler.supportedTypes().forEach(t => handlers[`${handler.name()}${t}`] = handler);
};

function findHandler (segment) {
    return handlers[`${segment.n}${segment.t}`];
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


export function handle (template, memo, index, options) {
    const obj = template[index];
    const handler = findHandler(obj);
    const context = options.stack[options.stack.length - 1];
    const args = [];
    obj.b && Object.keys(obj.b).forEach(k => args[+k] = context[obj.b[k]]);
    obj.s && Object.keys(obj.s).forEach(k => args[+k] = obj.s[k]);
    args.unshift({
        fn: function(ctx) {
            if (!obj.text) return '';
            if (ctx) options.stack.push(ctx);
            const result = obj.text(options);
            if (ctx) options.stack.pop();
            return result;
        },
        reverse: function(ctx) {
            if (!obj.e || !template[obj.e].text) return '';
            if (ctx) options.stack.push(ctx);
            const result = template[obj.e].text(options);
            if (ctx) options.stack.pop();
            return result;
        },
        hash: obj.hashes
    });
    return handler.handle(...args);
};
