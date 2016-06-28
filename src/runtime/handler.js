const chars = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

export class Handler {
    constructor (name, ...types) {
        this._name = name;
        this._types = types;
    }
    name () { return this._name; }
    supportedTypes () { return this._types; }
    patch () {}
}

Object.assign(Handler, {
    TYPE_ROOT: 1,
    TYPE_BLOCK: 2,
    TYPE_ATTRIBUTE: 4,
    TYPE_ELSE: 8,
    TYPE_HELPER: 16
});

export class EscapeableHandler extends Handler {
    constructor (name, escape, ...types) {
        super(name, ...types);
        this._escape = escape !== false;
    }
    name () { return this._escape ? this._name : `@${this._name}`; }
    handle (...args) {
        return this.escape(this.handleIt(...args));
    }
    escape (str) {
        return this._escape ? String(str).replace(/[&<>"'`=]/g, s => chars[s]) : str;
    }
    handleIt () {}
}

export class IfBlockHandler extends Handler {
    constructor () { super('if', Handler.TYPE_BLOCK); }
    handle (options, value) { return value ? options.fn() : options.reverse(); }

    patch () {}
}

export class UnlessBlockHandler extends Handler {
    constructor () { super('unless', Handler.TYPE_BLOCK); }
    handle (options, value) { return !value ? options.fn() : options.reverse(); }

    patch () {}
}

export class EachHandler extends Handler {
    constructor () { super('each', Handler.TYPE_BLOCK); }
    handle (options, items) {
        if (!items || !items.length) {
            return options.reverse();
        }
        return items.map(item => options.fn(item)).join('');
    }
}

export class WithHandler extends Handler {
    constructor () { super('with', Handler.TYPE_BLOCK); }
    handle (options, item) {
        return item ? options.fn(item) : options.reverse();
    }
}

export class EqHandler extends Handler {
    constructor () { super('eq', Handler.TYPE_BLOCK); }
    handle (options, actual, expect) {
        return actual === expect ? options.fn() : options.reverse();
    }
}

export class ElseHandler extends Handler {
    constructor () { super('else', Handler.TYPE_ELSE); }
    handle () { return ''; }
}

export class EchoHandler extends EscapeableHandler {
    constructor (escape) { super('echo', escape, Handler.TYPE_BLOCK, Handler.TYPE_ATTRIBUTE); }
    handleIt (options, ...args) { return args.join(''); }
}

export class EchoHelperHandler extends EscapeableHandler {
    constructor (escape) { super('echo', escape, Handler.TYPE_BLOCK, Handler.TYPE_ATTRIBUTE); }
    handleIt (options, ...args) { return args.join(''); }
}

export class IfHelperHandler extends EscapeableHandler {
    constructor (escape) { super('if', escape, Handler.TYPE_HELPER); }
    handleIt (options, value, truePart, falsePart) { return value ? truePart : falsePart; }
}

export class UnlessHelperHandler extends EscapeableHandler {
    constructor (escape) { super('unless', escape, Handler.TYPE_HELPER); }
    handleIt (options, value, truePart, falsePart) { return !value ? truePart : falsePart; }
}
