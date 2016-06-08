export class Segment {
    constructor (index, type, context, name) {
        this.index = index;
        this.type = type;
        this.id = context.seqId;
        this.name = name;
        this.path = context.getPath();
    }

    append (string, noQuote) {
        if (!string) return this;
        let str = string.replace(/\n/g, '\\n');
        noQuote || (str = `'${str}'`);
        this.text = this.text ? `${this.text}+${str}` : str;
        return this;
    }

    placeholder () {
        return `segment(${this.index})`;
    }
}

Object.assign(Segment, {
    TYPE_ROOT: 1,
    TYPE_BLOCK: 2,
    TYPE_EMPTY_BLOCK: 3,
    TYPE_ATTRIBUTE: 4,
    TYPE_TEXT: 5
})
