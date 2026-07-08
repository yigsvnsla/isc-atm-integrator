import { Global, Module } from '@nestjs/common';
import { Mediator } from './mediator';

@Global()
@Module({
    providers: [Mediator],
    exports: [Mediator],
})
export class CqrsModule {}
