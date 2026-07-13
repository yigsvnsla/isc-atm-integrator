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
    Version,
} from '@nestjs/common';
import { Mediator } from '@cqrs/mediator';
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
export class OrdersController {
    constructor(private readonly mediator: Mediator) {}

    @Post()
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    public async create(
        @Body() command: CreateOrderCommand,
    ): Promise<CreateOrderResponse> {
        return this.mediator.send<CreateOrderCommand, CreateOrderResponse>(
            command,
        );
    }

    @Get()
    @Version('1')
    public async list(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ): Promise<GetOrdersResponse> {
        return this.mediator.ask<GetOrdersQuery, GetOrdersResponse>(
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
        return this.mediator.ask<GetOrderByIdQuery, GetOrderByIdResponse>(
            new GetOrderByIdQuery(id),
        );
    }
}
