import { TemplateTagCompiler } from './tag';
import { Segment } from './segment';

export class BlockTagCompiler extends TemplateTagCompiler {
    compile (context, tag) {
        const segment = context.startSegment(Segment.TYPE_BLOCK, tag.name);

        tag.attributeGroups.forEach(g => g.attributes.filter(a => a.name !== 'sleet-seq')
            .forEach(a => segment.handleAttribute(a)));

        this.content(context, tag);
        context.endSegment();

        context.parent.containsIndent = true;   // eslint-disable-line no-param-reassign
        context.containsIndent = true; // eslint-disable-line no-param-reassign
    }
}
