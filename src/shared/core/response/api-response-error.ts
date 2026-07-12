export interface IApiResponseError {
    readonly id: string;
    readonly path: string;
    readonly code: string;
    readonly status: number;
    readonly cause: unknown;
    readonly message: string | string[];
    readonly timestamp: string;
}

export class ApiResponseError implements IApiResponseError {
    public constructor(
        public readonly id: string,
        public readonly message: string,
        public readonly code: string,
        public readonly status: number,
        public readonly cause: string,
        public readonly error: string,
        public readonly path: string,
        public readonly resource: string,
        public readonly timestamp: string,
    ) {}
}
