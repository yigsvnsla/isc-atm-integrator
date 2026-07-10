import { ResponseBuilder } from './response-builder';
import { IResponseMetadata } from './response-metadata';

export interface IResponse<T> {
    readonly data: T;
    readonly metadata: IResponseMetadata;
}

export class Response<T> implements IResponse<T> {
    public constructor(
        public readonly data: T,
        public readonly metadata: IResponseMetadata,
    ) {}

    public static builder<T>(): ResponseBuilder<T> {
        return new ResponseBuilder<T>();
    }
}
