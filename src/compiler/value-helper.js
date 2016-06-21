import { ValueCompiler } from 'sleet/lib/compiler/value';
import { Segment } from './segment';

export class ValueHelperCompiler extends ValueCompiler {
    compile (context, value) {
        const segment = context.startSegment(Segment.TYPE_HELPER, value.name);
        value.attributes.forEach(a => segment.handleAttribute(a));
        context.endSegment();
    }
}
