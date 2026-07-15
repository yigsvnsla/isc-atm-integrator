import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    DefaultValuePipe,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseInterceptors,
    Version,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
    ResilienceInterceptor,
    ThrottleStrategy,
    TimeoutStrategy,
} from 'nestjs-resilience';
import { CreateAccountCommand } from '../application/commands/create-account/command';
import { CreateAccountResponse } from '../application/commands/create-account/response.dto';
import { GetAccountsQuery } from '../application/queries/get-accounts/query';
import { GetAccountByIdQuery } from '../application/queries/get-account-by-id/query';
import { GetAccountByIdResponse } from '../application/queries/get-account-by-id/response.dto';
import { GetAccountsResponse } from '../application/queries/get-accounts/response.dto';
import { ApiResponseError } from '@shared/core/response/api-response-error';
import { ResponseMetadata } from '@core/response/api-response-metadata';
import { ResponseMetadataPagination } from '@core/response/api-response-metadata-pagination';

@ApiTags('Accounts')
@ApiExtraModels(ResponseMetadata, ResponseMetadataPagination, ApiResponseError)
@Controller('accounts')
@UseInterceptors(
    ResilienceInterceptor(
        new ThrottleStrategy({ ttl: 60_000, limit: 30 }),
        new TimeoutStrategy(30_000),
    ),
)
export class AccountsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Post()
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    public async create(
        @Body() command: CreateAccountCommand,
    ): Promise<CreateAccountResponse> {
        return this.commandBus.execute<CreateAccountResponse>(command);
    }

    @Get()
    @Version('1')
    public async list(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('agreement_id') agreementId?: string,
        @Query('type') type?: string,
        @Query('state') state?: string,
    ): Promise<GetAccountsResponse> {
        return this.queryBus.execute<GetAccountsResponse>(
            new GetAccountsQuery(page, limit, agreementId, type, state),
        );
    }

    @Get(':id')
    @Version('1')
    public async getById(
        @Param('id') id: string,
    ): Promise<GetAccountByIdResponse> {
        return this.queryBus.execute<GetAccountByIdResponse>(
            new GetAccountByIdQuery(id),
        );
    }
}
