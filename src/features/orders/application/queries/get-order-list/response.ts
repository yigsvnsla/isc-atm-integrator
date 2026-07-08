import { OrderResponse } from '../../responses/order-response';

export class GetOrderListResponse {
    public readonly orders: OrderResponse[];

    constructor(orders: OrderResponse[]) {
        this.orders = orders;
    }
}
