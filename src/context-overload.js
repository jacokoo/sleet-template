import { Context } from 'sleet/lib/context';
// import { Attribute } from 'sleet/lib/ast/attribute';

import { BlockTagCompiler } from './compiler/block-tag';
import { Segment } from './compiler/segment';

const oldSub = Context.prototype.sub;
let counter = 0;

Object.assign(Context.prototype, {
    getGeneratedAndClear: function() {  // eslint-disable-line object-shorthand
        let result = [];
        for (let ctx = this; ctx; ctx = ctx.parent) {
            if (ctx._result.length === 0) continue;
            result = ctx._result.concat(result);
            ctx._result = [];
        }
        return result.join('');
    },

    getPath: function() {   // eslint-disable-line object-shorthand
        let result = null;
        for (let ctx = this; ctx.parent; ctx = ctx.parent) {
            if (ctx._tag.name === 'else') continue;
            result = result !== null ? `${ctx.index},${result}` : ctx.index;
        }
        return result;
    },

    sub: function(tag, idt) {   // eslint-disable-line object-shorthand
        let indent = idt || 0;
        if (this.getCompiler(tag) instanceof BlockTagCompiler) indent -= 1;
        const ctx = oldSub.call(this, tag, indent);
        ctx.index = this._children.indexOf(ctx);
        ctx.seqId = counter ++;

        // const attr = new Attribute('sleet-seq', [new Attribute.Quoted(ctx.seqId)]);
        // tag.addAttributeGroup(new Attribute.Group([attr]));

        return ctx;
    },

    startSegment: function(type, name) {    // eslint-disable-line object-shorthand
        let segments = this.root.segments;
        let stack = this.root.segmentStack;
        if (!segments) {
            segments = this.root.segments = [];
            stack = this.root.segmentStack = [];
        }

        if (stack.length > 0) {
            stack[stack.length - 1].append(this.getGeneratedAndClear());
        }

        const segment = new Segment(segments.length, type, this, name);
        segments.push(segment);
        stack.push(segment);

        return segment;
    },

    endSegment: function() {    // eslint-disable-line object-shorthand
        const segment = this.root.segmentStack.pop();
        segment.append(this.getGeneratedAndClear());
        if (this.currentSegment()) this.currentSegment().append(segment.placeholder(), true);
        return segment;
    },

    currentSegment: function() {    // eslint-disable-line object-shorthand
        return this.root.segmentStack[this.root.segmentStack.length - 1];
    }
});
