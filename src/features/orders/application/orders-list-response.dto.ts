import { ApiProperty } from '@nestjs/swagger';
import { IApiResponse } from '@core/response/api-response';
import type { IApiResponseMetadata } from '@core/response/api-response-metadata';
import { ResponseMetadata } from '@core/response/api-response-metadata';
import { OrderResponseDto } from './orders-response.dto';

export class OrdersListResponse implements IApiResponse<OrderResponseDto[]> {
    public readonly data: OrderResponseDto[];

    @ApiProperty({ type: () => ResponseMetadata })
    public readonly metadata: IApiResponseMetadata;

    constructor(data: OrderResponseDto[], metadata: IApiResponseMetadata) {
        this.data = data;
        this.metadata = metadata;
    }
}
