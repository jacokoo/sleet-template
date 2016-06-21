import { Attribute } from 'sleet/lib/ast/attribute';

function appendObj(obj, key) {
    if (!obj) return '';
    let s = '';

    s += `${key}:{`;
    Object.keys(obj).forEach(k => s += `${k}:${obj[k]},`);
    s = s.slice(0, -1);
    s += `},`
    return s;
}

function appendString(str, key) {
    if (!str) return '';
    return `${key}:'${str}',`;
}

function append(item, key, noComma) {
    if (!item) return '';
    const result = `${key}:${item}`;
    return noComma ? result : result + ','
}

export class Segment {
    constructor (index, type, context, name) {
        this.index = index;
        this.type = type;
        this.id = context.seqId;
        this.name = name;
        this.path = context.getPath();
        this.text = '';
        this.counter = 0;
        this.parent = context.parent && context.parent.seqId;
    }

    handleAttribute (attr) {
        const value = attr.value[0];
        if (attr.name) {
            if (value instanceof Attribute.Quoted || value instanceof Attribute.Identifier) {
                this.addHash(attr.name, `'${value.value}'`);
            } else {
                this.addHash(attr.name, value.value);
            }
            return;
        }

        if (value instanceof Attribute.Identifier) {
            this.addBinding(value.value);
        } else if (value instanceof Attribute.Quoted) {
            this.addStatic(`'${value.value}'`);
        } else {
            this.addStatic(value.value);
        }
    }

    addBinding (name) {
        this.bindings || (this.bindings = {});
        this.bindings[this.counter ++] = `'${name}'`;
        return this;
    }

    addHash (name, value) {
        this.hashes || (this.hashes = {});
        this.hashes[name] = value;
        return this;
    }

    addStatic (value) {
        this.statics || (this.statics = {});
        this.statics[this.counter ++] = value;
        return this;
    }

    append (string, noQuote) {
        if (!string) return this;
        let str = string.replace(/\n/g, '\\n');
        noQuote || (str = `'${str}'`);
        this.text = this.text ? `${this.text}+${str}` : str;
        return this;
    }

    placeholder () {
        return `S(${this.index},o)`;
    }

    setElsePart (part) {
        this.elsePart = part.index;
    }

    getOutput () {
        let result = `{${appendObj(this.bindings, 'b')}${appendObj(this.statics, 's')}` +
            `${appendObj(this.hashes, 'h')}${append(this.id, 'id')}${appendString(this.name, 'n')}` +
            `${appendString(this.path, 'path')}${append(this.parent, 'p')}${append(this.elsePart, 'e')}` +
            `${append(this.type, 't', true)}`;
        if (this.text) {
            result += `,text:function(o){return ${this.text};}`;
        }
        return result + '}';
    }
}

Object.assign(Segment, {
    TYPE_ROOT: 1,
    TYPE_BLOCK: 2,
    TYPE_ATTRIBUTE: 4,
    TYPE_ELSE: 8,
    TYPE_HELPER: 16
});
