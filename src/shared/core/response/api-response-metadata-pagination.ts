export interface IApiResponseMetadataPagination {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export class ResponseMetadataPagination implements IApiResponseMetadataPagination {
    constructor(
        public readonly page: number,
        public readonly limit: number,
        public readonly totalPages: number,
        public readonly totalItems: number,
        public readonly hasNextPage: boolean,
        public readonly hasPreviousPage: boolean,
    ) {}
}
