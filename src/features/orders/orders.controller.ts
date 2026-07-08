import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
    HttpCode,
    HttpStatus,
    Inject,
} from '@nestjs/common';
import { Mediator } from '../../shared/cqrs/mediator';
import { CreateOrderCommand } from './application/commands/create-order/command';
import { CancelOrderCommand } from './application/commands/cancel-order/command';
import { GetOrderQuery } from './application/queries/get-order/query';
import { GetOrderListQuery } from './application/queries/get-order-list/query';
import { CreateOrderResponse } from './application/commands/create-order/response';
import { CancelOrderResponse } from './application/commands/cancel-order/response';
import { GetOrderResponse } from './application/queries/get-order/response';
import { GetOrderListResponse } from './application/queries/get-order-list/response';
import { CreateOrderDto } from './presentation/dto/create-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(@Inject(Mediator) private readonly mediator: Mediator) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async create(
        @Body() dto: CreateOrderDto,
    ): Promise<CreateOrderResponse> {
        return this.mediator.send<CreateOrderCommand, CreateOrderResponse>(
            new CreateOrderCommand(dto.customer, dto.total),
        );
    }

    @Get(':id')
    public async find(@Param('id') id: string): Promise<GetOrderResponse> {
        return this.mediator.ask<GetOrderQuery, GetOrderResponse>(
            new GetOrderQuery(id),
        );
    }

    @Get()
    public async list(): Promise<GetOrderListResponse> {
        return this.mediator.ask<GetOrderListQuery, GetOrderListResponse>(
            new GetOrderListQuery(),
        );
    }

    @Patch(':id/cancel')
    public async cancel(@Param('id') id: string): Promise<CancelOrderResponse> {
        return this.mediator.send<CancelOrderCommand, CancelOrderResponse>(
            new CancelOrderCommand(id),
        );
    }
}
