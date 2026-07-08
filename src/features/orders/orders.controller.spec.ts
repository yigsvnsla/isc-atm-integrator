import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { Mediator } from '../../shared/cqrs/mediator';
import { OrdersController } from './orders.controller';
import { CreateOrderCommand } from './application/commands/create-order/command';
import { GetOrderQuery } from './application/queries/get-order/query';
import { GetOrderListQuery } from './application/queries/get-order-list/query';
import { CancelOrderCommand } from './application/commands/cancel-order/command';
import { OrderStatus } from './domain/enums';
import { OrderResponse } from './application/responses/order-response';
import { CreateOrderResponse } from './application/commands/create-order/response';
import { GetOrderResponse } from './application/queries/get-order/response';
import { GetOrderListResponse } from './application/queries/get-order-list/response';
import { CancelOrderResponse } from './application/commands/cancel-order/response';

type MockMediator = {
    send: jest.Mock;
    ask: jest.Mock;
};

describe('OrdersController', () => {
    let controller: OrdersController;
    let mediator: MockMediator;

    beforeEach(async () => {
        mediator = {
            send: jest.fn(),
            ask: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrdersController],
            providers: [{ provide: Mediator, useValue: mediator }],
        }).compile();

        controller = module.get<OrdersController>(OrdersController);
    });

    const sampleOrder = (): OrderResponse =>
        new OrderResponse(
            '00000000-0000-4000-8000-000000000001',
            'alice',
            100,
            OrderStatus.PENDING,
        );

    describe('create', () => {
        it('sends CreateOrderCommand with dto fields', async () => {
            const expected = new CreateOrderResponse(sampleOrder());
            mediator.send.mockResolvedValue(expected);

            const result = await controller.create({
                customer: 'alice',
                total: 100,
            });

            expect(mediator.send).toHaveBeenCalledTimes(1);
            const sent = mediator.send.mock.calls[0][0] as CreateOrderCommand;
            expect(sent).toBeInstanceOf(CreateOrderCommand);
            expect(sent.customer).toBe('alice');
            expect(sent.total).toBe(100);
            expect(result).toBe(expected);
        });
    });

    describe('find', () => {
        it('asks GetOrderQuery by id', async () => {
            const expected = new GetOrderResponse(sampleOrder());
            mediator.ask.mockResolvedValue(expected);

            const result = await controller.find('order-1');

            expect(mediator.ask).toHaveBeenCalledTimes(1);
            const asked = mediator.ask.mock.calls[0][0] as GetOrderQuery;
            expect(asked).toBeInstanceOf(GetOrderQuery);
            expect(asked.id).toBe('order-1');
            expect(result).toBe(expected);
        });
    });

    describe('list', () => {
        it('asks GetOrderListQuery', async () => {
            const expected = new GetOrderListResponse([sampleOrder()]);
            mediator.ask.mockResolvedValue(expected);

            const result = await controller.list();

            expect(mediator.ask).toHaveBeenCalledTimes(1);
            const asked = mediator.ask.mock.calls[0][0] as GetOrderListQuery;
            expect(asked).toBeInstanceOf(GetOrderListQuery);
            expect(result).toBe(expected);
        });
    });

    describe('cancel', () => {
        it('sends CancelOrderCommand with id', async () => {
            const cancelled = new OrderResponse(
                '00000000-0000-4000-8000-000000000001',
                'alice',
                100,
                OrderStatus.CANCELLED,
            );
            const expected = new CancelOrderResponse(cancelled);
            mediator.send.mockResolvedValue(expected);

            const result = await controller.cancel('order-1');

            expect(mediator.send).toHaveBeenCalledTimes(1);
            const sent = mediator.send.mock.calls[0][0] as CancelOrderCommand;
            expect(sent).toBeInstanceOf(CancelOrderCommand);
            expect(sent.id).toBe('order-1');
            expect(result).toBe(expected);
        });
    });
});
