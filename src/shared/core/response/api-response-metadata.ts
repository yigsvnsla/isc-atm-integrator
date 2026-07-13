import { ApiProperty } from '@nestjs/swagger';
import {
    IResponseMetadataBuilder,
    ResponseMetadataBuilder,
} from './api-response-metadata-builder';
import type { IApiResponseMetadataPagination } from './api-response-metadata-pagination';
import { ResponseMetadataPagination } from './api-response-metadata-pagination';

export interface IApiResponseMetadata {
    readonly statusCode: number;
    readonly message: string;
    readonly pagination: IApiResponseMetadataPagination;
}

export class ResponseMetadata implements IApiResponseMetadata {
    @ApiProperty({ example: 200, description: 'HTTP status code' })
    public readonly statusCode: number;

    @ApiProperty({ example: 'OK', description: 'Response status message' })
    public readonly message: string;

    @ApiProperty({
        type: () => ResponseMetadataPagination,
        nullable: true,
        description: 'Pagination metadata (null if not paginated)',
    })
    public readonly pagination: IApiResponseMetadataPagination;

    constructor(
        statusCode: number,
        message: string,
        pagination: IApiResponseMetadataPagination,
    ) {
        this.statusCode = statusCode;
        this.message = message;
        this.pagination = pagination;
    }

    public static builder(): IResponseMetadataBuilder {
        return new ResponseMetadataBuilder();
    }
}
