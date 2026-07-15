import { NotFoundException, Inject, HttpStatus } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import {
    ResilienceCommand,
    CircuitBreakerStrategy,
    TimeoutStrategy,
} from 'nestjs-resilience';
import { ACCOUNT_REPOSITORY } from '@features/accounts/domain/account.repository';
import type { IAccountRepository } from '@features/accounts/domain/account.repository';
import { GetAccountByIdQuery } from './query';
import { GetAccountByIdResponse } from './response.dto';
import { ResponseMetadataBuilder } from '@shared/core/response/api-response-metadata-builder';
import { Account } from '@features/accounts/domain/account';

@QueryHandler(GetAccountByIdQuery)
export class GetAccountByIdHandler
    extends ResilienceCommand
    implements IQueryHandler<GetAccountByIdQuery, GetAccountByIdResponse>
{
    public constructor(
        @Inject(ACCOUNT_REPOSITORY)
        private readonly repository: IAccountRepository,
    ) {
        super([
            new CircuitBreakerStrategy({
                requestVolumeThreshold: 3,
                sleepWindowInMilliseconds: 10_000,
                errorThresholdPercentage: 50,
            }),
            new TimeoutStrategy(3000),
        ]);
    }

    public async run(
        query: GetAccountByIdQuery,
    ): Promise<GetAccountByIdResponse> {
        const account = await this.repository.findById(query.getId());
        if (!account) {
            throw new NotFoundException(
                `Account with ID ${query.getId()} not found`,
            );
        }

        const metadata = new ResponseMetadataBuilder()
            .setStatusCode(HttpStatus.OK)
            .setMessage('OK')
            .build();

        return new GetAccountByIdResponse(
            account as unknown as Account,
            metadata,
        );
    }
}
