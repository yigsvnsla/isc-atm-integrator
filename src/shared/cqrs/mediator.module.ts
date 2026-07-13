import { Module, Global } from '@nestjs/common';
import { Mediator } from './mediator';

@Global()
@Module({
    providers: [Mediator],
    exports: [Mediator],
})
export class MediatorModule {}
