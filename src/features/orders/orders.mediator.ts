import { Mediator } from '@cqrs/mediator';
import { InMemoryOrderRepository } from './infrastructure/order.repository';
import { CreateOrderCommand } from './application/commands/create-order/command';
import { CreateOrderHandler } from './application/commands/create-order/handler';
import { CreateOrderMapper } from './application/commands/create-order/mapper';
import { GetOrdersQuery } from './application/queries/get-orders/query';
import { GetOrdersHandler } from './application/queries/get-orders/handler';
import { GetOrderByIdQuery } from './application/queries/get-order-by-id/query';
import { GetOrderByIdHandler } from './application/queries/get-order-by-id/handler';

const repository = new InMemoryOrderRepository();
const mediator = new Mediator();

mediator.registerCommand(
    CreateOrderCommand,
    new CreateOrderHandler(new CreateOrderMapper(), repository),
);
mediator.registerQuery(GetOrdersQuery, new GetOrdersHandler(repository));
mediator.registerQuery(GetOrderByIdQuery, new GetOrderByIdHandler(repository));

export const ordersMediator = mediator;
