import { ValueCompiler } from 'sleet/lib/compiler/value';
import { Segment } from './segment';

export class ValueIdentifierCompiler extends ValueCompiler {
    compile (context, value) {
        const segment = context.startSegment(Segment.TYPE_ATTRIBUTE, 'echo');
        segment.addBinding(value.value);
        context.endSegment();
    }
}
