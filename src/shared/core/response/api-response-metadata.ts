import {
    IResponseMetadataBuilder,
    ResponseMetadataBuilder,
} from './api-response-metadata-builder';
import { IApiResponseMetadataPagination } from './api-response-metadata-pagination';

export interface IApiResponseMetadata {
    readonly statusCode: number;
    readonly message: string;
    readonly pagination: IApiResponseMetadataPagination;
}

export class ResponseMetadata implements IApiResponseMetadata {
    constructor(
        public readonly statusCode: number,
        public readonly message: string,
        public readonly pagination: IApiResponseMetadataPagination,
    ) {}

    public static builder(): IResponseMetadataBuilder {
        return new ResponseMetadataBuilder();
    }
}
