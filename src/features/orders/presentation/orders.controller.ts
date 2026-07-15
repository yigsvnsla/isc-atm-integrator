import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    DefaultValuePipe,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseInterceptors,
    Version,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
    ResilienceInterceptor,
    ThrottleStrategy,
    TimeoutStrategy,
} from 'nestjs-resilience';
import { CreateOrderCommand } from '../application/commands/create-order/command';
import { CreateOrderResponse } from '../application/commands/create-order/response.dto';
import { GetOrdersQuery } from '../application/queries/get-orders/query';
import { GetOrderByIdQuery } from '../application/queries/get-order-by-id/query';
import { GetOrderByIdResponse } from '../application/queries/get-order-by-id/response.dto';
import { GetOrdersResponse } from '../application/queries/get-orders/response.dto';
import { ApiResponseError } from '@shared/core/response/api-response-error';
import { ResponseMetadata } from '@core/response/api-response-metadata';
import { ResponseMetadataPagination } from '@core/response/api-response-metadata-pagination';

@ApiTags('Orders')
@ApiExtraModels(ResponseMetadata, ResponseMetadataPagination, ApiResponseError)
@Controller('orders')
@UseInterceptors(
    ResilienceInterceptor(
        new ThrottleStrategy({ ttl: 60_000, limit: 30 }),
        new TimeoutStrategy(30_000),
    ),
)
export class OrdersController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Post()
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    public async create(
        @Body() command: CreateOrderCommand,
    ): Promise<CreateOrderResponse> {
        return this.commandBus.execute<CreateOrderResponse>(command);
    }

    @Get()
    @Version('1')
    public async list(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ): Promise<GetOrdersResponse> {
        return this.queryBus.execute<GetOrdersResponse>(
            new GetOrdersQuery(page, limit),
        );
    }

    @Get(':id')
    @Version('1')
    @ApiOkResponse({
        description: 'Order found',
        type: GetOrderByIdResponse,
    })
    public async getById(
        @Param('id') id: string,
    ): Promise<GetOrderByIdResponse> {
        return this.queryBus.execute<GetOrderByIdResponse>(
            new GetOrderByIdQuery(id),
        );
    }
}
