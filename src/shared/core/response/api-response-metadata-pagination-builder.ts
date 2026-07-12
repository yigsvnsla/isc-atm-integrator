import { IBuilder } from '../types';
import {
    IApiResponseMetadataPagination,
    ResponseMetadataPagination,
} from './api-response-metadata-pagination';

export interface IApiResponseMetadataPaginationBuilder extends IBuilder<IApiResponseMetadataPagination> {
    setPage(page: number): IApiResponseMetadataPaginationBuilder;
    setLimit(limit: number): IApiResponseMetadataPaginationBuilder;
    setTotalPages(totalPages: number): IApiResponseMetadataPaginationBuilder;
    setTotalItems(totalItems: number): IApiResponseMetadataPaginationBuilder;
    setHasNextPage(hasNextPage: boolean): IApiResponseMetadataPaginationBuilder;
    setHasPreviousPage(
        hasPreviousPage: boolean,
    ): IApiResponseMetadataPaginationBuilder;
}

export class ResponseMetadataPaginationBuilder implements IApiResponseMetadataPaginationBuilder {
    private page: number;
    private limit: number;
    private totalPages: number;
    private totalItems: number;
    private hasNextPage: boolean;
    private hasPreviousPage: boolean;

    public setPage(page: number): IApiResponseMetadataPaginationBuilder {
        this.page = page;
        return this;
    }

    public setLimit(limit: number): IApiResponseMetadataPaginationBuilder {
        this.limit = limit;
        return this;
    }

    public setTotalPages(
        totalPages: number,
    ): IApiResponseMetadataPaginationBuilder {
        this.totalPages = totalPages;
        return this;
    }

    public setTotalItems(
        totalItems: number,
    ): IApiResponseMetadataPaginationBuilder {
        this.totalItems = totalItems;
        return this;
    }

    public setHasNextPage(
        hasNextPage: boolean,
    ): IApiResponseMetadataPaginationBuilder {
        this.hasNextPage = hasNextPage;
        return this;
    }

    public setHasPreviousPage(
        hasPreviousPage: boolean,
    ): IApiResponseMetadataPaginationBuilder {
        this.hasPreviousPage = hasPreviousPage;
        return this;
    }

    public build(): IApiResponseMetadataPagination {
        return new ResponseMetadataPagination(
            this.page,
            this.limit,
            this.totalPages,
            this.totalItems,
            this.hasNextPage,
            this.hasPreviousPage,
        );
    }
}
