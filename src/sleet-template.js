import './context-overload';

import { Segment } from './compiler/segment';
import { TemplateTagCompiler } from './compiler/tag';
import { BlockTagCompiler } from './compiler/block-tag';
import { ElseTagCompiler } from './compiler/else-tag';
import { ValueIdentifierCompiler } from './compiler/value-identifier';
import { ValueHelperCompiler } from './compiler/value-helper';

function generateOutput(segments) {
    console.log(segments);
    const result =
`
;(function(){var t={${segments.map(e => `${e.index}:${e.getOutput()}`).join(',')}},
r=require('./runtime/runtime'),m = {},S = function(i, o) {return r.handle(t, m, i, o);},
T = function(object) {return t[0].text({stack: [object]})};
T.update = function() {console.log('hello');};return T;
})();`;
    console.log(eval(result)({a: 1, b: {name: 'bbbb'}, items: [{id: 1, name: 'item1'}, {id: 2, name: 'item2'}]}));
    return result;
}

export function getDefaultExtension () { return 'js'; }

export function overrideContext (context, options, declaration) {
    context.startSegment(Segment.TYPE_ROOT);

    const oldGetOutput = context.getOutput;
    Object.assign(context, {
        getOutput: function(noJoin) {
            this.endSegment();
            return generateOutput(this.segments);
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
