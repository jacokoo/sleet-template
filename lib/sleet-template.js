'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style = undefined;
exports.getDefaultExtension = getDefaultExtension;
exports.overrideContext = overrideContext;

require('./context-overload');

var _segment = require('./compiler/segment');

var _tag = require('./compiler/tag');

var _blockTag = require('./compiler/block-tag');

var _elseTag = require('./compiler/else-tag');

var _valueIdentifier = require('./compiler/value-identifier');

var _valueHelper = require('./compiler/value-helper');

var PATH = 'sleet-template/lib/runtime';

function generateOutput(segments) {
    var result = 'var t={' + segments.map(function (e) {
        return e.index + ':' + e.getOutput();
    }).join(',') + '},\nm = {},S = function(i, o) {return R.handle(t, m, i, o);},\nT = function(object) {return t[0].text({stack: [object]})};\nT.update = function() {console.log(\'hello\');};';
    return result;
}

function wrapCommonJs(str, path) {
    return 'var R=require(\'' + path + '\');\n' + str + '\nmodule.exports=T;';
}

function wrapAmd(str, path) {
    return 'define([\'' + path + '\'], function(R) {\n    ' + str + '\n    return T;\n})';
}

function wrapFunction(str) {
    return new Function('R', str + 'return T;'); // eslint-disable-line no-new-func
}

var style = exports.style = 'function';

function getDefaultExtension() {
    return 'js';
}

function overrideContext(context, options) {
    var tpl = options.template || {};
    var path = tpl.runtimePath || PATH;
    var method = wrapCommonJs;
    if (tpl.style === 'function') method = wrapFunction;else if (tpl.style === 'amd') method = wrapAmd;

    context.startSegment(_segment.Segment.TYPE_ROOT);
    Object.assign(context, {
        getOutput: function getOutput() {
            this.endSegment();
            var result = generateOutput(this.segments);
            return method(result, path);
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