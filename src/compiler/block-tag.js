import { TemplateTagCompiler } from './tag';
import { Segment } from './segment';
import { Attribute } from 'sleet/lib/ast/attribute';

export class BlockTagCompiler extends TemplateTagCompiler {
    compile (context, tag) {
        const segment = context.startSegment(Segment.TYPE_BLOCK, tag.name);

        tag.attributeGroups.forEach(g => g.attributes.filter(a => a.name !== 'sleet-seq')
            .forEach(a => segment.handleAttribute(a)));

        this.content(context, tag);
        context.endSegment();

        context.parent.containsIndent = true;
    }
}
