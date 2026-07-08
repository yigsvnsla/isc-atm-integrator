export class CreateOrderCommand {
    constructor(
        public readonly customer: string,
        public readonly total: number,
    ) {}
}
