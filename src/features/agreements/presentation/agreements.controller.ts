import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
import { CreateAgreementCommand } from '../application/commands/create-agreement/command';
import { CreateAgreementResponse } from '../application/commands/create-agreement/response.dto';
import { GetAgreementsQuery } from '../application/queries/get-agreements/query';
import { GetAgreementByIdQuery } from '../application/queries/get-agreement-by-id/query';
import { GetAgreementByIdResponse } from '../application/queries/get-agreement-by-id/response.dto';
import { GetAgreementsResponse } from '../application/queries/get-agreements/response.dto';
import { ApiResponseError } from '@shared/core/response/api-response-error';
import { ResponseMetadata } from '@core/response/api-response-metadata';
import { ResponseMetadataPagination } from '@core/response/api-response-metadata-pagination';

@ApiTags('Agreements')
@ApiExtraModels(ResponseMetadata, ResponseMetadataPagination, ApiResponseError)
@Controller('agreements')
@UseInterceptors(
    ResilienceInterceptor(
        new ThrottleStrategy({ ttl: 60_000, limit: 30 }),
        new TimeoutStrategy(30_000),
    ),
)
export class AgreementsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Post()
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    public async create(
        @Body() command: CreateAgreementCommand,
    ): Promise<CreateAgreementResponse> {
        return this.commandBus.execute<CreateAgreementResponse>(command);
    }

    @Get()
    @Version('1')
    public async list(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('state') state?: string,
    ): Promise<GetAgreementsResponse> {
        return this.queryBus.execute<GetAgreementsResponse>(
            new GetAgreementsQuery(page, limit, state),
        );
    }

    @Get(':id')
    @Version('1')
    @ApiOkResponse({
        description: 'Agreement found',
        type: GetAgreementByIdResponse,
    })
    public async getById(
        @Param('id') id: string,
    ): Promise<GetAgreementByIdResponse> {
        return this.queryBus.execute<GetAgreementByIdResponse>(
            new GetAgreementByIdQuery(id),
        );
    }
}
