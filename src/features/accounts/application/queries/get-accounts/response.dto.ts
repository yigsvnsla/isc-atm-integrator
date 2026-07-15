import { ApiProperty } from '@nestjs/swagger';
import { IApiResponse } from '@core/response/api-response';
import type { IApiResponseMetadata } from '@core/response/api-response-metadata';
import { ResponseMetadata } from '@core/response/api-response-metadata';
import { Account } from '@features/accounts/domain/account';

export class GetAccountsResponse implements IApiResponse<Account[]> {
    @ApiProperty({ type: () => Account, isArray: true })
    public readonly data: Account[];

    @ApiProperty({ type: () => ResponseMetadata })
    public readonly metadata: IApiResponseMetadata;

    constructor(data: Account[], metadata: IApiResponseMetadata) {
        this.data = data;
        this.metadata = metadata;
    }
}
