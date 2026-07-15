import { Account } from '@features/accounts/domain/account';
import { ApiProperty } from '@nestjs/swagger';
import type { IApiResponse } from '@shared/core/response/api-response';
import {
    type IApiResponseMetadata,
    ResponseMetadata,
} from '@shared/core/response/api-response-metadata';

export class GetAccountByIdResponse implements IApiResponse<Account> {
    @ApiProperty({ type: () => Account })
    public readonly data: Account;

    @ApiProperty({ type: () => ResponseMetadata })
    public readonly metadata: IApiResponseMetadata;

    constructor(data: Account, metadata: IApiResponseMetadata) {
        this.data = data;
        this.metadata = metadata;
    }
}
