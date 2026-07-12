import { ResponseBuilder } from './api-response-builder';
import { IApiResponseMetadata } from './api-response-metadata';

export interface IApiResponse<T> {
    readonly data: T;
    readonly metadata: IApiResponseMetadata;
}

export class Response<T> implements IApiResponse<T> {
    public constructor(
        public readonly data: T,
        public readonly metadata: IApiResponseMetadata,
    ) {}

    public static builder<T>(): ResponseBuilder<T> {
        return new ResponseBuilder<T>();
    }
}
