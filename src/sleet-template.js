import './context-overload';

import { Segment } from './compiler/segment';
import { TemplateTagCompiler } from './compiler/tag';
import { BlockTagCompiler } from './compiler/block-tag';
import { ElseTagCompiler } from './compiler/else-tag';
import { ValueIdentifierCompiler } from './compiler/value-identifier';

import { ValueHelperCompiler } from './compiler/value-helper';

const PATH = 'sleet-template/lib/runtime';

function generateOutput (segments) {
    const result =
`var t={${segments.map(e => `${e.index}:${e.getOutput()}`).join(',')}},
m = {},S = function(i, o) {return R.handle(t, m, i, o);},
T = function(object) {return t[0].text({stack: [object]})};
T.update = function() {console.log('hello');};`;
    return result;
}

function wrapCommonJs (str, path) {
    return `var R=require('${path}');
${str}
module.exports=T;`;
}

function wrapAmd (str, path) {
    return `define(['${path}'], function(R) {
    ${str}
    return T;
})`;
}

function wrapFunction (str) {
    return new Function('R', `${str}return T;`); // eslint-disable-line no-new-func
}

export const style = 'function';

export function getDefaultExtension () { return 'js'; }

export function overrideContext (context, options) {
    const tpl = options.template || {};
    const path = tpl.runtimePath || PATH;
    let method = wrapCommonJs;
    if (tpl.style === 'function') method = wrapFunction;
    else if (tpl.style === 'amd') method = wrapAmd;

    context.startSegment(Segment.TYPE_ROOT);
    Object.assign(context, {
        getOutput () {
            this.endSegment();
            const result = generateOutput(this.segments);
            return method(result, path);
        }
    });

    context.registerCompiler('tag', new TemplateTagCompiler());
    context.registerCompiler('tag.else', new ElseTagCompiler());
    context.registerCompiler('value.identifier', new ValueIdentifierCompiler());
    context.registerCompiler('value.helper.if', new ValueHelperCompiler());

    context.registerCompiler('tag.if', new BlockTagCompiler());
    context.registerCompiler('tag.each', new BlockTagCompiler());
    context.registerCompiler('tag.with', new BlockTagCompiler());
    context.registerCompiler('tag.echo', new BlockTagCompiler());
    context.registerCompiler('tag.eq', new BlockTagCompiler());
}
