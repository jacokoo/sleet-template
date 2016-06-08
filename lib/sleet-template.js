'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getDefaultExtension = getDefaultExtension;
exports.overrideContext = overrideContext;

require('./context-overload');

var _segment = require('./compiler/segment');

var _tag = require('./compiler/tag');

var _blockTag = require('./compiler/block-tag');

var _elseTag = require('./compiler/else-tag');

var _valueIdentifier = require('./compiler/value-identifier');

function generateOutput(segments) {
    segments.forEach(function (e) {
        return console.log(e.text);
    });
}

function getDefaultExtension() {
    return 'js';
}

function overrideContext(context, options, declaration) {
    context.startSegment(_segment.Segment.TYPE_ROOT);

    var oldGetOutput = context.getOutput;
    Object.assign(context, {
        getOutput: function getOutput(noJoin) {
            this.endSegment();
            return generateOutput(this.segments);
        }
    });

    context.registerCompiler('tag', new _tag.TemplateTagCompiler());
    context.registerCompiler('tag.if', new _blockTag.BlockTagCompiler());
    context.registerCompiler('tag.echo', new _tag.TemplateTagCompiler());
    context.registerCompiler('tag.else', new _elseTag.ElseTagCompiler());
    context.registerCompiler('value.identifier', new _valueIdentifier.ValueIdentifierCompiler());
}