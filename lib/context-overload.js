'use strict';

var _context = require('sleet/lib/context');

var _blockTag = require('./compiler/block-tag');

var _segment = require('./compiler/segment');

// import { Attribute } from 'sleet/lib/ast/attribute';

var oldSub = _context.Context.prototype.sub;
var counter = 0;

Object.assign(_context.Context.prototype, {
    getGeneratedAndClear: function getGeneratedAndClear() {
        // eslint-disable-line object-shorthand
        var result = [];
        for (var ctx = this; ctx; ctx = ctx.parent) {
            if (ctx._result.length === 0) continue;
            result = ctx._result.concat(result);
            ctx._result = [];
        }
        return result.join('');
    },

    getPath: function getPath() {
        // eslint-disable-line object-shorthand
        var result = null;
        for (var ctx = this; ctx.parent; ctx = ctx.parent) {
            if (ctx._tag.name === 'else') continue;
            result = result !== null ? ctx.index + ',' + result : ctx.index;
        }
        return result;
    },

    sub: function sub(tag, idt) {
        // eslint-disable-line object-shorthand
        var indent = idt || 0;
        if (this.getCompiler(tag) instanceof _blockTag.BlockTagCompiler) indent -= 1;
        var ctx = oldSub.call(this, tag, indent);
        ctx.index = this._children.indexOf(ctx);
        ctx.seqId = counter++;

        // const attr = new Attribute('sleet-seq', [new Attribute.Quoted(ctx.seqId)]);
        // tag.addAttributeGroup(new Attribute.Group([attr]));

        return ctx;
    },

    startSegment: function startSegment(type, name) {
        // eslint-disable-line object-shorthand
        var segments = this.root.segments;
        var stack = this.root.segmentStack;
        if (!segments) {
            segments = this.root.segments = [];
            stack = this.root.segmentStack = [];
        }

        if (stack.length > 0) {
            stack[stack.length - 1].append(this.getGeneratedAndClear());
        }

        var segment = new _segment.Segment(segments.length, type, this, name);
        segments.push(segment);
        stack.push(segment);

        return segment;
    },

    endSegment: function endSegment() {
        // eslint-disable-line object-shorthand
        var segment = this.root.segmentStack.pop();
        segment.append(this.getGeneratedAndClear());
        if (this.currentSegment()) this.currentSegment().append(segment.placeholder(), true);
        return segment;
    },

    currentSegment: function currentSegment() {
        // eslint-disable-line object-shorthand
        return this.root.segmentStack[this.root.segmentStack.length - 1];
    }
});