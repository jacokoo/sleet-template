import * as a from './context-overload';

import { Segment } from './compiler/segment';
import { TemplateTagCompiler } from './compiler/tag';
import { BlockTagCompiler } from './compiler/block-tag';
import { ElseTagCompiler } from './compiler/else-tag';
import { ValueIdentifierCompiler } from './compiler/value-identifier';

function generateOutput(segments) {
    segments.forEach(e => console.log(e.text));
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
    context.registerCompiler('tag.if', new BlockTagCompiler());
    context.registerCompiler('tag.echo', new TemplateTagCompiler());
    context.registerCompiler('tag.else', new ElseTagCompiler());
    context.registerCompiler('value.identifier', new ValueIdentifierCompiler());
}
