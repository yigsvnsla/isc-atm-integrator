import { OrderResponse } from '../../responses/order-response';

export class GetOrderResponse {
    public readonly order: OrderResponse;

    constructor(order: OrderResponse) {
        this.order = order;
    }
}
