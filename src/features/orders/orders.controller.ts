import {
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
} from '@nestjs/common';
import { ordersMediator } from './orders.mediator';
import { CreateOrderCommand } from './application/commands/create-order/command';
import { CreateOrderResponse } from './application/commands/create-order/response';
import { GetOrdersQuery } from './application/queries/get-orders/query';
import { GetOrderByIdQuery } from './application/queries/get-order-by-id/query';
import { Order } from './domain/order';
import {
    OrderResponseDto,
    toOrderResponseDto,
} from './application/orders-response.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new order' })
    @ApiBody({ type: CreateOrderCommand })
    @ApiCreatedResponse({
        description: 'Order created',
        type: CreateOrderResponse,
    })
    public async create(
        @Body() command: CreateOrderCommand,
    ): Promise<CreateOrderResponse> {
        return ordersMediator.send<CreateOrderCommand, CreateOrderResponse>(
            command,
        );
    }

    @Get()
    @ApiOperation({ summary: 'List all orders' })
    @ApiOkResponse({
        description: 'List of orders',
        type: [OrderResponseDto],
    })
    public async list(): Promise<OrderResponseDto[]> {
        const orders = await ordersMediator.ask<GetOrdersQuery, Order[]>(
            new GetOrdersQuery(),
        );
        return orders.map(toOrderResponseDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order by id' })
    @ApiOkResponse({ description: 'Order found', type: OrderResponseDto })
    @ApiNotFoundResponse({ description: 'Order not found' })
    public async getById(@Param('id') id: string): Promise<OrderResponseDto> {
        const order = await ordersMediator.ask<GetOrderByIdQuery, Order>(
            new GetOrderByIdQuery(id),
        );
        return toOrderResponseDto(order);
    }
}
