import { IBuilder } from '../types';
import { IResponse } from './response';
import { Response } from './response';
import { IResponseMetadata } from './response-metadata';

export interface IResponseBuilder<T> extends IBuilder<IResponse<T>> {
    setData(data: T): IResponseBuilder<T>;
    setMetadata(metadata: IResponseMetadata): IResponseBuilder<T>;
}

export class ResponseBuilder<T> implements IResponseBuilder<T> {
    private data: T;
    private metadata: IResponseMetadata;

    public setData(data: T): IResponseBuilder<T> {
        this.data = data;
        return this;
    }

    public setMetadata(metadata: IResponseMetadata): IResponseBuilder<T> {
        this.metadata = metadata;
        return this;
    }

    public build(): IResponse<T> {
        return new Response<T>(this.data, this.metadata);
    }
}
