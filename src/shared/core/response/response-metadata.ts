import {
    IResponseMetadataBuilder,
    ResponseMetadataBuilder,
} from './response-metadata-builder';

export interface IResponseMetadata {
    readonly statusCode: number;
    readonly message: string;
}

export class ResponseMetadata implements IResponseMetadata {
    constructor(
        public readonly statusCode: number,
        public readonly message: string,
    ) {}

    public static builder(): IResponseMetadataBuilder {
        return new ResponseMetadataBuilder();
    }
}
