import { OrderResponse } from '../../responses/order-response';

export class CreateOrderResponse {
    public readonly order: OrderResponse;

    constructor(order: OrderResponse) {
        this.order = order;
    }
}
