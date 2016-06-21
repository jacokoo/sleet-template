import { TemplateTagCompiler } from './tag';
import { Segment } from './segment';

export class ElseTagCompiler extends TemplateTagCompiler {
    walk (context, tag) {
        const children = context._parent ? context._parent._children : context._children;
        const e = children.pop();
        const sibling = children.slice(-1)[0];
        e._parent = sibling;
        sibling._children.push(e);
        super.walk(context, tag);
        e._index = sibling._children.indexOf(e);
    }

    compile (context, tag) {
        const parent = context.endSegment();
        const segment = context.startSegment(Segment.TYPE_ELSE, tag.name);
        parent.setElsePart(segment);
        this.content(context, tag);
    }
}
