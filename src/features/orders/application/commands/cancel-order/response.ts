import { OrderResponse } from '../../responses/order-response';

export class CancelOrderResponse {
    public readonly order: OrderResponse;

    constructor(order: OrderResponse) {
        this.order = order;
    }
}
