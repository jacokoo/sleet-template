import { TemplateTagCompiler } from './tag';

export class ElseTagCompiler extends TemplateTagCompiler {
    walk (context, tag) {
        if (tag.name === 'else') {
            const children = context._parent ? context._parent._children : context._children;
            const e = children.pop();
            const sibling = children.slice(-1)[0];
            e._parent = sibling;
            sibling._children.push(e);
        }
        super.walk(context, tag);
    }
}
