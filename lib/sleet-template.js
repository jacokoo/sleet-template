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

var _valueHelper = require('./compiler/value-helper');

function generateOutput(segments) {
    console.log(segments);
    var result = '\n;(function(){var t={' + segments.map(function (e) {
        return e.index + ':' + e.getOutput();
    }).join(',') + '},\nr=require(\'./runtime/runtime\'),memo = {},S = function(i, o) {return r.handle(t, memo, i, o);},\nte = function(object) {return t[0].text({stack: [object]})};\nte.update = function() {console.log(\'hello\');};return te;\n})();';
    console.log(eval(result)({ a: 1, b: { name: 'bbbb' }, items: [{ id: 1, name: 'item1' }, { id: 2, name: 'item2' }] }));
    return result;
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
    context.registerCompiler('tag.else', new _elseTag.ElseTagCompiler());
    context.registerCompiler('value.identifier', new _valueIdentifier.ValueIdentifierCompiler());
    context.registerCompiler('value.helper.if', new _valueHelper.ValueHelperCompiler());

    context.registerCompiler('tag.if', new _blockTag.BlockTagCompiler());
    context.registerCompiler('tag.each', new _blockTag.BlockTagCompiler());
    context.registerCompiler('tag.with', new _blockTag.BlockTagCompiler());
    context.registerCompiler('tag.echo', new _blockTag.BlockTagCompiler());
    context.registerCompiler('tag.eq', new _blockTag.BlockTagCompiler());
}