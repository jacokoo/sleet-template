import { TemplateTagCompiler } from './tag';
import { Segment } from './segment';

export class BlockTagCompiler extends TemplateTagCompiler {
    compile (context, tag) {
        context.startSegment(Segment.TYPE_BLOCK, tag.name);
        this.content(context, tag);
        context.endSegment();
    }
}
