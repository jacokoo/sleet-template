import { Context } from 'sleet/lib/context';
import { Attribute } from 'sleet/lib/ast/attribute';

import { Segment } from './compiler/segment';
const oldSub = Context.prototype.sub;

let counter = 0;

Object.assign(Context.prototype, {
    getGeneratedAndClear: function() {
        let result = [];
        for (let ctx = this; ctx; ctx = ctx.parent) {
            if (ctx._result.length === 0) continue;
            result = ctx._result.concat(result);
            ctx._result = [];
        }
        return result.join('');
    },

    getPath: function() {
        let result = null
        for (let ctx = this; ctx.parent; ctx = ctx.parent) {
            result = result !== null ? `${ctx.index}-${result}` : ctx.index;
        }
        return result;
    },

    sub: function(tag, idt) {
        const ctx = oldSub.call(this, tag, idt);
        ctx.index = this._children.indexOf(ctx);
        ctx.seqId = counter ++;

        const attr = new Attribute('sleet-seq', [new Attribute.Quoted(ctx.seqId)]);
        const group = new Attribute.Group([attr]);

        if (!tag._attributeGroups) tag._attributeGroups = [group];
        else tag._attributeGroups.push(group);

        return ctx;
    },

    startSegment: function(type, name) {
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

    endSegment: function() {
        const segment = this.root.segmentStack.pop();
        segment.append(this.getGeneratedAndClear());
        if (this.currentSegment()) this.currentSegment().append(segment.placeholder(), true);
        return segment;
    },

    currentSegment: function() {
        return this.root.segmentStack[this.root.segmentStack.length - 1];
    }
});
