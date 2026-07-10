import { IBuilder } from '../types';
import { IResponseMetadata, ResponseMetadata } from './response-metadata';

export interface IResponseMetadataBuilder extends IBuilder<IResponseMetadata> {
    setStatusCode(statusCode: number): IResponseMetadataBuilder;
    setMessage(message: string): IResponseMetadataBuilder;
}

export class ResponseMetadataBuilder implements IResponseMetadataBuilder {
    private statusCode: number;
    private message: string;

    public setStatusCode(statusCode: number): IResponseMetadataBuilder {
        this.statusCode = statusCode;
        return this;
    }

    public setMessage(message: string): IResponseMetadataBuilder {
        this.message = message;
        return this;
    }

    public build(): IResponseMetadata {
        return new ResponseMetadata(this.statusCode, this.message);
    }
}
